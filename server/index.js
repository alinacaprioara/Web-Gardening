const http = require('http');
const url = require('url');
const handleRoute = require('./routes');
const db = require('./db');


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
  server.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}...`);
    try {
      const client = await db.connect();
      client.release(); 
      console.log('Connected to the database');
    } catch (err) {
      console.error('Failed to connect to the database:', err);
    }
  });
} catch (err) {
  console.error(err);
}
