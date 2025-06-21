const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');

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


router.get('/api/dogs', async (req, res, next) => {
  const dogs_sql = `
    SELECT
      name AS dog_name,
      size,
      username AS owner_username
    FROM
      Dogs d
    INNER JOIN
      Users u
      ON u.user_id = d.owner_id`;
  try {
    const [rows] = await req.db.query(dogs_sql);
    // Returning as pure JSON instead of stringified
    res.json(rows);
  } catch (err) {
    // 500 Since it's likely a server related problem
    res.status(500);
    // Noone let the dogs out :(
    res.status(500).json({ error: 'Error trying to let the dogs out!' });
    console.error('Error trying to let the dogs out! \n', err);
  }
});

// Export the app instead of listening here
module.exports = app;
