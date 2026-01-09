import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { initializeDatabase } from './config/db.js'
import { getHealth } from './controllers/healthController.js'
import routes from './routes/v1.js'

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

// Health endpoint
app.get('/health', getHealth)

// API routes
app.use('/api/v1', routes)

// Start server
const startServer = async () => {
  try {
    await initializeDatabase()
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
