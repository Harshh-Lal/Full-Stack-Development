import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const prisma = new PrismaClient()

// ── GET /api/stations ─────────────────────────────────────────────────────────
// Returns all stations ordered by position, with the current active session
// included (status = "active", take: 1).
router.get('/', async (req, res) => {
  try {
    const stations = await prisma.station.findMany({
      orderBy: { position: 'asc' },
      include: {
        sessions: {
          where:  { status: 'active' },
          take:   1,
          select: {
            id:              true,
            customerName:    true,
            phone:           true,
            startTime:       true,
            plannedDuration: true,
            pricingINR:      true,
            sessionType:     true,
          },
        },
      },
    })

    // Reshape: sessions array → activeSession object (or null)
    const result = stations.map((s) => ({
      id:           s.id,
      label:        s.label,
      type:         s.type,
      specs:        s.specs,
      hourlyRate:   s.hourlyRate,
      isActive:     s.isActive,
      position:     s.position,
      activeSession: s.sessions[0] ?? null,
    }))

    return res.json(result)
  } catch (err) {
    console.error('[GET /api/stations]', err)
    return res.status(500).json({ error: 'Failed to fetch stations' })
  }
})

// ── PATCH /api/stations/:id ───────────────────────────────────────────────────
// Update isActive or hourlyRate only. Ignores any other fields.
router.patch('/:id', adminAuth, async (req, res) => {
  const { id } = req.params
  const { isActive, hourlyRate } = req.body

  const data = {}
  if (typeof isActive === 'boolean') data.isActive = isActive
  if (typeof hourlyRate === 'number') data.hourlyRate = hourlyRate

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update. Accepted: isActive, hourlyRate' })
  }

  try {
    const station = await prisma.station.update({
      where: { id: parseInt(id) },
      data,
    })
    return res.json({ success: true, station })
  } catch (err) {
    console.error('[PATCH /api/stations/:id]', err)
    return res.status(500).json({ error: 'Failed to update station' })
  }
})

export default router
