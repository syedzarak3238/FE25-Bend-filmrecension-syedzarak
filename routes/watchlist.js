// All routes require auth. ALWAYS use req.user.id, never an id from the body/params.
// GET    /api/watchlist           -> my saved movies (JOIN movies)
// POST   /api/watchlist/:movieId  -> 404 if movie missing, 409 if already saved
// DELETE /api/watchlist/:movieId  -> delete WHERE user_id = ? AND movie_id = ?
const express = require('express');
const router = express.Router();

module.exports = router;
