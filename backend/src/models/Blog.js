const mongoose = require('mongoose')
const slugify = require('slugify')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, trim: true },
  content: { type: String, required: true },
  coverImage: String,
  category: { type: String, enum: ['Education', 'Trends', 'Guide', 'Behind the Scenes', 'Client Stories', 'Certification'], default: 'Education' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false },
  publishedAt: Date,
  readTime: String,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  views: { type: Number, default: 0 },
}, { timestamps: true })

blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  // Auto-calculate read time (~200 words/min)
  if (this.content) {
    const words = this.content.split(/\s+/).length
    this.readTime = `${Math.ceil(words / 200)} min`
  }
  // Auto SEO
  if (!this.seo?.metaTitle) {
    if (!this.seo) this.seo = {}
    this.seo.metaTitle = this.title + ' | Dazzler Diam Jewels'
    this.seo.metaDescription = this.excerpt || this.title
  }
  next()
})

blogSchema.index({ published: 1, publishedAt: -1 })

module.exports = mongoose.model('Blog', blogSchema)
