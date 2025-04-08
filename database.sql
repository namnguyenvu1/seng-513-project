-- Create the database
CREATE DATABASE IF NOT EXISTS study_lounge;
USE study_lounge;

-- Create users table with skin and hair columns
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    skin VARCHAR(255), -- Column to store skin selection
    hair VARCHAR(255)  -- Column to store hair selection
);

-- Insert a sample user
INSERT INTO users (id, email, password, skin, hair) VALUES
(1, 'k@gmail.com', '$2b$10$YsV0eLDoyb7154dcSzA3DODuLaxPd5iUCbF9DHF7nov7dYsPmZzTu', NULL, NULL);

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