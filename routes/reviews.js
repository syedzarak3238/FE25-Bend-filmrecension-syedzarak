// GET  /api/movies/:movieId/reviews  (public)
// POST /api/movies/:movieId/reviews  (auth; rating integer 1-10; 404 if movie missing; handle duplicate)
// PUT  /api/reviews/:id              (auth; 404 if missing; 403 if review.user_id !== req.user.id)
const express = require('express');
const router = express.Router();

module.exports = router;
