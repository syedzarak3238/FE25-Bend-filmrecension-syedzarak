const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { isValidEmail } = require('../utils/validators');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Email is not valid' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [cleanEmail, passwordHash]
    );

    // Never return the hash.
    res.status(201).json({ id: result.insertId, email: cleanEmail });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email is already registered' });
    }
    next(err);
  }
});

module.exports = router;