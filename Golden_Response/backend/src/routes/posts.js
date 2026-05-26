const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect, adminOnly } = require('../middleware/auth');
const { sanitizeBody } = require('../middleware/sanitize');
const slugify = require('slugify');

// GET /api/posts — paginated, filtered, sorted
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.author) filter.author = req.query.author;

    let sort = { publishedAt: -1 }; // default: latest
    if (req.query.sort === 'popular') sort = { viewCount: -1 };
    if (req.query.sort === 'trending') sort = { likeCount: -1 };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar')
        .populate('category', 'name slug color')
        .populate('tags', 'name slug')
        .select('-content'),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      message: 'Posts retrieved successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:slug — single post by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar bio socialLinks')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug');

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    res.json({ success: true, data: post, message: 'Post retrieved successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/posts — create (admin)
router.post('/', protect, adminOnly, sanitizeBody, async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, coverImageAlt, category, tags, status } = req.body;

    const slug = slugify(title, { lower: true, strict: true });
    const existingPost = await Post.findOne({ slug });
    const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug;

    const post = await Post.create({
      title,
      slug: finalSlug,
      content,
      excerpt,
      coverImage,
      coverImageAlt,
      author: req.user._id,
      category,
      tags: tags || [],
      status: status || 'draft',
    });

    await post.populate(['author', 'category', 'tags']);

    res.status(201).json({ success: true, data: post, message: 'Post created successfully.' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/posts/:id — update (admin)
router.put('/:id', protect, adminOnly, sanitizeBody, async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, coverImageAlt, category, tags, status } = req.body;
    const update = { title, content, excerpt, coverImage, coverImageAlt, category, tags, status };

    if (title) {
      const slug = slugify(title, { lower: true, strict: true });
      const existingPost = await Post.findOne({ slug, _id: { $ne: req.params.id } });
      update.slug = existingPost ? `${slug}-${Date.now()}` : slug;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate('author category tags');

    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });

    res.json({ success: true, data: post, message: 'Post updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/posts/:id — delete (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });
    res.json({ success: true, data: {}, message: 'Post deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/posts/:id/like — increment like count
router.post('/:id/like', async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likeCount: 1 } },
      { new: true }
    ).select('likeCount');

    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });

    res.json({ success: true, data: { likeCount: post.likeCount }, message: 'Post liked.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
