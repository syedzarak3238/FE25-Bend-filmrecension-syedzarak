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

// Shared validation for POST and PUT. Returns an error string or null.
function validateReviewBody(rating, comment) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    return 'Rating must be a whole number from 1 to 10';
  }
  if (typeof comment !== 'string' || comment.trim() === '') {
    return 'Comment is required';
  }
  return null;
}

// POST /api/movies/:movieId/reviews  (signed in)
router.post('/movies/:movieId/reviews', authenticate, async (req, res, next) => {
  try {
    const movieId = parseId(req.params.movieId);
    if (movieId === null) {
      return res.status(400).json({ error: 'Movie id must be a positive whole number' });
    }

    const { rating, comment } = req.body || {};
    const problem = validateReviewBody(rating, comment);
    if (problem) {
      return res.status(400).json({ error: problem });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const review = await Review.create(req.user.id, movieId, rating, comment.trim());
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'You have already reviewed this movie. Edit it with PUT /api/reviews/:id',
      });
    }
    next(err);
  }
});

// PUT /api/reviews/:id  (owner only)
router.put('/reviews/:id', authenticate, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Review id must be a positive whole number' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (!review.isOwnedBy(req.user.id)) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    const { rating, comment } = req.body || {};
    const problem = validateReviewBody(rating, comment);
    if (problem) {
      return res.status(400).json({ error: problem });
    }

    review.rating = rating;
    review.comment = comment.trim();
    await review.save();
    res.json(review);
  } catch (err) {
    next(err);
  }
});

module.exports = router;