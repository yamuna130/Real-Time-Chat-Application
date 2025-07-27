const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Token expired or invalid
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    req.user = decoded; // Store user info from token
    next();
  });
};

module.exports = verifyToken;
