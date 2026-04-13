const express = require('express')
const User = require('../models/User')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// GET /api/team — Admin
router.get('/', protect, authorize('founder', 'ceo', 'hr_manager'), async (req, res) => {
  try {
    const team = await User.find().select('-password').sort('role name')
    res.json(team)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team.' })
  }
})

// POST /api/team — Create team member
router.post('/', protect, authorize('founder', 'ceo', 'hr_manager'), async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(400).json({ error: 'Email already exists.' })

    const user = await User.create({ name, email, password, role, phone })
    const { password: _, ...userObj } = user.toObject()
    res.status(201).json(userObj)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team member.' })
  }
})

// PATCH /api/team/:id — Update role or status
router.patch('/:id', protect, authorize('founder', 'ceo', 'hr_manager'), async (req, res) => {
  try {
    const { role, isActive, phone } = req.body
    const updates = {}
    if (role !== undefined) updates.role = role
    if (isActive !== undefined) updates.isActive = isActive
    if (phone !== undefined) updates.phone = phone

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team member.' })
  }
})

// DELETE /api/team/:id — Only founders
router.delete('/:id', protect, authorize('founder', 'ceo'), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account.' })
    }
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Team member removed.' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove team member.' })
  }
})

module.exports = router
