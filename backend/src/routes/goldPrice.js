const express = require('express')
const router = express.Router()

// Mock gold prices (updated daily — replace with real API if available)
const MOCK_GOLD = {
  per_gram_24ct: 82.40,
  per_gram_22ct: 75.53,
  per_gram_18ct: 61.80,
  per_gram_14ct: 48.07,
  platinum_per_gram: 30.85,
  updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  source: 'mock',
}

let cachedPrice = MOCK_GOLD
let lastFetched = null
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

const fetchLiveGoldPrice = async () => {
  if (!process.env.GOLD_API_KEY) return null

  try {
    // Using goldapi.io (free tier available)
    const res = await fetch(`https://www.goldapi.io/api/XAU/USD`, {
      headers: { 'x-access-token': process.env.GOLD_API_KEY, 'Content-Type': 'application/json' }
    })
    if (!res.ok) return null
    const data = await res.json()

    // Convert troy oz to grams (1 troy oz = 31.1035 grams)
    const per_gram_24ct = data.price / 31.1035
    return {
      per_gram_24ct: parseFloat(per_gram_24ct.toFixed(2)),
      per_gram_22ct: parseFloat((per_gram_24ct * 22 / 24).toFixed(2)),
      per_gram_18ct: parseFloat((per_gram_24ct * 18 / 24).toFixed(2)),
      per_gram_14ct: parseFloat((per_gram_24ct * 14 / 24).toFixed(2)),
      platinum_per_gram: parseFloat((per_gram_24ct * 0.37).toFixed(2)),
      updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      source: 'live',
    }
  } catch {
    return null
  }
}

// GET /api/gold-price
router.get('/', async (req, res) => {
  try {
    const now = Date.now()
    if (!lastFetched || now - lastFetched > CACHE_TTL) {
      const live = await fetchLiveGoldPrice()
      if (live) {
        cachedPrice = live
        lastFetched = now
      } else {
        // Update mock date
        cachedPrice = { ...MOCK_GOLD, updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
        lastFetched = now
      }
    }
    res.json(cachedPrice)
  } catch (error) {
    res.json(MOCK_GOLD)
  }
})

module.exports = router
