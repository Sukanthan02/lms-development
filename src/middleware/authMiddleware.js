const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lms_secret_key';

/**
 * Middleware to protect routes.
 * Expects: Authorization: Bearer <token>
 */
const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, usertoken, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token.'
    });
  }
};

module.exports = { protect };
