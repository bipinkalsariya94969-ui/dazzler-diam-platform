const express = require('express')
const { body, validationResult } = require('express-validator')
const Inquiry = require('../models/Inquiry')
const { protect, authorize } = require('../middleware/auth')
const { sendInquiryConfirmation, sendAdminNotification } = require('../utils/email')
const { appendToSheet } = require('../utils/googleSheets')

const router = express.Router()

// POST /api/inquiries - Public: submit inquiry
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const inquiry = await Inquiry.create(req.body)

    // Send confirmation email to customer (non-blocking)
    sendInquiryConfirmation(inquiry).catch(err => console.error('Email error:', err))

    // Notify admin (non-blocking)
    sendAdminNotification(inquiry).catch(err => console.error('Admin email error:', err))

    // Sync to Google Sheets (non-blocking)
    appendToSheet(inquiry).catch(err => console.error('Sheets error:', err))

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will contact you within 24 hours.',
      id: inquiry._id,
    })
  } catch (error) {
    console.error('Inquiry creation error:', error)
    res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' })
  }
})

// GET /api/inquiries - Admin: list inquiries
router.get('/', protect, async (req, res) => {
  try {
    const { status, country, search, page = 1, limit = 20, sort = '-createdAt' } = req.query
    const filter = {}
    if (status && status !== 'all') filter.status = status
    if (country && country !== 'All') filter.country = country
    if (search) filter.$text = { $search: search }

    const skip = (page - 1) * limit
    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).sort(sort).skip(skip).limit(Number(limit)).populate('assignedTo', 'name'),
      Inquiry.countDocuments(filter),
    ])

    res.json({ inquiries, total, pages: Math.ceil(total / limit), page: Number(page) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries.' })
  }
})

// GET /api/inquiries/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('assignedTo', 'name email')
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found.' })
    res.json(inquiry)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiry.' })
  }
})

// PATCH /api/inquiries/:id - Update status/notes
router.patch('/:id', protect, async (req, res) => {
  try {
    const allowed = ['status', 'assignedTo', 'assignedSupplier', 'followUpDate', 'lastContactedAt']
    const updates = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k] })

    // Add internal note if provided
    if (req.body.internalNote) {
      updates.$push = { internalNotes: { text: req.body.internalNote, addedBy: req.user.name } }
    }

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found.' })
    res.json(inquiry)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inquiry.' })
  }
})

// GET /api/inquiries/stats/summary
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const [byStatus, byCountry, byMonth] = await Promise.all([
      Inquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Inquiry.aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Inquiry.aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
    ])
    res.json({ byStatus, byCountry, byMonth })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' })
  }
})

module.exports = router
