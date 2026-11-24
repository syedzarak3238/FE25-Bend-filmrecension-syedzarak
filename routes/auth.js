const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { isValidEmail } = require('../utils/validators');
const jwt = require('jsonwebtoken');
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



// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );
    const user = rows[0];

    // Same message for "no such user" and "wrong password" so attackers
    // can't find out which emails are registered.
    const passwordOk = user && (await bcrypt.compare(password, user.password_hash));
    if (!passwordOk) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});


//const jwt = require('jsonwebtoken');
module.exports = router;