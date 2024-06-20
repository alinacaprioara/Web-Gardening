const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'myPlant',
    password: 'cafeluta',
    port: 5432,
})

const secretKey = "tigrut";

async function authentificate(req, res) {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE name = $1', [username]);
    const user = result.rows[0];
  
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, secretKey);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid username or password' }));
    }
  }
  
  async function register(req, res) {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [username, email, hashedPassword, role]);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User registered successfully' }));
  }
  
  module.exports = { authentificate, register };
