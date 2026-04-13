const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: String,
  country: { type: String, enum: ['USA', 'UK', 'Canada', 'UAE', 'Hong Kong', 'India', 'Belgium', 'Israel', 'Other'], required: true },
  email: String,
  phone: String,
  whatsapp: String,
  website: String,

  specialties: [{ type: String, enum: ['Lab-Grown Diamonds', 'Natural Diamonds', 'Gold Settings', 'Platinum Settings', 'Gemstones', 'Custom Design'] }],
  certifications: [String],

  membershipStatus: {
    type: String,
    enum: ['none', 'active', 'expired'],
    default: 'none',
  },
  membershipFee: { type: Number, default: 10000 }, // $10,000/year
  membershipStartDate: Date,
  membershipEndDate: Date,

  notes: String,
  isActive: { type: Boolean, default: true },
  rating: { type: Number, min: 1, max: 5 },

}, { timestamps: true })

module.exports = mongoose.model('Supplier', supplierSchema)
