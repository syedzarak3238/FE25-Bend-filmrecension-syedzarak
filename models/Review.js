const pool = require('../db');

// Class 2: Review. Wraps review data, its SQL, and the ownership rule.
class Review {
  constructor({ id, user_id, movie_id, rating, comment }) {
    this.id = id;
    this.user_id = user_id;
    this.movie_id = movie_id;
    this.rating = rating;
    this.comment = comment;
  }

  isOwnedBy(userId) {
    return this.user_id === userId;
  }

  static async findByMovie(movieId) {
    const [rows] = await pool.query(
      'SELECT id, user_id, movie_id, rating, comment FROM reviews WHERE movie_id = ? ORDER BY id',
      [movieId]
    );
    return rows.map((row) => new Review(row));
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, user_id, movie_id, rating, comment FROM reviews WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? new Review(rows[0]) : null;
  }

  static async create(userId, movieId, rating, comment) {
    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, movieId, rating, comment]
    );
    return new Review({
      id: result.insertId,
      user_id: userId,
      movie_id: movieId,
      rating,
      comment,
    });
  }

  async save() {
    await pool.query('UPDATE reviews SET rating = ?, comment = ? WHERE id = ?', [
      this.rating,
      this.comment,
      this.id,
    ]);
    return this;
  }
}

module.exports = Review;