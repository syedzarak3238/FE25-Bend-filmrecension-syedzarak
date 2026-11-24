const pool = require('../db');

// Class 1: Movie. Wraps movie data and the SQL for reading movies.
class Movie {
  constructor({ id, title, genre, release_year }) {
    this.id = id;
    this.title = title;
    this.genre = genre;
    this.release_year = release_year;
  }

  static async findAll() {
    const [rows] = await pool.query(
      'SELECT id, title, genre, release_year FROM movies ORDER BY id'
    );
    return rows.map((row) => new Movie(row));
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, title, genre, release_year FROM movies WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? new Movie(rows[0]) : null;
  }
}

module.exports = Movie;