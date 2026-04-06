import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { notifyAdmin } from '../utils/whatsapp.js'

const router = Router()
const prisma = new PrismaClient()

// POST /api/bookings — create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      stationType,
      stationId,
      durationHours,
      date,
      timeSlot,
      pricingINR,
      currencyShown,
      notes,
    } = req.body

    // Basic validation
    if (!customerName || !phone || !stationType || !stationId || !durationHours || !date || !timeSlot || !pricingINR) {
      return res.status(400).json({ error: 'Missing required booking fields' })
    }

    const booking = await prisma.stationBooking.create({
      data: {
        customerName: String(customerName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        stationType: String(stationType).toLowerCase(),
        stationId: String(stationId).toUpperCase(),
        durationHours: parseInt(durationHours),
        date: String(date),
        timeSlot: String(timeSlot),
        pricingINR: parseInt(pricingINR),
        currencyShown: String(currencyShown || 'INR'),
        notes: notes ? String(notes).trim() : null,
        status: 'pending',
      },
    })

    // Fire-and-forget WhatsApp notification (never blocks response)
    notifyAdmin(booking)

    return res.status(201).json({ success: true, bookingId: booking.id })
  } catch (err) {
    console.error('[POST /api/bookings]', err)
    return res.status(500).json({ error: 'Failed to create booking' })
  }
})

export default router
