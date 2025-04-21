-- Create the database
DROP DATABASE IF EXISTS study_lounge;
CREATE DATABASE study_lounge;
USE study_lounge;

-- Create users table with skin, hair, username, and bio columns
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    skin VARCHAR(255), -- Column to store skin selection
    hair VARCHAR(255), -- Column to store hair selection
    username VARCHAR(255) DEFAULT 'User Name',
    bio VARCHAR(1000) DEFAULT 'Lorem ipsum dolor sit amet...'
);

-- Insert sample users (note: change IDs to be unique or let them auto-increment)
INSERT INTO users (email, password, skin, hair) VALUES
('k@gmail.com', '$2b$10$YsV0eLDoyb7154dcSzA3DODuLaxPd5iUCbF9DHF7nov7dYsPmZzTu', NULL, NULL),
('a@gmail.com', '$2b$10$1XQ/pLLJben/h92TKYvMju77BMW7mHSfaNfQ7beir8tLcVeHPcQnW', NULL, NULL),
('b@gmail.com', '$2b$10$1XQ/pLLJben/h92TKYvMju77BMW7mHSfaNfQ7beir8tLcVeHPcQnW', NULL, NULL),
('c@gmail.com', '$2b$10$1XQ/pLLJben/h92TKYvMju77BMW7mHSfaNfQ7beir8tLcVeHPcQnW', NULL, NULL);

INSERT INTO users (email, password, skin, hair, username) VALUES
('albert@gmail.com', '$2b$10$1XQ/pLLJben/h92TKYvMju77BMW7mHSfaNfQ7beir8tLcVeHPcQnW', NULL, NULL, 'Albert'),
('bonnie@gmail.com', '$2b$10$1XQ/pLLJben/h92TKYvMju77BMW7mHSfaNfQ7beir8tLcVeHPcQnW', NULL, NULL, 'Bonnie'),
('chirag@gmail.com', '$2b$10$1XQ/pLLJben/h92TKYvMju77BMW7mHSfaNfQ7beir8tLcVeHPcQnW', NULL, NULL, 'Chirag');

-- Create the administration table
CREATE TABLE IF NOT EXISTS administration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'staff') NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insert initial admin and staff users
INSERT INTO administration (name, role, password) VALUES
('admin', 'admin', '$2b$10$1XQ/pLLJben/h92TKYvMju77BMW7mHSfaNfQ7beir8tLcVeHPcQnW'), -- Password: 123
('staff', 'staff', '$2b$10$1XQ/pLLJben/h92TKYvMju77BMW7mHSfaNfQ7beir8tLcVeHPcQnW'); -- Password: 123

-- Create the new friends table
CREATE TABLE IF NOT EXISTS friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL, -- Current user's email
    friend_email VARCHAR(255) NOT NULL, -- Friend's email
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (friend_email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS todo_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    note TEXT NOT NULL,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);
