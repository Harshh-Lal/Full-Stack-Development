import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json())

// ── Routes ──────────────────────────────────────────────────────
import bookingRoutes from './routes/bookings.js'
import adminRoutes   from './routes/admin.js'
import stationRoutes from './routes/stations.js'
import sessionRoutes from './routes/sessions.js'
import menuRoutes    from './routes/menu.js'
import orderRoutes   from './routes/orders.js'
import billRoutes    from './routes/bill.js'
import gstRoutes     from './routes/gst.js'

app.use('/api/bookings', bookingRoutes)
app.use('/api/admin',    adminRoutes)
app.use('/api/stations', stationRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/menu',     menuRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/bill',     billRoutes)
app.use('/api/gst',      gstRoutes)

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'LevelUp API' }))

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`🎮 LevelUp API running on port ${PORT}`))