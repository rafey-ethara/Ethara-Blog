const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { sendSubscriberConfirmation, sendNewSubscriberNotificationToOwner } = require('../services/emailService');
const { sanitizeText } = require('../middleware/sanitize');
const { strictRateLimiter } = require('../middleware/rateLimiter');
const validator = require('validator');

// POST /api/newsletter
router.post('/', strictRateLimiter, async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Validation
    const errors = {};
    if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!email || !validator.isEmail(email)) errors.email = 'Invalid email address.';

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, error: 'Validation failed.', details: errors });
    }

    const cleanEmail = sanitizeText(email).toLowerCase();
    const cleanName = sanitizeText(name);

    // Check for existing subscriber
    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Already subscribed.',
        details: { email: 'This email is already subscribed.' },
      });
    }

    const subscriber = await Subscriber.create({ name: cleanName, email: cleanEmail });

    // Send emails (non-blocking)
    sendSubscriberConfirmation({ name: cleanName, email: cleanEmail });
    sendNewSubscriberNotificationToOwner({ name: cleanName, email: cleanEmail });

    res.status(201).json({
      success: true,
      data: { id: subscriber._id },
      message: 'Successfully subscribed to Ethara Blog!',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
