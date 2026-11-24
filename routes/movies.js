const express = require('express');
const Movie = require('../models/Movie');
const { parseId } = require('../utils/validators');

const router = express.Router();

// GET /api/movies
router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Movie id must be a positive whole number' });
    }
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
});

module.exports = router;