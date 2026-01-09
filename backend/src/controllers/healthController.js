import { pool } from '../config/db.js'

export const getHealth = async (req, res) => {
  try {
    await pool.query('SELECT 1')
    const dbStatus = 'connected'
    
    res.status(200).json({
      status: 'healthy',
      database: dbStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    })
  }
}
