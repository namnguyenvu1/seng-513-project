-- Create the database
CREATE DATABASE IF NOT EXISTS study_lounge;
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

-- Create friends table with foreign key reference to users
CREATE TABLE IF NOT EXISTS friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample friends for user_id = 1
INSERT INTO friends (user_id, name, avatar) VALUES
(1, 'John Doe', '/avatar1.png'),
(1, 'Mary Sue', '/avatar2.png'),
(1, 'User 1', '/avatar3.png'),
(1, 'User 2', '/avatar4.png');
