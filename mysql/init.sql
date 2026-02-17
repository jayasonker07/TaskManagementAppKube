CREATE DATABASE IF NOT EXISTS taskdb;
USE taskdb;

CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, completed) VALUES 
('Welcome Task', 'This is a sample task', FALSE),
('Learn Docker', 'Learn Docker and Docker Compose', FALSE),
('Build Task App', 'Complete the Task application', FALSE);
