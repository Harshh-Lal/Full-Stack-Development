import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const prisma = new PrismaClient()

// All session routes require admin auth
router.use(adminAuth)

// ── GET /api/sessions/active ──────────────────────────────────────────────────
// Returns all sessions where status = "active", with station label joined.
router.get('/active', async (req, res) => {
  try {
    const sessions = await prisma.stationSession.findMany({
      where:   { status: 'active' },
      orderBy: { startTime: 'asc' },
      include: {
        station: {
          select: { label: true, type: true },
        },
      },
    })
    return res.json(sessions)
  } catch (err) {
    console.error('[GET /api/sessions/active]', err)
    return res.status(500).json({ error: 'Failed to fetch active sessions' })
  }
})

// ── POST /api/sessions ────────────────────────────────────────────────────────
// Starts a new session on the given station.
// Returns 409 if the station already has an active session.
router.post('/', async (req, res) => {
  const {
    stationId,
    customerName,
    phone,
    sessionType,
    plannedDuration,
    stationBookingId,
    notes,
  } = req.body

  if (!stationId || !customerName || !phone || !sessionType || !plannedDuration) {
    return res.status(400).json({ error: 'Missing required fields: stationId, customerName, phone, sessionType, plannedDuration' })
  }

  try {
    // Check for existing active session on this station
    const existing = await prisma.stationSession.findFirst({
      where: { stationId: parseInt(stationId), status: 'active' },
    })
    if (existing) {
      return res.status(409).json({ error: 'Station already occupied' })
    }

    // Fetch station to compute pricing
    const station = await prisma.station.findUnique({
      where: { id: parseInt(stationId) },
    })
    if (!station) {
      return res.status(404).json({ error: 'Station not found' })
    }

    const pricingINR = station.hourlyRate * parseInt(plannedDuration)

    const session = await prisma.stationSession.create({
      data: {
        stationId:        parseInt(stationId),
        customerName:     String(customerName).trim(),
        phone:            String(phone).trim(),
        sessionType:      String(sessionType),
        plannedDuration:  parseInt(plannedDuration),
        pricingINR,
        stationBookingId: stationBookingId ? parseInt(stationBookingId) : null,
        notes:            notes ? String(notes).trim() : null,
        status:           'active',
      },
    })

    return res.status(201).json({ success: true, session })
  } catch (err) {
    console.error('[POST /api/sessions]', err)
    return res.status(500).json({ error: 'Failed to create session' })
  }
})

// ── PATCH /api/sessions/:id/end ───────────────────────────────────────────────
// Ends a session gracefully — status → "completed", endTime → now.
// Also updates linked StationBooking status to "completed" if present.
router.patch('/:id/end', async (req, res) => {
  const { id } = req.params

  try {
    const session = await prisma.stationSession.update({
      where: { id: parseInt(id) },
      data:  { status: 'completed', endTime: new Date() },
    })

    // Update linked booking if present
    if (session.stationBookingId) {
      await prisma.stationBooking.update({
        where: { id: session.stationBookingId },
        data:  { status: 'completed' },
      }).catch(() => { /* ignore if booking doesn't exist */ })
    }

    return res.json({ success: true, session })
  } catch (err) {
    console.error('[PATCH /api/sessions/:id/end]', err)
    return res.status(500).json({ error: 'Failed to end session' })
  }
})

// ── PATCH /api/sessions/:id/forceend ─────────────────────────────────────────
// Force-ends a session — status → "forcedend", endTime → now.
// Also updates linked StationBooking status to "completed" if present.
router.patch('/:id/forceend', async (req, res) => {
  const { id } = req.params

  try {
    const session = await prisma.stationSession.update({
      where: { id: parseInt(id) },
      data:  { status: 'forcedend', endTime: new Date() },
    })

    if (session.stationBookingId) {
      await prisma.stationBooking.update({
        where: { id: session.stationBookingId },
        data:  { status: 'completed' },
      }).catch(() => { /* ignore if booking doesn't exist */ })
    }

    return res.json({ success: true, session })
  } catch (err) {
    console.error('[PATCH /api/sessions/:id/forceend]', err)
    return res.status(500).json({ error: 'Failed to force-end session' })
  }
})

export default router
