const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection config
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // or your MySQL username
  password: "123456789", // replace with your actual password
  database: "study_lounge",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Sign Up
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).send("Email already exists.");
        }
        return res.status(500).send("Database error.");
      }
      res.status(201).send("User registered successfully.");
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).send("Database error.");
    if (results.length === 0) return res.status(404).send("User not found.");

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.send("Login successful.");
    } else {
      res.status(401).send("Incorrect password.");
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
