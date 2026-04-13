const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const ROLES = ['founder', 'ceo', 'hr_manager', 'sales', 'marketing', 'supplier_collab', 'influencer_collab', 'business_partner']

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ROLES, default: 'sales' },
  isActive: { type: Boolean, default: true },
  avatar: String,
  phone: String,
  lastLogin: Date,
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Permissions map by role
userSchema.methods.hasPermission = function (permission) {
  const permissions = {
    founder: ['*'],
    ceo: ['*'],
    hr_manager: ['view_team', 'manage_team'],
    sales: ['view_inquiries', 'update_inquiry_status', 'view_products', 'manage_appointments'],
    marketing: ['view_inquiries', 'manage_blog', 'manage_products', 'view_analytics'],
    supplier_collab: ['view_suppliers', 'manage_suppliers'],
    influencer_collab: ['view_collaborations', 'manage_collaborations'],
    business_partner: ['view_products', 'view_inquiries'],
  }
  const userPerms = permissions[this.role] || []
  return userPerms.includes('*') || userPerms.includes(permission)
}

module.exports = mongoose.model('User', userSchema)
