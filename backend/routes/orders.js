import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const prisma = new PrismaClient()

// ── Helper: fetch a full order with active items ──────────────────────────────
async function getFullOrder(orderId) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        where: { removedAt: null },
        include: { menuItem: { select: { name: true, category: true } } },
        orderBy: { addedAt: 'asc' },
      },
    },
  })
}

// ── GET /api/orders/session/:sessionId ────────────────────────────────────────
router.get('/session/:sessionId', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { sessionId: parseInt(req.params.sessionId) },
      include: {
        items: {
          where: { removedAt: null },
          include: { menuItem: { select: { name: true, category: true } } },
          orderBy: { addedAt: 'asc' },
        },
      },
    })
    if (!order) return res.json(null)
    const foodSubtotal = order.items.reduce((sum, i) => sum + i.quantity * i.priceAtTime, 0)
    return res.json({ ...order, foodSubtotal })
  } catch (err) {
    console.error('[GET /api/orders/session/:sessionId]', err)
    return res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// ── POST /api/orders/session/:sessionId — create or return existing ───────────
router.post('/session/:sessionId', async (req, res) => {
  const sessionId = parseInt(req.params.sessionId)
  try {
    const existing = await prisma.order.findUnique({ where: { sessionId } })
    if (existing) {
      const full = await getFullOrder(existing.id)
      const foodSubtotal = full.items.reduce((sum, i) => sum + i.quantity * i.priceAtTime, 0)
      return res.json({ ...full, foodSubtotal })
    }
    const order = await prisma.order.create({
      data: { sessionId },
    })
    const full = await getFullOrder(order.id)
    return res.status(201).json({ ...full, foodSubtotal: 0 })
  } catch (err) {
    console.error('[POST /api/orders/session/:sessionId]', err)
    return res.status(500).json({ error: 'Failed to create order' })
  }
})

// ── POST /api/orders/:orderId/items — add item or increment quantity ───────────
router.post('/:orderId/items', async (req, res) => {
  const orderId   = parseInt(req.params.orderId)
  const { menuItemId, quantity = 1 } = req.body

  if (!menuItemId) return res.status(400).json({ error: 'menuItemId is required' })

  try {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: parseInt(menuItemId) } })
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' })

    // Check for existing active row for this menu item in this order
    const existing = await prisma.orderItem.findFirst({
      where: { orderId, menuItemId: parseInt(menuItemId), removedAt: null },
    })

    if (existing) {
      await prisma.orderItem.update({
        where: { id: existing.id },
        data:  { quantity: existing.quantity + parseInt(quantity) },
      })
    } else {
      await prisma.orderItem.create({
        data: {
          orderId,
          menuItemId:  parseInt(menuItemId),
          quantity:    parseInt(quantity),
          priceAtTime: menuItem.price,
        },
      })
    }

    const full = await getFullOrder(orderId)
    const foodSubtotal = full.items.reduce((sum, i) => sum + i.quantity * i.priceAtTime, 0)
    return res.json({ ...full, foodSubtotal })
  } catch (err) {
    console.error('[POST /api/orders/:orderId/items]', err)
    return res.status(500).json({ error: 'Failed to add item' })
  }
})

// ── PATCH /api/orders/:orderId/items/:itemId — update qty or soft-delete ──────
router.patch('/:orderId/items/:itemId', async (req, res) => {
  const orderId = parseInt(req.params.orderId)
  const itemId  = parseInt(req.params.itemId)
  const { quantity } = req.body

  if (quantity === undefined) return res.status(400).json({ error: 'quantity is required' })

  try {
    if (parseInt(quantity) === 0) {
      await prisma.orderItem.update({ where: { id: itemId }, data: { removedAt: new Date() } })
    } else {
      await prisma.orderItem.update({ where: { id: itemId }, data: { quantity: parseInt(quantity) } })
    }
    const full = await getFullOrder(orderId)
    const foodSubtotal = full.items.reduce((sum, i) => sum + i.quantity * i.priceAtTime, 0)
    return res.json({ ...full, foodSubtotal })
  } catch (err) {
    console.error('[PATCH /api/orders/:orderId/items/:itemId]', err)
    return res.status(500).json({ error: 'Failed to update item' })
  }
})

// ── PATCH /api/orders/:orderId/status — update order status ──────────────────
router.patch('/:orderId/status', adminAuth, async (req, res) => {
  const { status } = req.body
  if (!['billed', 'paid'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "billed" or "paid"' })
  }
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.orderId) },
      data:  { status },
    })
    return res.json({ success: true, order })
  } catch (err) {
    console.error('[PATCH /api/orders/:orderId/status]', err)
    return res.status(500).json({ error: 'Failed to update order status' })
  }
})

export default router
