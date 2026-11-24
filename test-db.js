require('dotenv').config();
const pool = require('./db');

async function check() {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to MySQL');

    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tables:', tables.map((t) => Object.values(t)[0]).join(', '));

    const [movies] = await pool.query('SELECT COUNT(*) AS count FROM movies');
    console.log('Movies in database:', movies[0].count);
  } catch (err) {
    console.error('Connection failed:', err.code, '-', err.message);
  } finally {
    await pool.end();
  }
}

check();