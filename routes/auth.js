// POST /api/auth/register  -> validate, bcrypt.hash, INSERT, 201 (409 on duplicate email)
// POST /api/auth/login     -> find user, bcrypt.compare, jwt.sign({ id }), same 401 message for both failures
const express = require('express');
const router = express.Router();

module.exports = router;
