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

module.exports = authentificateToken;