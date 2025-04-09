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
  password: "vunamnguyen123", // replace with your actual password
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

// Reset password route (assuming email is passed too)
app.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (err, result) => {
        if (err) return res.status(500).send("Database error.");
        if (result.affectedRows === 0) return res.status(404).send("User not found.");
        res.send("Password updated successfully.");
      }
    );
  });
  

app.get("/friends", (req, res) => {
  db.query("SELECT name, avatar FROM friends", (err, results) => {
    if (err) return res.status(500).send("DB error");
    res.json(results);
  });
});

app.post("/friends/remove", (req, res) => {
  const { name } = req.body;
  db.query("DELETE FROM friends WHERE name = ?", [name], (err) => {
    if (err) return res.status(500).send("Failed to remove friend");
    res.send("Friend removed");
  });
});

app.post("/update-profile", (req, res) => {
  const { email, skin, hair, username, bio } = req.body;

  db.query(
    "UPDATE users SET skin = ?, hair = ?, username = ?, bio = ? WHERE email = ?",
    [skin, hair, username, bio, email],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Database error");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("User not found");
      }
      res.json({ message: "Profile updated successfully" });
    }
  );
});

app.get("/get-profile", (req, res) => {
  const { email } = req.query;

  db.query(
    "SELECT skin, hair, username, bio FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).send("Database error.");
      if (results.length === 0) return res.status(404).send("User not found.");
      res.json(results[0]);
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
