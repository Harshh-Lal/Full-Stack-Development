import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding menu items with updated categories...')

  const menuItems = [
    // ── BEVERAGES (Cold Coffees & Shakes) ──────────────────────────────────────
    { name: 'Classic Cold Coffee',       category: 'beverages', price: 70,  isAvailable: true, sortOrder: 10 },
    { name: 'Thick Cold Coffee',         category: 'beverages', price: 70,  isAvailable: true, sortOrder: 11 },
    { name: 'Cold Coffee with Crush',    category: 'beverages', price: 80,  isAvailable: true, sortOrder: 12 },
    { name: 'Caramel Coffee',            category: 'beverages', price: 90,  isAvailable: true, sortOrder: 13 },
    { name: 'Hazelnut Shake',            category: 'beverages', price: 90,  isAvailable: true, sortOrder: 14 },
    { name: 'Oreo Shake',                category: 'beverages', price: 90,  isAvailable: true, sortOrder: 15 },
    { name: 'Chocolate Shake',           category: 'beverages', price: 90,  isAvailable: true, sortOrder: 16 },
    { name: 'Butterscotch Shake',        category: 'beverages', price: 90,  isAvailable: true, sortOrder: 17 },
    { name: 'Strawberry Shake',          category: 'beverages', price: 90,  isAvailable: true, sortOrder: 18 },

    // ── MOJITO'S ────────────────────────────────────────────────────────────────
    { name: 'Mosambi Blast',             category: 'mojitos',   price: 70,  isAvailable: true, sortOrder: 20 },
    { name: 'Mint Blast',                category: 'mojitos',   price: 70,  isAvailable: true, sortOrder: 21 },
    { name: 'Watermelon Mojito',         category: 'mojitos',   price: 70,  isAvailable: true, sortOrder: 22 },
    { name: 'Blue Margarita',            category: 'mojitos',   price: 70,  isAvailable: true, sortOrder: 23 },
    { name: 'Kala Khatta Mojito',        category: 'mojitos',   price: 70,  isAvailable: true, sortOrder: 24 },
    { name: 'Spicy Mango Mojito',        category: 'mojitos',   price: 70,  isAvailable: true, sortOrder: 25 },
    { name: 'Chilli Guava Mojito',       category: 'mojitos',   price: 70,  isAvailable: true, sortOrder: 26 },
    { name: 'Green Apple Mojito',        category: 'mojitos',   price: 70,  isAvailable: true, sortOrder: 27 },

    // ── BURGERS ─────────────────────────────────────────────────────────────────
    { name: 'Veg Burger (No Cheese)',               category: 'burgers', price: 60,  isAvailable: true, sortOrder: 30 },
    { name: 'Cheese Butter Burger',                 category: 'burgers', price: 80,  isAvailable: true, sortOrder: 31 },
    { name: 'Cheese Spicy Burger',                  category: 'burgers', price: 80,  isAvailable: true, sortOrder: 32 },
    { name: 'Cheese Chilli Garlic Burger',          category: 'burgers', price: 90,  isAvailable: true, sortOrder: 33 },
    { name: 'Cheese American Mustard Burger',       category: 'burgers', price: 90,  isAvailable: true, sortOrder: 34 },
    { name: 'Cheese Special Burger',                category: 'burgers', price: 100, isAvailable: true, sortOrder: 35 },
    { name: 'Cheese Mexican Paprika Burger',        category: 'burgers', price: 100, isAvailable: true, sortOrder: 36 },
    { name: 'Cheese Potato Crunch Burger',          category: 'burgers', price: 120, isAvailable: true, sortOrder: 37 },
    { name: 'Cheese Classic Burger',                category: 'burgers', price: 120, isAvailable: true, sortOrder: 38 },
    { name: 'Cheese Double Tikki Burger',           category: 'burgers', price: 120, isAvailable: true, sortOrder: 39 },
    { name: 'Cheese Paneer Tikki Burger',           category: 'burgers', price: 140, isAvailable: true, sortOrder: 40 },
    { name: 'Cheese Tikka Paneer Burger',           category: 'burgers', price: 140, isAvailable: true, sortOrder: 41 },
    { name: 'Cheese Special Double Tikki Burger',   category: 'burgers', price: 150, isAvailable: true, sortOrder: 42 },
    { name: 'Cheese Tsunami Burger',                category: 'burgers', price: 180, isAvailable: true, sortOrder: 43 },
    { name: "World's Healthiest Burger",            category: 'burgers', price: 180, isAvailable: true, sortOrder: 44 },

    // ── PIZZAS (Regular — 7 inch, 6 pieces) ────────────────────────────────────
    { name: 'Tomatino Pizza',            category: 'pizzas', price: 110, isAvailable: true, sortOrder: 50 },
    { name: 'Onion Capsicum Pizza',      category: 'pizzas', price: 130, isAvailable: true, sortOrder: 51 },
    { name: 'Sweet Corn Pizza',          category: 'pizzas', price: 130, isAvailable: true, sortOrder: 52 },
    { name: 'Mix Veg Pizza',             category: 'pizzas', price: 140, isAvailable: true, sortOrder: 53 },
    { name: 'Spicy Delight Pizza',       category: 'pizzas', price: 140, isAvailable: true, sortOrder: 54 },
    { name: 'Mushroom Pizza',            category: 'pizzas', price: 150, isAvailable: true, sortOrder: 55 },
    { name: 'Babycorn Pizza',            category: 'pizzas', price: 150, isAvailable: true, sortOrder: 56 },
    { name: 'Margherita Pizza',          category: 'pizzas', price: 140, isAvailable: true, sortOrder: 57 },
    { name: 'Paneer Pizza',              category: 'pizzas', price: 160, isAvailable: true, sortOrder: 58 },
    { name: 'Chocolate Pizza',           category: 'pizzas', price: 150, isAvailable: true, sortOrder: 59 },

    // ── SPECIAL PIZZAS (7 inch, 6 pieces) ──────────────────────────────────────
    { name: 'Ultimate Pizza',                  category: 'special_pizzas', price: 180, isAvailable: true, sortOrder: 60 },
    { name: 'Paneer Butter Masala Pizza',      category: 'special_pizzas', price: 190, isAvailable: true, sortOrder: 61 },
    { name: 'Paneer Tikka Masala Pizza',       category: 'special_pizzas', price: 190, isAvailable: true, sortOrder: 62 },
    { name: 'Cheese Chilli Garlic Pizza',      category: 'special_pizzas', price: 190, isAvailable: true, sortOrder: 63 },
    { name: 'Spicy Delight Paneer Pizza',      category: 'special_pizzas', price: 190, isAvailable: true, sortOrder: 64 },
    { name: 'Cheese Indo Western Pizza',       category: 'special_pizzas', price: 190, isAvailable: true, sortOrder: 65 },
    { name: 'Cheese Peppery Pizza',            category: 'special_pizzas', price: 190, isAvailable: true, sortOrder: 66 },
    { name: 'Italian Fragrance Pizza',         category: 'special_pizzas', price: 200, isAvailable: true, sortOrder: 67 },
    { name: "Cheese Lover's Pizza",            category: 'special_pizzas', price: 220, isAvailable: true, sortOrder: 68 },
    { name: 'Double Cheese Pizza',             category: 'special_pizzas', price: 250, isAvailable: true, sortOrder: 69 },

    // ── SUBS & FRANKIES ─────────────────────────────────────────────────────────
    { name: 'Cheese Spicy Treat Sub',          category: 'subs', price: 130, isAvailable: true, sortOrder: 70 },
    { name: 'Cheese Italian Aroma Sub',        category: 'subs', price: 130, isAvailable: true, sortOrder: 71 },
    { name: 'Cheese Garlicious Sub',           category: 'subs', price: 130, isAvailable: true, sortOrder: 72 },
    { name: 'Cheese Special Super Crunch Sub', category: 'subs', price: 140, isAvailable: true, sortOrder: 73 },
    { name: 'Cheese Richie Rich Sub',          category: 'subs', price: 150, isAvailable: true, sortOrder: 74 },
    { name: 'Cheese Royal Paneer Sub',         category: 'subs', price: 160, isAvailable: true, sortOrder: 75 },
    { name: 'Veg Cheese Frankie',              category: 'subs', price: 120, isAvailable: true, sortOrder: 76 },
    { name: 'Spicy Cheese Frankie',            category: 'subs', price: 120, isAvailable: true, sortOrder: 77 },
    { name: 'Cheese Paneer Tikki Frankie',     category: 'subs', price: 130, isAvailable: true, sortOrder: 78 },

    // ── SPECIAL JAIN MENU ───────────────────────────────────────────────────────
    { name: 'Jain Veg Cheese Grill',            category: 'jain', price: 80,  isAvailable: true, sortOrder: 80 },
    { name: 'Chocolate Grill',                  category: 'jain', price: 90,  isAvailable: true, sortOrder: 81 },
    { name: 'Jain Paneer Jalapeno Grill',       category: 'jain', price: 110, isAvailable: true, sortOrder: 82 },
    { name: 'Jain Paneer Tikki Burger',         category: 'jain', price: 130, isAvailable: true, sortOrder: 83 },
    { name: 'Jain Cheese Paneer Tikki Burger',  category: 'jain', price: 130, isAvailable: true, sortOrder: 84 },
    { name: 'Jain Cheese Paneer Tikki Frankie', category: 'jain', price: 130, isAvailable: true, sortOrder: 85 },
    { name: 'Jain Cheese Royal Paneer Sub',     category: 'jain', price: 160, isAvailable: true, sortOrder: 86 },
    { name: 'Jain Cheesy Peppery Pizza',        category: 'jain', price: 190, isAvailable: true, sortOrder: 87 },
    { name: 'Jain Margherita Pizza',            category: 'jain', price: 140, isAvailable: true, sortOrder: 88 },
    { name: 'Jain Paneer Butter Masala Pizza',  category: 'jain', price: 190, isAvailable: true, sortOrder: 89 },
    { name: 'Jain Paneer Tikka Masala Pizza',   category: 'jain', price: 190, isAvailable: true, sortOrder: 90 },
  ]

  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } })
    if (!existing) {
      await prisma.menuItem.create({ data: item })
      console.log(`  ✓ Created: ${item.name} [${item.category}]`)
    } else {
      // Update category + price to reflect new structure
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { category: item.category, price: item.price, sortOrder: item.sortOrder },
      })
      console.log(`  ~ Updated: ${item.name} → [${item.category}]`)
    }
  }

  console.log('\n✅ Menu items seeded/updated with new categories.')
  console.log('   beverages | mojitos | burgers | pizzas | special_pizzas | subs | jain')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
