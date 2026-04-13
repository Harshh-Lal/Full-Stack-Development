import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ── Stations ────────────────────────────────────────────────────────────────
  console.log('🌱 Seeding stations...')

  const stations = [
    // PCs — positions 1–10
    { label: 'PC-01', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 1,  room: 'pc-zone' },
    { label: 'PC-02', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 2,  room: 'pc-zone' },
    { label: 'PC-03', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 3,  room: 'pc-zone' },
    { label: 'PC-04', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 4,  room: 'pc-zone' },
    { label: 'PC-05', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 5,  room: 'pc-zone' },
    { label: 'PC-06', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 6,  room: 'pc-zone' },
    { label: 'PC-07', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 7,  room: 'pc-zone' },
    { label: 'PC-08', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 8,  room: 'pc-zone' },
    { label: 'PC-09', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 9,  room: 'pc-zone' },
    { label: 'PC-10', type: 'pc', specs: 'RTX 5060 · i5 14th Gen · 16GB RAM · 240Hz', hourlyRate: 60, isActive: true,  position: 10, room: 'pc-zone' },
    // PS5s — positions 11–12
    { label: 'PS5-01', type: 'ps5', specs: 'PS5 · 4K 43inch TV', hourlyRate: 80, isActive: true,  position: 11, room: 'console-zone' },
    { label: 'PS5-02', type: 'ps5', specs: 'PS5 · 4K 43inch TV', hourlyRate: 80, isActive: false, position: 12, room: 'console-zone' },
  ]

  for (const s of stations) {
    await prisma.station.upsert({ where: { label: s.label }, update: s, create: s })
    console.log(`  ✓ ${s.label}`)
  }
  console.log('✅ Stations seeded.')

  // ── Menu Items ──────────────────────────────────────────────────────────────
  console.log('🌱 Seeding menu items...')

  const menuItems = [
    // Drinks
    { name: 'Red Bull',      category: 'drinks',   price: 120, isAvailable: true, sortOrder: 1 },
    { name: 'Cold Coffee',   category: 'drinks',   price: 80,  isAvailable: true, sortOrder: 2 },
    { name: 'Water',         category: 'drinks',   price: 20,  isAvailable: true, sortOrder: 3 },
    { name: 'Lassi',         category: 'drinks',   price: 60,  isAvailable: true, sortOrder: 4 },
    // Snacks
    { name: 'Maggi',         category: 'snacks',   price: 60,  isAvailable: true, sortOrder: 1 },
    { name: 'French Fries',  category: 'snacks',   price: 80,  isAvailable: true, sortOrder: 2 },
    { name: 'Sandwich',      category: 'snacks',   price: 100, isAvailable: true, sortOrder: 3 },
    { name: 'Chips',         category: 'snacks',   price: 40,  isAvailable: true, sortOrder: 4 },
    // Meals
    { name: 'Chicken Burger',category: 'meals',    price: 150, isAvailable: true, sortOrder: 1 },
    { name: 'Veg Burger',    category: 'meals',    price: 120, isAvailable: true, sortOrder: 2 },
    { name: 'Pasta',         category: 'meals',    price: 130, isAvailable: true, sortOrder: 3 },
    // Desserts
    { name: 'Ice Cream',     category: 'desserts', price: 70,  isAvailable: true, sortOrder: 1 },
    { name: 'Brownie',       category: 'desserts', price: 90,  isAvailable: true, sortOrder: 2 },
  ]

  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name, category: item.category } })
    if (!existing) {
      await prisma.menuItem.create({ data: item })
      console.log(`  ✓ ${item.name}`)
    } else {
      console.log(`  ~ ${item.name} (already exists)`)
    }
  }
  console.log('✅ Menu items seeded.')

  // ── GST Config ──────────────────────────────────────────────────────────────
  console.log('🌱 Seeding GST config...')
  await prisma.gSTConfig.upsert({
    where:  { id: 1 },
    update: {},
    create: { id: 1, percentage: 18, isInclusive: false },
  })
  console.log('  ✓ GST @ 18% (exclusive)')
  console.log('✅ Seed complete.')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
