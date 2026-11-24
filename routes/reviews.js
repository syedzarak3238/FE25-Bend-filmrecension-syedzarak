const express = require('express');
const authenticate = require('../middleware/auth');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const { parseId } = require('../utils/validators');

const router = express.Router();

// GET /api/movies/:movieId/reviews  (public)
router.get('/movies/:movieId/reviews', async (req, res, next) => {
  try {
    const movieId = parseId(req.params.movieId);
    if (movieId === null) {
      return res.status(400).json({ error: 'Movie id must be a positive whole number' });
    }
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const reviews = await Review.findByMovie(movieId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

module.exports = router;