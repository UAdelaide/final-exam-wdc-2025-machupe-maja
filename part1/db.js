const mysql = require("mysql2/promise");
const SQL_INSERT_USERS = `
INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('anakin', 'skywalker@example.com', 'password123', 'owner'),
('johnny', 'johnny@example.com', 'keepwalking111', 'walker');`;

const SQL_INSERT_DOGS = `
INSERT INTO Dogs (name, size, owner_id) VALUES
('Max', 'medium', (SELECT user_id FROM Users WHERE username = 'alice123' AND role = 'owner')),
('Bella', 'small', (SELECT user_id FROM Users WHERE username = 'carol123' AND role = 'owner')),
('Gidget', 'small', (SELECT user_id FROM Users WHERE username = 'anakin' AND role = 'owner')),
('Duke', 'large', (SELECT user_id FROM Users WHERE username = 'alice123' AND role = 'owner')),
('Buddy', 'medium', (SELECT user_id FROM Users WHERE username = 'anakin' AND role = 'owner'));`;

const SQL_INSERT_WALK_REQUESTS = `
INSERT INTO WalkRequests (requested_time, duration_minutes, location, status, dog_id) VALUES
('2025-06-10 08:00:00', 30, 'Parklands', 'open', (SELECT dog_id FROM Dogs WHERE name = 'Max')),
('2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted', (SELECT dog_id FROM Dogs WHERE name = 'Bella')),
('2025-06-21 11:15:00', 30, 'Rymill Park', 'open', (SELECT dog_id FROM Dogs WHERE name = 'Buddy')),
('2025-07-08 16:30:00', 60, 'Elder Park', 'open', (SELECT dog_id FROM Dogs WHERE name = 'Gidget')),
('2025-07-10 13:30:00', 20, 'Rundle Mall', 'open', (SELECT dog_id FROM Dogs WHERE name = 'Duke'));`;

const SQL_INSERT_WALK_RATINGS = `
INSERT INTO WalkRatings (request_id, owner_id, rating, comments, walker_id) VALUES
((SELECT request_id FROM WalkRequests WHERE requested_time = '2025-06-10 08:00:00'),
 (SELECT user_id FROM Users WHERE username = 'alice123' AND role = 'owner'),
 4,
 'Max was happy to get away from Duke for a while.',
 (SELECT user_id FROM Users WHERE username = 'johnny' AND role = 'walker'));`;

async function setup() {
  try {
    // Connect to the dogwalk db
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "DogWalkService"
    });

    // Add users if needed
    let [users] = await db.query("SELECT count(*) AS count FROM Users;");
    if (users[0].count === 0) {
      await db.query(SQL_INSERT_USERS);
    }

    // Add dogs if needed
    const [dogs] = await db.query("SELECT count(*) AS count FROM Dogs;");
    if (dogs[0].count === 0) {
      await db.query(SQL_INSERT_DOGS);
    }

    // Add walk requests if needed
    const [walks] = await db.query(
      "SELECT count(*) AS count FROM WalkRequests;"
    );
    if (walks[0].count === 0) {
      await db.query(SQL_INSERT_WALK_REQUESTS);
    }

    // Add walk ratings if needed
    const [ratings] = await db.query(
      "SELECT count(*) AS count FROM WalkRatings;"
    );
    if (ratings[0].count === 0) {
      await db.query(SQL_INSERT_WALK_RATINGS);
    }
    return db;
  } catch (err) {
    console.error(
      "Error setting up database. Ensure Mysql is running: service mysql start",
      err
    );
    return null;
  }
}

module.exports = { setup };
