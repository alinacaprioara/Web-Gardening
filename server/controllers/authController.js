const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

const secretKey = "tigrut";

async function authentificate(req, res) {
    try {
        const { username, password } = req.body;
        const result = await db.query('SELECT * FROM users WHERE name = $1', [username]);
        const user = result.rows[0];
    
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, secretKey);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token, role: user.role }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid username or password' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'An error occurred during authentification' }));
    }
}

async function register(req, res) {
    try {
        const { username, email, password, role } = req.body;

        const usernameCheckResult = await db.query('SELECT * FROM users WHERE name = $1', [username]);
        if (usernameCheckResult.rows.length > 0) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Username is already taken' }));
            return;
        }

        const emailCheckResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheckResult.rows.length > 0) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Email is already registered' }));
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id', 
            [username, email, hashedPassword, role]
        );
        const userId = result.rows[0].id;
        const token = jwt.sign({ id: userId }, secretKey);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User registered successfully', token, role }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'An error occurred during registration' }));
    }

  }

  async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await db.query('SELECT * FROM users WHERE id = $1', [req.userId]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.userId]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Password changed successfully' }));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid old password' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'An error occurred during password change' }));
    }
}


  
  module.exports = { authentificate, register , changePassword };
