// delivery-service/middleware/verifyJWT.js
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    // if (decoded.role !== 'delivery') return res.sendStatus(403);
    req.user = decoded;
    req.token = token;
    next();
  });
};

module.exports = verifyJWT;