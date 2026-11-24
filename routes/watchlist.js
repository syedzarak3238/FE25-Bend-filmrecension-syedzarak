const express = require('express');
const pool = require('../db');
const authenticate = require('../middleware/auth');
const Movie = require('../models/Movie');
const { parseId } = require('../utils/validators');

const router = express.Router();

// Every watchlist route needs a signed-in user.
router.use(authenticate);

// GET /api/watchlist  - only MY saved movies
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.title, m.genre, m.release_year
       FROM watchlist w
       JOIN movies m ON m.id = w.movie_id
       WHERE w.user_id = ?
       ORDER BY m.title`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});


// POST /api/watchlist/:movieId
router.post('/:movieId', async (req, res, next) => {
  try {
    const movieId = parseId(req.params.movieId);
    if (movieId === null) {
      return res.status(400).json({ error: 'Movie id must be a positive whole number' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await pool.query('INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)', [
      req.user.id,
      movieId,
    ]);
    res.status(201).json({ message: 'Movie added to your watchlist', movie });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Movie is already in your watchlist' });
    }
    next(err);
  }
});

// DELETE /api/watchlist/:movieId
router.delete('/:movieId', async (req, res, next) => {
  try {
    const movieId = parseId(req.params.movieId);
    if (movieId === null) {
      return res.status(400).json({ error: 'Movie id must be a positive whole number' });
    }

    // user_id comes from the token, so users can only delete their own entries.
    const [result] = await pool.query(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [req.user.id, movieId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie is not in your watchlist' });
    }
    res.json({ message: 'Movie removed from your watchlist' });
  } catch (err) {
    next(err);
  }
});



module.exports = router;