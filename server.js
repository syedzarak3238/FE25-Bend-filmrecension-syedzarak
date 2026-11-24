require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Step 2: temporary hardcoded route. Replace with MySQL in Step 5.
app.use('/api/movies', require('./routes/movies'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/reviews'));
app.use('/api/watchlist', require('./routes/watchlist'));
// TODO (later): mount routers, e.g.
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/movies', require('./routes/movies'));
// app.use('/api', require('./routes/reviews'));
// app.use('/api/watchlist', require('./routes/watchlist'));

// TODO (Step 11): global error handler (generic 500, never expose SQL errors)

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler: never leak SQL errors or stack traces to the client.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  console.error(err); // details stay in the server console only
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
