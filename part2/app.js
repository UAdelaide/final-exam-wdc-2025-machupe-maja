const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('./models/db');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

app.use(session({
    secret: 'ilovedogs',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// GET all dogs


app.get('/api/dogs', async (req, res) => {
  const dogs_sql = `
    SELECT
      dog_id,
      name AS dog_name,
      size,
      owner_id
    FROM
      Dogs d
    INNER JOIN
      Users u
      ON u.user_id = d.owner_id`;
  try {
    const [rows] = await db.query(dogs_sql);
    // Returning as pure JSON instead of stringified
    res.json(rows);
  } catch (err) {
    // Noone let the dogs out :(
    res.status(500).json({ error: 'Error trying to let the dogs out!' });
    console.error('Error trying to let the dogs out! \n', err);
  }
});

// Export the app instead of listening here
module.exports = app;
