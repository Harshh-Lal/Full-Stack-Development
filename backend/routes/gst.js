import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const prisma = new PrismaClient()

// ── GET /api/gst ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const config = await prisma.gSTConfig.findUnique({ where: { id: 1 } })
    return res.json(config)
  } catch (err) {
    console.error('[GET /api/gst]', err)
    return res.status(500).json({ error: 'Failed to fetch GST config' })
  }
})

// ── PATCH /api/gst ────────────────────────────────────────────────────────────
router.patch('/', adminAuth, async (req, res) => {
  const { percentage, isInclusive } = req.body
  const data = {}
  if (percentage  !== undefined) data.percentage  = parseFloat(percentage)
  if (isInclusive !== undefined) data.isInclusive = Boolean(isInclusive)

  if (!Object.keys(data).length) {
    return res.status(400).json({ error: 'No valid fields: percentage or isInclusive' })
  }

  try {
    const config = await prisma.gSTConfig.upsert({
      where:  { id: 1 },
      update: data,
      create: { id: 1, percentage: data.percentage ?? 18, isInclusive: data.isInclusive ?? false },
    })
    return res.json(config)
  } catch (err) {
    console.error('[PATCH /api/gst]', err)
    return res.status(500).json({ error: 'Failed to update GST config' })
  }
})

export default router
