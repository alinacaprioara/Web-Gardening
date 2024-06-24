const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = "tigrut"

function authentificateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.writeHead(401).end();

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
        console.log(err);
        return res.writeHead(403).end();}
    req.user = user;
    next();
  });
}

function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) {
      return null;
  }

  const payload = token.split('.')[1];
  const decodedPayload = atob(payload);
  const payloadObj = JSON.parse(decodedPayload);

  return payloadObj.userId;
}

module.exports = authentificateToken;