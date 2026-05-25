const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect, adminOnly } = require('../middleware/auth');
const { sanitizeText } = require('../middleware/sanitize');

// GET /api/comments/:postId
router.get('/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, approved: true })
      .sort({ createdAt: -1 })
      .select('-email');
    res.json({ success: true, data: comments, message: 'Comments retrieved successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/comments/:postId
router.post('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });

    const { name, email, content } = req.body;

    if (!name || !email || !content) {
      return res.status(422).json({
        success: false,
        error: 'Validation failed.',
        details: {
          ...(!name && { name: 'Name is required.' }),
          ...(!email && { email: 'Email is required.' }),
          ...(!content && { content: 'Comment content is required.' }),
        },
      });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      name: sanitizeText(name),
      email: sanitizeText(email),
      content: sanitizeText(content),
      approved: true,
    });

    res.status(201).json({ success: true, data: comment, message: 'Comment posted successfully.' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/comments/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ success: false, error: 'Comment not found.' });
    res.json({ success: true, data: {}, message: 'Comment deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
