import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const prisma = new PrismaClient()

// ── POST /api/admin/verify — check PIN, return JWT ────────────────
router.post('/verify', async (req, res) => {
  const { pin } = req.body
  if (!pin) return res.status(400).json({ error: 'PIN required' })

  if (String(pin) !== String(process.env.ADMIN_PIN)) {
    return res.status(401).json({ error: 'Invalid PIN' })
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' })
  return res.json({ token })
})

// ── GET /api/admin/bookings — all bookings, newest first ──────────
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const bookings = await prisma.stationBooking.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return res.json(bookings)
  } catch (err) {
    console.error('[GET /api/admin/bookings]', err)
    return res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// ── PATCH /api/admin/bookings/:id — update status ─────────────────
router.patch('/bookings/:id', adminAuth, async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "confirmed" or "cancelled"' })
  }

  try {
    const booking = await prisma.stationBooking.update({
      where: { id: parseInt(id) },
      data: { status },
    })
    return res.json({ success: true, booking })
  } catch (err) {
    console.error('[PATCH /api/admin/bookings/:id]', err)
    return res.status(500).json({ error: 'Failed to update booking' })
  }
})

// ── GET /api/admin/stats — dashboard stat cards ───────────────────
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"

    const [total, pending, todayCount] = await Promise.all([
      prisma.stationBooking.count(),
      prisma.stationBooking.count({ where: { status: 'pending' } }),
      prisma.stationBooking.count({ where: { date: today } }),
    ])

    return res.json({ total, pending, todayCount })
  } catch (err) {
    console.error('[GET /api/admin/stats]', err)
    return res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
