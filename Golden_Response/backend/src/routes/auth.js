const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Author = require('../models/Author');
const { protect } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        error: 'Validation failed.',
        details: {
          ...(!email && { email: 'Email is required.' }),
          ...(!password && { password: 'Password is required.' }),
        },
      });
    }

    const author = await Author.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!author || !(await author.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = signToken(author._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: author._id,
          name: author.name,
          email: author.email,
          avatar: author.avatar,
          role: author.role,
        },
      },
      message: 'Login successful.',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout — client-side only (JWT is stateless)
router.post('/logout', (req, res) => {
  res.json({ success: true, data: {}, message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, data: req.user, message: 'User retrieved successfully.' });
});

module.exports = router;
