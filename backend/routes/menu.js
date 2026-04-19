import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const prisma = new PrismaClient()

const CATEGORIES = ['beverages', 'mojitos', 'burgers', 'pizzas', 'special_pizzas', 'subs', 'jain']

// ── GET /api/menu — grouped by category, sorted by sortOrder ─────────────────
router.get('/', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] })
    const grouped = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = items.filter(i => i.category === cat)
      return acc
    }, {})
    return res.json(grouped)
  } catch (err) {
    console.error('[GET /api/menu]', err)
    return res.status(500).json({ error: 'Failed to fetch menu' })
  }
})

// ── POST /api/menu — create new item ─────────────────────────────────────────
router.post('/', adminAuth, async (req, res) => {
  const { name, category, price, sortOrder } = req.body
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'name, category, and price are required' })
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(', ')}` })
  }
  try {
    const item = await prisma.menuItem.create({
      data: { name: String(name).trim(), category, price: parseInt(price), sortOrder: parseInt(sortOrder ?? 0) },
    })
    return res.status(201).json(item)
  } catch (err) {
    console.error('[POST /api/menu]', err)
    return res.status(500).json({ error: 'Failed to create menu item' })
  }
})

// ── PATCH /api/menu/:id — update item fields ──────────────────────────────────
router.patch('/:id', adminAuth, async (req, res) => {
  const { id } = req.params
  const { name, price, isAvailable, sortOrder } = req.body
  const data = {}
  if (name !== undefined)        data.name        = String(name).trim()
  if (price !== undefined)       data.price       = parseInt(price)
  if (isAvailable !== undefined) data.isAvailable = Boolean(isAvailable)
  if (sortOrder !== undefined)   data.sortOrder   = parseInt(sortOrder)

  if (!Object.keys(data).length) {
    return res.status(400).json({ error: 'No valid fields to update' })
  }
  try {
    const item = await prisma.menuItem.update({ where: { id: parseInt(id) }, data })
    return res.json(item)
  } catch (err) {
    console.error('[PATCH /api/menu/:id]', err)
    return res.status(500).json({ error: 'Failed to update menu item' })
  }
})

// ── PATCH /api/menu/:id/toggle — flip isAvailable ────────────────────────────
router.patch('/:id/toggle', adminAuth, async (req, res) => {
  const { id } = req.params
  try {
    const current = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } })
    if (!current) return res.status(404).json({ error: 'Item not found' })
    const item = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data:  { isAvailable: !current.isAvailable },
    })
    return res.json(item)
  } catch (err) {
    console.error('[PATCH /api/menu/:id/toggle]', err)
    return res.status(500).json({ error: 'Failed to toggle availability' })
  }
})

// ── DELETE /api/menu/:id — remove item (guards against active order refs) ─────
router.delete('/:id', adminAuth, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    // Safety check — don't delete if item has been ordered (even once)
    const inUse = await prisma.orderItem.findFirst({ where: { menuItemId: id } })
    if (inUse) {
      return res.status(409).json({
        error: 'Item has been ordered before. Mark it Out of Stock instead of deleting.',
      })
    }
    await prisma.menuItem.delete({ where: { id } })
    return res.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/menu/:id]', err)
    return res.status(500).json({ error: 'Failed to delete menu item' })
  }
})

export default router
