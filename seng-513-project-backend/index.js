const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root@localhost', // replace with your MySQL username
    password: 'vunamnguyen123', // replace with your MySQL password
    database: 'seng_513_project' // updated to use seng_513_project
});

// Login route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    // Check if user already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length > 0) return res.status(400).send('Username already exists');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', 
            [username, hashedPassword], 
            (err, results) => {
                if (err) return res.status(500).send('Server error');
                res.status(201).send('User registered successfully');
            });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});