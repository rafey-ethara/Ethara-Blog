const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /api/search?q=keyword&page=1&limit=10
router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(422).json({
        success: false,
        error: 'Search query must be at least 2 characters.',
      });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const searchQuery = {
      status: 'published',
      $text: { $search: q.trim() },
    };

    const [posts, total] = await Promise.all([
      Post.find(searchQuery, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar')
        .populate('category', 'name slug color')
        .populate('tags', 'name slug')
        .select('-content'),
      Post.countDocuments(searchQuery),
    ]);

    res.json({
      success: true,
      data: {
        posts,
        query: q,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
        },
      },
      message: total > 0 ? `Found ${total} results for "${q}"` : `No results found for "${q}"`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
