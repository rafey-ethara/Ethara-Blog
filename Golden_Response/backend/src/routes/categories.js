const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');
const slugify = require('slugify');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories, message: 'Categories retrieved successfully.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });
    res.json({ success: true, data: category, message: 'Category retrieved successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/categories (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const category = await Category.create({ name, slug, description, color });
    res.status(201).json({ success: true, data: category, message: 'Category created successfully.' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/categories/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    const update = { description, color };
    if (name) {
      update.name = name;
      update.slug = slugify(name, { lower: true, strict: true });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });
    res.json({ success: true, data: category, message: 'Category updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });
    res.json({ success: true, data: {}, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
