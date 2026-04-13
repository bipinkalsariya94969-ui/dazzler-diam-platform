const mongoose = require('mongoose')
const slugify = require('slugify')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  category: { type: String, enum: ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants', 'Bangles', 'Custom'], required: true },
  description: String,

  // Diamond specs
  carat: String,
  shape: String,
  color: { type: String, enum: ['D', 'E', 'F', 'G', 'H', 'I', 'J'] },
  clarity: { type: String, enum: ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'] },
  certification: { type: String, enum: ['IGI', 'GIA', 'HRD'] },
  metal: String,

  // Media
  images: [{
    url: String,
    publicId: String,
    alt: String,
    aspectRatio: { type: String, enum: ['1:1', '16:9', '4:3'], default: '1:1' },
  }],
  video: {
    url: String,
    publicId: String,
  },

  // Status
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isSpotlight: { type: Boolean, default: false },

  tags: [String],
  sortOrder: { type: Number, default: 0 },

}, { timestamps: true })

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

productSchema.index({ category: 1, isPublished: 1, isFeatured: -1 })

module.exports = mongoose.model('Product', productSchema)
