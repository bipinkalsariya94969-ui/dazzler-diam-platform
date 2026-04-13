const express = require('express')
const Blog = require('../models/Blog')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// GET /api/blog — Public: list published posts
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, category } = req.query
    const filter = { published: true }
    if (category) filter.category = category

    const skip = (Number(page) - 1) * Number(limit)
    const [posts, total] = await Promise.all([
      Blog.find(filter)
        .select('title slug excerpt coverImage category publishedAt readTime')
        .sort('-publishedAt')
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(filter),
    ])

    res.json({ posts, total, pages: Math.ceil(total / Number(limit)) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts.' })
  }
})

// GET /api/blog/:slug — Public: single post
router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true })
    if (!post) return res.status(404).json({ error: 'Post not found.' })
    post.views += 1
    await post.save({ validateBeforeSave: false })
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post.' })
  }
})

// POST /api/blog — Admin: create post
router.post('/', protect, async (req, res) => {
  try {
    const post = await Blog.create({ ...req.body, author: req.user._id })
    res.status(201).json(post)
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'A post with this slug already exists.' })
    res.status(500).json({ error: 'Failed to create post.' })
  }
})

// PUT /api/blog/:id — Admin: update post
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!post) return res.status(404).json({ error: 'Post not found.' })
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post.' })
  }
})

// DELETE /api/blog/:id — Admin: delete post
router.delete('/:id', protect, authorize('founder', 'ceo', 'marketing'), async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.json({ message: 'Post deleted.' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post.' })
  }
})

// GET /api/blog/admin/all — Admin: list all posts including drafts
router.get('/admin/all', protect, async (req, res) => {
  try {
    const posts = await Blog.find().sort('-createdAt').populate('author', 'name')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts.' })
  }
})

module.exports = router
