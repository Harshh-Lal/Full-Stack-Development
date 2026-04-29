import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // ── GST → 5% ─────────────────────────────────────────────────────────────
  await prisma.gSTConfig.update({ where: { id: 1 }, data: { percentage: 5 } })
  console.log('✅ GST updated to 5%')

  // ── Fetch stations & menu items dynamically ───────────────────────────────
  const st = {}
  const stations = await prisma.station.findMany()
  stations.forEach(s => { st[s.label] = s })

  const menu = {}
  const items = await prisma.menuItem.findMany()
  items.forEach(i => { menu[i.name] = i })

  // ── ADVANCE BOOKINGS ──────────────────────────────────────────────────────
  console.log('🌱 Seeding bookings...')
  const bData = [
    { customerName:'Arjun Mehta',    phone:'9812345670', email:'arjun@gmail.com',  stationType:'pc',  stationId:'PC-02',  durationHours:2, date:'2026-04-29', timeSlot:'10:00 AM', pricingINR:120, currencyShown:'INR', status:'confirmed', notes:null },
    { customerName:'Priya Sharma',   phone:'9823456781', email:'priya@outlook.com', stationType:'ps5', stationId:'PS5-01', durationHours:1, date:'2026-04-29', timeSlot:'12:00 PM', pricingINR:80,  currencyShown:'INR', status:'confirmed', notes:'FIFA tournament practice' },
    { customerName:'Rohan Patel',    phone:'9834567892', email:null,                stationType:'pc',  stationId:'PC-05',  durationHours:3, date:'2026-04-29', timeSlot:'2:00 PM',  pricingINR:180, currencyShown:'INR', status:'pending',   notes:null },
    { customerName:'Sneha Kulkarni', phone:'9845678903', email:'sneha@gmail.com',  stationType:'pc',  stationId:'PC-07',  durationHours:2, date:'2026-04-30', timeSlot:'4:00 PM',  pricingINR:120, currencyShown:'INR', status:'pending',   notes:'BGMI session' },
    { customerName:'Karan Joshi',    phone:'9856789014', email:'kj@yahoo.com',     stationType:'pc',  stationId:'PC-03',  durationHours:1, date:'2026-04-29', timeSlot:'6:00 PM',  pricingINR:60,  currencyShown:'USD', status:'cancelled', notes:null },
    { customerName:'Vikram Singh',   phone:'9878901236', email:'vikram@gmail.com', stationType:'pc',  stationId:'PC-04',  durationHours:4, date:'2026-04-29', timeSlot:'11:00 AM', pricingINR:240, currencyShown:'INR', status:'confirmed', notes:null },
    { customerName:'Nisha Gupta',    phone:'9867890125', email:null,               stationType:'ps5', stationId:'PS5-01', durationHours:2, date:'2026-04-30', timeSlot:'3:00 PM',  pricingINR:160, currencyShown:'INR', status:'pending',   notes:'Birthday - need extra chairs' },
  ]
  for (const b of bData) {
    await prisma.stationBooking.create({ data: b })
    console.log(`  ✓ Booking: ${b.customerName} [${b.status}]`)
  }

  // ── COMPLETED SESSIONS WITH ORDERS ────────────────────────────────────────
  console.log('🌱 Seeding completed sessions...')

  async function makeSession(label, name, phone, type, durH, startISO, endISO, status, notes, orderItems) {
    const s = st[label]
    const session = await prisma.stationSession.create({
      data: {
        stationId: s.id, customerName: name, phone,
        sessionType: type, startTime: new Date(startISO), endTime: new Date(endISO),
        plannedDuration: durH, pricingINR: s.hourlyRate * durH,
        status, notes,
      }
    })
    if (orderItems && orderItems.length > 0) {
      await prisma.order.create({
        data: {
          sessionId: session.id, status: 'paid',
          items: {
            create: orderItems.map(([name, qty]) => ({
              menuItemId: menu[name].id, quantity: qty, priceAtTime: menu[name].price
            }))
          }
        }
      })
    }
    console.log(`  ✓ ${label} → ${name} [${status}]`)
    return session
  }

  // UTC times (IST = UTC+5:30)
  await makeSession('PC-02','Arjun Mehta',  '9812345670','walkin',2,'2026-04-29T04:30:00Z','2026-04-29T06:30:00Z','completed',null,[['Classic Cold Coffee',2],['Cheese Classic Burger',1]])
  await makeSession('PC-06','Ananya Roy',   '9890123457','walkin',1,'2026-04-29T07:30:00Z','2026-04-29T08:30:00Z','completed',null,[])
  await makeSession('PS5-01','Priya Sharma','9823456781','walkin',1,'2026-04-29T06:30:00Z','2026-04-29T07:30:00Z','completed','FIFA practice',[['Mint Blast',2],['Cheese Paneer Tikki Burger',1]])
  await makeSession('PC-04','Vikram Singh', '9878901236','walkin',2,'2026-04-29T09:00:00Z','2026-04-29T11:00:00Z','completed',null,[['Caramel Coffee',1],['Mosambi Blast',1],['Margherita Pizza',1]])
  await makeSession('PC-05','Karan Joshi',  '9856789014','walkin',3,'2026-04-29T11:00:00Z','2026-04-29T14:00:00Z','forcedend','Left early',[['Oreo Shake',2],['Double Cheese Pizza',1],['Veg Cheese Frankie',1]])
  await makeSession('PC-08','Dev Kapoor',   '9934567801','walkin',2,'2026-04-29T03:00:00Z','2026-04-29T05:00:00Z','completed',null,[['Chocolate Shake',1],['Cheese Spicy Burger',1]])

  console.log('✅ Completed sessions done.')

  // ── ACTIVE SESSIONS (shows on Live Stations) ──────────────────────────────
  console.log('🌱 Seeding active sessions...')

  async function makeActive(label, name, phone, type, durH, minsAgo, notes, orderItems) {
    const s = st[label]
    const startTime = new Date(Date.now() - minsAgo * 60 * 1000)
    const session = await prisma.stationSession.create({
      data: {
        stationId: s.id, customerName: name, phone,
        sessionType: type, startTime, endTime: null,
        plannedDuration: durH, pricingINR: type === 'maintenance' ? 0 : s.hourlyRate * durH,
        status: 'active', notes,
      }
    })
    if (orderItems && orderItems.length > 0) {
      await prisma.order.create({
        data: {
          sessionId: session.id, status: 'open',
          items: {
            create: orderItems.map(([name, qty]) => ({
              menuItemId: menu[name].id, quantity: qty, priceAtTime: menu[name].price
            }))
          }
        }
      })
    }
    console.log(`  ✓ ${label} → ${name} [ACTIVE, ${minsAgo}min ago]`)
  }

  await makeActive('PC-01','Rahul Shah',  '9901234568','walkin',     2, 47, null,               [['Classic Cold Coffee',1]])
  await makeActive('PC-03','Meera Nair',  '9912345679','walkin',     1, 22, null,               [])
  await makeActive('PC-09','Sameer Khan', '9923456780','walkin',     2, 65, null,               [['Oreo Shake',1],['Cheese Spicy Burger',1]])
  await makeActive('PS5-01','Staff',      '0000000000','maintenance',1, 12, 'Controller calib.',[])

  console.log('✅ Active sessions done.')
  console.log('\n🎮 DEMO DATA COMPLETE!')
  console.log('   7 Bookings | 6 Completed sessions | 4 Active sessions | GST @ 5%')
}

main()
  .catch(e => { console.error('❌ Failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
