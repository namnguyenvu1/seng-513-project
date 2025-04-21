const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY);


const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection config
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root", // or your MySQL username
//   password: "vunamnguyen123", // replace with your actual password
//   database: "study_lounge",
// });
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || "db", // Use the environment variable or default to 'db'
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "vunamnguyen123",
  database: process.env.MYSQL_DATABASE || "study_lounge",
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
  
// Troublesome code (F*** this part)
// app.get("/friends", (req, res) => {
//   db.query("SELECT name, avatar FROM friends", (err, results) => {
//     if (err) return res.status(500).send("DB error");
//     res.json(results);
//   });
// });

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

// Admin/Staff Page
app.post("/admin-login", (req, res) => {
  const { name, password } = req.body;

  db.query("SELECT * FROM administration WHERE name = ?", [name], async (err, results) => {
    if (err) return res.status(500).send("Database error.");
    if (results.length === 0) return res.status(404).send("Admin/Staff not found.");

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      res.json({ message: "Login successful", role: admin.role });
    } else {
      res.status(401).send("Incorrect password.");
    }
  });
});

// Create new admin/staff
app.post("/create-admin-staff", async (req, res) => {
  const { name, role, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO administration (name, role, password) VALUES (?, ?, ?)",
    [name, role, hashedPassword],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).send("Name already exists.");
        }
        return res.status(500).send("Database error.");
      }
      res.status(201).send("Admin/Staff created successfully.");
    }
  );
});

// Search user by email or username
app.get("/search-user", (req, res) => {
  const { query } = req.query;

  db.query(
    "SELECT email, skin, hair, username, bio FROM users WHERE email = ? OR username = ?",
    [query, query],
    (err, results) => {
      if (err) return res.status(500).send("Database error.");
      if (results.length === 0) return res.status(404).send("User not found.");
      res.json(results);
    }
  );
});

// Delete user by email
app.delete("/delete-user", (req, res) => {
  const { email } = req.body;

  db.query("DELETE FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).send("Database error.");
    if (result.affectedRows === 0) return res.status(404).send("User not found.");
    res.send("User deleted successfully.");
  });
});

// Create new user
app.post("/create-user", async (req, res) => {
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
      res.status(201).send("User created successfully.");
    }
  );
});

// Change user password
app.post("/change-password", async (req, res) => {
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

// Change staff password
app.post("/change-staff-password", async (req, res) => {
  const { name, newStaffPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newStaffPassword, 10);

  db.query(
    "UPDATE administration SET password = ? WHERE name = ? AND role = 'staff'",
    [hashedPassword, name],
    (err, result) => {
      if (err) return res.status(500).send("Database error.");
      if (result.affectedRows === 0) return res.status(404).send("Staff not found.");
      res.send("Password updated successfully.");
    }
  );
});

// Change admin's password
app.post("/change-admin-password", async (req, res) => {
  const { name, newAdminPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newAdminPassword, 10);

  db.query(
    "UPDATE administration SET password = ? WHERE name = ? AND role = 'admin'",
    [hashedPassword, name],
    (err, result) => {
      if (err) return res.status(500).send("Database error.");
      if (result.affectedRows === 0) return res.status(404).send("Admin not found.");
      res.send("Password updated successfully.");
    }
  );
});

// Delete admin/staff
app.delete("/delete-admin-staff", (req, res) => {
  const { name } = req.body;

  db.query("DELETE FROM administration WHERE name = ?", [name], (err, result) => {
    if (err) return res.status(500).send("Database error.");
    if (result.affectedRows === 0) return res.status(404).send("Admin/Staff not found.");
    res.send("Admin/Staff deleted successfully.");
  });
});

// EXPERIMENTAL SECTIONS (Mainstream now)
app.get("/all-users", (req, res) => {
  const { email } = req.query;

  db.query(
    `SELECT u.email, u.username, u.skin, u.hair 
     FROM users u
     WHERE u.email != ? 
     AND u.email NOT IN (
       SELECT f.friend_email 
       FROM friends f 
       WHERE f.email = ?
     )
     ORDER BY u.username ASC
     LIMIT 50`,
    [email, email],
    (err, results) => {
      if (err) {
        console.log("Database error:", err); // Log the error
        return res.status(500).send("Database error.");
      }
      res.json(results);
    }
  );
});

app.get("/friends", (req, res) => {
  const { email } = req.query;

  db.query(
    `SELECT u.email, u.username, u.skin, u.hair 
    FROM users u 
    INNER JOIN friends f ON u.email = f.friend_email 
    WHERE f.email = ?`,
    [email],
    (err, results) => {
      if (err) {
        console.log("Database error:", err); // Log the error
        return res.status(500).send("Database error.");
      }
      res.json(results);
    }
  );
});

app.post("/follow-friend", (req, res) => {
  const { email, friend_email } = req.body;

  db.query(
    "INSERT INTO friends (email, friend_email) VALUES (?, ?)",
    [email, friend_email],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).send("Already following this user.");
        }
        return res.status(500).send("Database error.");
      }
      res.status(201).send("Friend followed successfully.");
    }
  );
});

app.delete("/unfollow-friend", (req, res) => {
  const { email, friend_email } = req.body;

  db.query(
    "DELETE FROM friends WHERE email = ? AND friend_email = ?",
    [email, friend_email],
    (err, result) => {
      if (err) {
        console.log("Database error:", err); // Log the error
        return res.status(500).send("Database error.");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Friend not found.");
      }
      res.send("Friend unfollowed successfully.");
    }
  );
});

// EXPERIMENTAL SECTIONS (AI) (Mainstream now)
// Initialize Groq client
const { Groq } = require("groq-sdk");
const groqClient = new Groq({
  api_key: process.env.GROQ_API_KEY, // Store your API key in an environment variable
});

app.post("/ai-response", async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.1-8b-instant", // You can change the model if needed
    });

    const aiResponse = chatCompletion.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error with Groq API:", error);
    res.status(500).send("Failed to get AI response.");
  }
});

// EXPERIMENTAL SECTIONS 3 (Mainstream now)
// Get all to-do items for a user
app.get("/todo", (req, res) => {
  const { email } = req.query;

  db.query(
    "SELECT id, note FROM todo_list WHERE user_email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).send("Database error.");
      res.json(results);
    }
  );
});

// Add a new to-do item
app.post("/todo", (req, res) => {
  const { email, note } = req.body;

  db.query(
    "INSERT INTO todo_list (user_email, note) VALUES (?, ?)",
    [email, note],
    (err, result) => {
      if (err) return res.status(500).send("Database error.");
      res.status(201).json({ id: result.insertId }); // Return the new task's ID
    }
  );
});

// Delete a to-do item
app.delete("/todo", (req, res) => {
  const { id } = req.body;

  db.query("DELETE FROM todo_list WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send("Database error.");
    if (result.affectedRows === 0) return res.status(404).send("To-do item not found.");
    res.send("To-do item deleted successfully.");
  });
});

// EXPERIMENTAL SECTIONS 4
// Get the total number of users
app.get("/user-count", (req, res) => {
  db.query("SELECT COUNT(*) AS userCount FROM users", (err, results) => {
    if (err) return res.status(500).send("Database error.");
    res.json({ userCount: results[0].userCount });
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
