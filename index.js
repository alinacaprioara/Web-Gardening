
const http = require('http');
const { Pool } = require('pg');


const authRoute = require('./server/routes/auth');
const userRoute = require('./server/routes/user');



const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'myPlant', 
    password: 'admin', 
    port: 5432, 
  });

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Request-Headers', '*');


  if (req.url === '/auth' && req.method === 'GET') {
    // 
  } else if (req.url === '/user' && req.method === 'GET') {
    // 
  } 
  else if (parsedUrl.pathname === '/flowers' && req.method === 'GET') {
    flowerController.getFlowers(req, res);
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
