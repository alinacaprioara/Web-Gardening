const http = require('http');
const url = require('url');
const querystring = require('querystring');

const port = 8086;


const recommendationsData = {
  temperature: {
    roses: 'Maintain temperature between 20-25°C for roses.',
    lilies: 'Temperature should be kept between 22-28°C for lilies.'
  },
  humidity: {
    roses: 'Ensure humidity is between 60-70% for roses.',
    lilies: 'Maintain humidity around 50-60% for lilies.'
  },
  photo: {
    roses: 'Analyze photo data for growth patterns in roses.',
    lilies: 'Use photo analysis to monitor growth in lilies.'
  }
};


const server = http.createServer((req, res) => {

  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  
  if (req.method === 'POST' && pathname === '/recommendations') {
    let body = '';


    req.on('data', chunk => {
      body += chunk.toString();
    });

  
    req.on('end', () => {
      const parsedBody = querystring.parse(body);
      const { sensorType, flowerName, inputData } = parsedBody;


      if (!sensorType || !flowerName) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Sensor type and flower name are required.' }));
        return;
      }


      setTimeout(() => {

        const recommendations = recommendationsData[sensorType]?.[flowerName] || 'No recommendations found.';


        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ recommendations }));
      }, 2000); 
    });

  } else {

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
