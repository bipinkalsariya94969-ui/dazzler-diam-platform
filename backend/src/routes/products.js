const express = require('express')
const Product = require('../models/Product')
const { protect } = require('../middleware/auth')

const router = express.Router()

// GET /api/products — Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 12, page = 1, spotlight } = req.query
    const filter = { isPublished: true }
    if (category) filter.category = category
    if (featured === 'true') filter.isFeatured = true
    if (spotlight === 'true') filter.isSpotlight = true

    const skip = (Number(page) - 1) * Number(limit)
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ])
    res.json({ products, total, pages: Math.ceil(total / Number(limit)) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products.' })
  }
})

// GET /api/products/:slug — Public
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true })
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product.' })
  }
})

// POST /api/products — Admin: create
router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product.' })
  }
})

// PUT /api/products/:id — Admin: update
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product.' })
  }
})

// DELETE /api/products/:id — Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted.' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product.' })
  }
})

// GET /api/products/admin/all — Admin: all products including unpublished
router.get('/admin/all', protect, async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt')
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products.' })
  }
})

module.exports = router
