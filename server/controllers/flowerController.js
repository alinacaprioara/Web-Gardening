const Flower = require('../models/flowers');

async function getFlowers(req, res) {
  try {
    const flowers = await Flower.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(flowers));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

module.exports = {
  getFlowers,
};