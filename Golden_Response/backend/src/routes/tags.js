const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const { protect, adminOnly } = require('../middleware/auth');
const slugify = require('slugify');

// GET /api/tags
router.get('/', async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ success: true, data: tags, message: 'Tags retrieved successfully.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/tags/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) return res.status(404).json({ success: false, error: 'Tag not found.' });
    res.json({ success: true, data: tag, message: 'Tag retrieved successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/tags (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const tag = await Tag.create({ name, slug });
    res.status(201).json({ success: true, data: tag, message: 'Tag created successfully.' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tags/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ success: false, error: 'Tag not found.' });
    res.json({ success: true, data: {}, message: 'Tag deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
