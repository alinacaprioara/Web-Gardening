const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const Jimp = require('jimp');

const port = 8086;

const recommendationsData = {
  temperature: {
    random: [
      'Maintain consistent temperature to avoid stress on plants.',
      'Check for optimal temperature requirements for your specific plant type.',
      'Consider using shade or insulation to control temperature fluctuations.'
    ]
  },
  humidity: {
    random: [
      'Monitor humidity levels closely to prevent mold and mildew.',
      'Increase humidity during dry seasons to promote healthy growth.',
      'Avoid overwatering to maintain ideal humidity levels.'
    ]
  },
  photo: {
    roses: 'Analyze photo data for growth patterns in roses.',
    lilies: 'Use photo analysis to monitor growth in lilies.'
  }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && pathname === '/recommendations') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
  
    req.on('end', async () => {
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
        const { sensorType, flowerName, inputData } = parsedBody;
  
        if (sensorType === 'photo') {
          console.log(`Received sensor type: ${sensorType}, flower name: ${flowerName}, image length: ${inputData.length}`);
          const imageBuffer = Buffer.from(inputData, 'base64');
  
          Jimp.read(imageBuffer)
            .then(image => {
              const width = image.bitmap.width;
              const resizeWidth = Math.ceil(width / 10);
              return image
                .resize(resizeWidth, Jimp.AUTO)
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .getBufferAsync(Jimp.MIME_JPEG);
            })
            .then(processedImageBuffer => {
              let greenPixelCount = 0;
              for (let i = 0; i < processedImageBuffer.length; i += 4) {
  
                if (processedImageBuffer[i] < 250) greenPixelCount++;
              }
  
              const recommendations = greenPixelCount > 1000 ? "The flower culture is ready for harvest" : "The flowers are still growing, looking great!";
              const responseJSON = JSON.stringify({ recommendations });
  
              res.setHeader('Content-Disposition', 'attachment; filename="recommendations.json"');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(responseJSON);
            })
            .catch(err => {
              console.error('Error processing image:', err.message);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Error processing image' }));
            });
        } else {
          console.log(`Received sensor type: ${sensorType}, level: ${inputData}`);
          const level = inputData;
  
          setTimeout(() => {
            const recommendations = getRandomRecommendation(sensorType);
            res.setHeader('Content-Disposition', 'attachment; filename="recommendations.json"');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ recommendations, level }));
          }, 2000);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
  
  function getRandomRecommendation(sensorType) {
    const randomIndex = Math.floor(Math.random() * recommendationsData[sensorType].random.length);
    return recommendationsData[sensorType].random[randomIndex];
  }


});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});