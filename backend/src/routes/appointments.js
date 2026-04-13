const express = require('express')
const mongoose = require('mongoose')
const { protect } = require('../middleware/auth')

const router = express.Router()

const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  country: String,
  type: { type: String, enum: ['zoom', 'whatsapp', 'in-person'], default: 'zoom' },
  date: { type: Date, required: true },
  duration: { type: Number, default: 30 }, // minutes
  topic: String,
  notes: String,
  status: { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
  zoomLink: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedInquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },
}, { timestamps: true })

const Appointment = mongoose.model('Appointment', appointmentSchema)

// POST /api/appointments — Public: book appointment
router.post('/', async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body)
    res.status(201).json({ success: true, appointment })
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment.' })
  }
})

// GET /api/appointments — Admin: list
router.get('/', protect, async (req, res) => {
  try {
    const { status, from, to } = req.query
    const filter = {}
    if (status) filter.status = status
    if (from || to) {
      filter.date = {}
      if (from) filter.date.$gte = new Date(from)
      if (to) filter.date.$lte = new Date(to)
    }
    const appointments = await Appointment.find(filter).sort('date').populate('assignedTo', 'name').populate('relatedInquiry', 'name email')
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments.' })
  }
})

// PATCH /api/appointments/:id — Admin: update
router.patch('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' })
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment.' })
  }
})

module.exports = router
