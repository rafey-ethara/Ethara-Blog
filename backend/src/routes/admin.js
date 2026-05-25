const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/ContactSubmission');
const Subscriber = require('../models/Subscriber');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth
router.use(protect, adminOnly);

// GET /api/admin/contacts — all contact submissions
router.get('/contacts', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      ContactSubmission.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactSubmission.countDocuments(),
    ]);

    res.json({
      success: true,
      data: { submissions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      message: 'Contact submissions retrieved successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/contacts/:id
router.delete('/contacts/:id', async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ success: false, error: 'Submission not found.' });
    res.json({ success: true, data: {}, message: 'Submission deleted.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/subscribers
router.get('/subscribers', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      Subscriber.find().sort({ subscribedAt: -1 }).skip(skip).limit(limit),
      Subscriber.countDocuments(),
    ]);

    res.json({
      success: true,
      data: { subscribers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      message: 'Subscribers retrieved successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/subscribers/:id
router.delete('/subscribers/:id', async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ success: false, error: 'Subscriber not found.' });
    res.json({ success: true, data: {}, message: 'Subscriber removed.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const [postCount, subscriberCount, contactCount, commentCount, views] = await Promise.all([
      Post.countDocuments({ status: 'published' }),
      Subscriber.countDocuments(),
      ContactSubmission.countDocuments(),
      Comment.countDocuments({ approved: true }),
      Post.aggregate([{ $group: { _id: null, total: { $sum: '$viewCount' } } }]),
    ]);

    res.json({
      success: true,
      data: {
        posts: postCount,
        subscribers: subscriberCount,
        contacts: contactCount,
        comments: commentCount,
        totalViews: views[0]?.total || 0,
      },
      message: 'Stats retrieved successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/comments — all comments
router.get('/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .populate('post', 'title slug')
      .limit(50);

    res.json({ success: true, data: comments, message: 'Comments retrieved successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
