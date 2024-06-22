const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = "tigrut"

function authentificateToken(req, res, next) {
  
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log('Authorization Header:', authHeader);
  
    //const token = authHeader && authHeader.split(' ')[1];

    if (!authHeader) {
      return res.writeHead(401, { 'Content-Type': 'text/plain' }).end('Authorization header missing');
  }

    const [bearer, token] = authHeader.split(' ');
  
    if (token == null) return res.writeHead(401).end();
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
          console.log(err);
          return res.writeHead(403).end();
      }
      req.user = user;
      next();
    });
  }

module.exports = authentificateToken;