
const http = require('http');
const url = require('url');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const handleRoute = require('./server/routes');



const { register } = require('./server/controllers/authController');
const { authentificate } = require('./server/controllers/authController');



const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'myPlant', 
    password: 'admin', 
    port: 5432, 
  });


const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Request-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
}

handleRoute(req, res);

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
