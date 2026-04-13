const mongoose = require('mongoose')

const inquirySchema = new mongoose.Schema({
  // Customer info
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  country: { type: String, trim: true },

  // Product specs
  productType: { type: String, enum: ['Ring', 'Necklace', 'Bracelet', 'Earrings', 'Pendant', 'Bangle', 'Custom'], default: 'Ring' },
  carat: { type: String },
  shape: { type: String },
  color: { type: String, enum: ['D', 'E', 'F', 'G'] },
  clarity: { type: String, enum: ['VVS1', 'VVS2', 'VS1', 'VS2'] },
  certification: { type: String, enum: ['IGI', 'GIA'] },
  metal: { type: String },
  ringSize: { type: String },
  ringSizeSystem: { type: String, enum: ['US', 'UK'] },

  // Estimate
  estimatedPrice: {
    diamond: Number,
    setting: Number,
    total: Number,
  },
  goldPriceToday: {
    per_gram_18ct: Number,
    updated: String,
  },

  // Reference product (if user clicked from a product)
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,

  // Additional
  notes: { type: String, trim: true },
  inspirationImage: String, // Cloudinary URL

  // Status tracking
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'in-progress', 'closed', 'cancelled'],
    default: 'new',
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedSupplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },

  // Internal notes
  internalNotes: [{ 
    text: String, 
    addedBy: String, 
    addedAt: { type: Date, default: Date.now } 
  }],

  // Follow-up
  followUpDate: Date,
  lastContactedAt: Date,

  // Google Sheets sync
  sheetRowId: String,
  sheetSynced: { type: Boolean, default: false },

}, { timestamps: true })

// Text search index
inquirySchema.index({ name: 'text', email: 'text', notes: 'text' })
inquirySchema.index({ status: 1, country: 1, createdAt: -1 })

module.exports = mongoose.model('Inquiry', inquirySchema)
