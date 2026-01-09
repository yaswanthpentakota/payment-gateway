import { pool } from '../config/db.js'
import { generateId } from '../utils/helpers.js'

export const createOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt, notes } = req.body
  const merchantId = req.merchant.id

  // Validation
  if (!Number.isInteger(amount) || amount < 100) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST_ERROR',
        description: 'amount must be at least 100'
      }
    })
  }

  try {
    const orderId = generateId('order_')
    const query = `
      INSERT INTO orders (id, merchant_id, amount, currency, receipt, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'created')
      RETURNING *
    `
    const values = [orderId, merchantId, amount, currency, receipt, notes]
    const result = await pool.query(query, values)
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        description: 'Failed to create order'
      }
    })
  }
}

export const getOrder = async (req, res) => {
  const { orderId } = req.params
  const merchantId = req.merchant.id

  try {
    const query = 'SELECT * FROM orders WHERE id = $1 AND merchant_id = $2'
    const result = await pool.query(query, [orderId, merchantId])

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND_ERROR',
          description: 'Order not found'
        }
      })
    }

    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        description: 'Failed to fetch order'
      }
    })
  }
}

export const getPublicOrder = async (req, res) => {
  const { orderId } = req.params

  try {
    const query = 'SELECT id, amount, currency, status FROM orders WHERE id = $1'
    const result = await pool.query(query, [orderId])

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND_ERROR',
          description: 'Order not found'
        }
      })
    }

    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('Error fetching public order:', error)
    res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR' }
    })
  }
}
