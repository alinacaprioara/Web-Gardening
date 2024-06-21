const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'myPlant',
    password: 'admin',
    port: 5432,
})

const secretKey = "tigrut";

async function authentificate(req, res) {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE name = $1', [username]);
    const user = result.rows[0];
  
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, "tigrut");
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token, role: user.role}));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid username or password' }));
    }
  }
  
  async function register(req, res) {

    try
    {
      const { username, email, password, role } = req.body;

      const emailCheckResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (emailCheckResult.rows.length > 0) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Email is already registered' }));
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [username, email, hashedPassword, role]);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User registered successfully' }));
    }
    catch(error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'An error occurred during registration' }));
    }

  }
  
  module.exports = { authentificate, register };
