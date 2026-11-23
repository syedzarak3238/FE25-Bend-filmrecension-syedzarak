-- Creates everything from scratch. Run with:  mysql -u zarak -p < database/setup.sql
DROP DATABASE IF EXISTS filmrecension;
CREATE DATABASE filmrecension CHARACTER SET utf8mb4;
USE filmrecension;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),npm
  release_year INT
);

-- DESIGN CHOICE: one review per user per movie (UNIQUE below).
-- Be ready to explain why, and what you'd change to allow several.
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 10),
  comment TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  UNIQUE (user_id, movie_id)
);

CREATE TABLE watchlist (
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Sample movies (change or add your own)
INSERT INTO movies (title, genre, release_year) VALUES
  ('Inception', 'Sci-Fi', 2010),
  ('The Godfather', 'Crime', 1972),
  ('Spirited Away', 'Animation', 2001);
