const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.send('Hello moto');
});


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


router.get('/api/walkrequests/open', async (req, res, next) => {
  const requests_sql = `
    SELECT
      request_id,
      name AS dog_name,
      requested_time,
      duration_minutes,
      location,
      username AS owner_username
    FROM
      WalkRequests r
    INNER JOIN
      Dogs d
      ON d.dog_id = r.dog_id
    INNER JOIN
      Users u
      ON u.user_id = d.owner_id
    WHERE
      r.status = 'open'`;
  try {
    const [rows] = await req.db.query(requests_sql);
    // Returning as pure JSON instead of stringified
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching WalkRequests' });
    console.error('Error fetching WalkRequests. \n', err);
  }
});


router.get('/api/walkers/summary', async (req, res, next) => {
  const walkers_sql = `
    SELECT
      username AS walker_username,
      IFNULL(SUM(rating), 0) AS total_ratings,
      AVG(rating) AS average_rating,
      COUNT(walker_id) AS completed_walks
    FROM
      WalkRatings r
    RIGHT JOIN
      Users u
      ON u.user_id = r.walker_id
    WHERE
      u.role = 'walker'
    GROUP BY
      walker_username`;
  try {
    const [rows] = await req.db.query(walkers_sql);
    // Returning as pure JSON instead of stringified
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching Walkers' });
    console.error('Error fetching Walkers. \n', err);
  }
});

module.exports = router;

