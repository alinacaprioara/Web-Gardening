
const http = require('http');
const url = require('url');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');


const authRoute = require('./server/routes/auth');
const userRoute = require('./server/routes/user');

const { register } = require('./server/controllers/authController');
const { authentificate } = require('./server/controllers/authController');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'myPlant', 
    password: 'cafeluta', 
    port: 5432, 
  });


const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Request-Headers', '*');


  if (req.url === '/auth' && req.method === 'POST') {
    let body='';
    req.on('data', chunk => {
      body+=chunk.toString();
  });
  req.on('end', () => {
      req.body = JSON.parse(body);
      authentificate(req, res);
  });
  } else if (req.url === '/user' && req.method === 'GET') {
    user.Controller.getUser(req,res);
  } 
  else if (parsedUrl.pathname === '/flowers' && req.method === 'GET') {
    flowerController.getFlowers(req, res);
  }
  else if (parsedUrl.pathname === '/register' && req.method === 'POST') {
    let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    req.body = JSON.parse(body);
    register(req, res);
  });
  }

  else {
    res.writeHead(404);
    res.end('Not Found');
  }
 
});

const PORT = process.env.PORT || 8085;


try {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    pool.connect((err) => {
      if (err) {
        console.error('Failed to connect to the database:', err);
      } else {
        console.log('Connected to the database');
      }
    });
  });
} catch (err) {
  console.error(err);
}
