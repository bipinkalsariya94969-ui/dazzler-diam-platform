const express = require('express')
const Supplier = require('../models/Supplier')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// GET /api/suppliers — Admin
router.get('/', protect, async (req, res) => {
  try {
    const { country, specialty, membership } = req.query
    const filter = {}
    if (country) filter.country = country
    if (specialty) filter.specialties = specialty
    if (membership) filter.membershipStatus = membership

    const suppliers = await Supplier.find(filter).sort('country name')
    res.json(suppliers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers.' })
  }
})

// POST /api/suppliers — Admin
router.post('/', protect, authorize('founder', 'ceo', 'supplier_collab'), async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body)
    res.status(201).json(supplier)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier.' })
  }
})

// PUT /api/suppliers/:id — Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!supplier) return res.status(404).json({ error: 'Supplier not found.' })
    res.json(supplier)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supplier.' })
  }
})

// DELETE /api/suppliers/:id
router.delete('/:id', protect, authorize('founder', 'ceo'), async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id)
    res.json({ message: 'Supplier removed.' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier.' })
  }
})

// PATCH /api/suppliers/:id/membership — Manage $10k membership
router.patch('/:id/membership', protect, authorize('founder', 'ceo'), async (req, res) => {
  try {
    const { action } = req.body // 'activate' | 'deactivate'
    const updates = {}
    if (action === 'activate') {
      updates.membershipStatus = 'active'
      updates.membershipStartDate = new Date()
      updates.membershipEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    } else {
      updates.membershipStatus = 'expired'
    }
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, updates, { new: true })
    res.json(supplier)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update membership.' })
  }
})

module.exports = router
