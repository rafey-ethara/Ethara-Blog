const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/ContactSubmission');
const { sendContactNotificationToOwner } = require('../services/emailService');
const { sanitizeText } = require('../middleware/sanitize');
const { strictRateLimiter } = require('../middleware/rateLimiter');
const validator = require('validator');

// POST /api/contact
router.post('/', strictRateLimiter, async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    const errors = {};
    if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!email || !validator.isEmail(email)) errors.email = 'Invalid email address.';
    if (!phone || !/^[\+\d\s\-\(\)]{7,20}$/.test(phone)) errors.phone = 'Invalid phone number.';
    if (!subject || subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters.';

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, error: 'Validation failed.', details: errors });
    }

    const submission = await ContactSubmission.create({
      name: sanitizeText(name),
      email: sanitizeText(email).toLowerCase(),
      phone: sanitizeText(phone),
      subject: sanitizeText(subject),
      message: message ? sanitizeText(message) : '',
    });

    // Send email notification to owner (non-blocking)
    sendContactNotificationToOwner({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      subject: submission.subject,
      message: submission.message,
      timestamp: submission.createdAt,
    });

    res.status(201).json({
      success: true,
      data: { id: submission._id },
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
