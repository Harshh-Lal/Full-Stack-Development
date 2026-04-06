import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json())

// ── Routes ──────────────────────────────────────────────────────
import bookingRoutes from './routes/bookings.js'
import adminRoutes from './routes/admin.js'
import ratesRoutes from './routes/rates.js'

app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/rates', ratesRoutes)

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'LevelUp API' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🎮 LevelUp API running on port ${PORT}`))