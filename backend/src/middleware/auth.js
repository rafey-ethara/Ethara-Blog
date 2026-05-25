const jwt = require('jsonwebtoken');
const Author = require('../models/Author');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const author = await Author.findById(decoded.id).select('-passwordHash');

    if (!author) {
      return res.status(401).json({
        success: false,
        error: 'Token is no longer valid.',
      });
    }

    req.user = author;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: 'Access denied. Admin role required.',
  });
};

module.exports = { protect, adminOnly };
