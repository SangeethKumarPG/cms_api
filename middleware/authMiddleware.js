const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.cookies[process.env.COOKIE_NAME || 'token'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;