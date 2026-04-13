const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

const router = express.Router()

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive.' })
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    const token = signToken(user._id)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed.' })
  }
})

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user })
})

// POST /api/auth/change-password
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: 'Current password is incorrect.' })
    }
    user.password = newPassword
    await user.save()
    res.json({ message: 'Password updated successfully.' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password.' })
  }
})

module.exports = router
