require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/database')

const app = express()

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet())
app.use(compression())

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_PROD,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Strict rate limit for inquiry submissions
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many inquiries submitted. Please try again later.' },
})

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Dazzler Diam API' })
})

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/inquiries', inquiryLimiter, require('./routes/inquiries'))
app.use('/api/products', require('./routes/products'))
app.use('/api/blog', require('./routes/blog'))
app.use('/api/appointments', require('./routes/appointments'))
app.use('/api/suppliers', require('./routes/suppliers'))
app.use('/api/collaborations', require('./routes/collaborations'))
app.use('/api/gold-price', require('./routes/goldPrice'))
app.use('/api/team', require('./routes/team'))

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Dazzler Diam API running on port ${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV}`)
})

module.exports = app
