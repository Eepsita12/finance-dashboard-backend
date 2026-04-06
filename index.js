require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/records', require('./routes/records'));
app.use('/summary', require('./routes/summary'));

app.get('/', (req, res) => {
  res.json({
    message: 'Finance Dashboard API is running.',
    version: '1.0.0',
    endpoints: {
      users: 'POST /users | GET /users',
      records: 'POST /records | GET /records | DELETE /records/:id',
      summary: 'GET /summary',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route "${req.method} ${req.originalUrl}" not found.` });
});

app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.message);
  res.status(500).json({ error: 'Internal server error.', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`  Server running at http://localhost:${PORT}`);
});
