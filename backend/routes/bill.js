import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// ── GET /api/bill/session/:sessionId ─────────────────────────────────────────
router.get('/session/:sessionId', async (req, res) => {
  const sessionId = parseInt(req.params.sessionId)

  try {
    const session = await prisma.stationSession.findUnique({
      where:   { id: sessionId },
      include: { station: true },
    })
    if (!session) return res.status(404).json({ error: 'Session not found' })

    const order = await prisma.order.findUnique({
      where:   { sessionId },
      include: {
        items: {
          where:   { removedAt: null },
          include: { menuItem: { select: { name: true } } },
        },
      },
    })

    const gstConfig = await prisma.gSTConfig.findUnique({ where: { id: 1 } })
    const gstPercent = gstConfig ? Number(gstConfig.percentage) : 18

    const items = (order?.items ?? []).map(i => ({
      id:          i.id,
      name:        i.menuItem.name,
      quantity:    i.quantity,
      priceAtTime: i.priceAtTime,
      lineTotal:   i.quantity * i.priceAtTime,
    }))

    const foodSubtotal  = items.reduce((sum, i) => sum + i.lineTotal, 0)
    const stationCharge = session.pricingINR
    const preGSTTotal   = foodSubtotal + stationCharge
    const gstAmount     = Math.round(preGSTTotal * (gstPercent / 100) * 100) / 100
    const grandTotal    = Math.round((preGSTTotal + gstAmount) * 100) / 100

    return res.json({
      orderId:       order?.id ?? null,
      orderStatus:   order?.status ?? null,
      customer:      { name: session.customerName, phone: session.phone },
      station:       { label: session.station.label, type: session.station.type, specs: session.station.specs },
      session: {
        id:              session.id,
        startTime:       session.startTime,
        endTime:         session.endTime,
        plannedDuration: session.plannedDuration,
        sessionType:     session.sessionType,
      },
      stationCharge,
      items,
      foodSubtotal,
      preGSTTotal,
      gstPercent,
      gstAmount,
      grandTotal,
    })
  } catch (err) {
    console.error('[GET /api/bill/session/:sessionId]', err)
    return res.status(500).json({ error: 'Failed to compute bill' })
  }
})

export default router
