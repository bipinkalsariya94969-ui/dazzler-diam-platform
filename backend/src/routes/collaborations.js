const express = require('express')
const mongoose = require('mongoose')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

const collaborationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['influencer', 'business_partner'], required: true },
  email: String,
  phone: String,
  instagram: String,
  youtube: String,
  tiktok: String,
  website: String,
  country: String,
  followersCount: Number,
  niche: String, // e.g. 'Fashion & Jewellery', 'Luxury Lifestyle'
  partnerCategory: String, // e.g. 'Bridal Boutique', 'Luxury Hotel'

  status: { type: String, enum: ['prospect', 'contacted', 'active', 'paused', 'closed'], default: 'prospect' },
  dealTerms: String,
  commissionRate: Number, // percentage
  notes: String,

  // Campaigns/collaborations done
  campaigns: [{
    title: String,
    date: Date,
    reach: Number,
    outcome: String,
  }],
}, { timestamps: true })

const Collaboration = mongoose.model('Collaboration', collaborationSchema)

// GET /api/collaborations
router.get('/', protect, async (req, res) => {
  try {
    const { type, status, country } = req.query
    const filter = {}
    if (type) filter.type = type
    if (status) filter.status = status
    if (country) filter.country = country

    const collabs = await Collaboration.find(filter).sort('-createdAt')
    res.json(collabs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collaborations.' })
  }
})

// POST /api/collaborations
router.post('/', protect, async (req, res) => {
  try {
    const collab = await Collaboration.create(req.body)
    res.status(201).json(collab)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create collaboration.' })
  }
})

// PUT /api/collaborations/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const collab = await Collaboration.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!collab) return res.status(404).json({ error: 'Collaboration not found.' })
    res.json(collab)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update collaboration.' })
  }
})

// DELETE /api/collaborations/:id
router.delete('/:id', protect, authorize('founder', 'ceo'), async (req, res) => {
  try {
    await Collaboration.findByIdAndDelete(req.params.id)
    res.json({ message: 'Collaboration removed.' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete collaboration.' })
  }
})

module.exports = router
