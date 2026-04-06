import { Router } from 'express'
import axios from 'axios'

const router = Router()

// In-memory cache
let ratesCache = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

// GET /api/rates — returns exchange rates relative to INR base
router.get('/', async (_req, res) => {
  try {
    const now = Date.now()

    // Return cached rates if fresh
    if (ratesCache && now - cacheTimestamp < CACHE_TTL_MS) {
      return res.json({ cached: true, rates: ratesCache })
    }

    // Fetch fresh rates (open.er-api.com — completely free, no key needed)
    const response = await axios.get('https://open.er-api.com/v6/latest/INR', {
      timeout: 8000,
    })

    if (response.data?.rates) {
      ratesCache = response.data.rates
      cacheTimestamp = now
      return res.json({ cached: false, rates: ratesCache })
    }

    throw new Error('Invalid API response')
  } catch (err) {
    console.error('[GET /api/rates]', err.message)

    // Return stale cache if available rather than failing
    if (ratesCache) {
      return res.json({ cached: true, stale: true, rates: ratesCache })
    }

    // Ultimate fallback — hardcoded approximate rates if everything fails
    return res.json({
      cached: false,
      fallback: true,
      rates: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0094, AED: 0.044 },
    })
  }
})

export default router
