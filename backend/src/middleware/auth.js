const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated. Please log in.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive.' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' })
    }
    return res.status(401).json({ error: 'Invalid token.' })
  }
}

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role) && req.user.role !== 'founder' && req.user.role !== 'ceo') {
    return res.status(403).json({ error: 'Insufficient permissions.' })
  }
  next()
}

const permission = (perm) => (req, res, next) => {
  if (!req.user.hasPermission(perm)) {
    return res.status(403).json({ error: `Missing permission: ${perm}` })
  }
  next()
}

module.exports = { protect, authorize, permission }
