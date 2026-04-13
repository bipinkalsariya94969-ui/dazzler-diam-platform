require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const User = require('../models/User')
const { initSheet } = require('./googleSheets')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  // Create founder account
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL })
  if (existing) {
    console.log('Admin user already exists:', existing.email)
  } else {
    const admin = await User.create({
      name: 'Dazzler Diam Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'founder',
    })
    console.log('✅ Admin user created:', admin.email)
    console.log('   Role: founder')
    console.log('   Password:', process.env.ADMIN_PASSWORD)
    console.log('   ⚠️  Change this password after first login!')
  }

  // Init Google Sheets headers
  await initSheet()

  await mongoose.disconnect()
  console.log('Seeding complete.')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed error:', err)
  process.exit(1)
})
