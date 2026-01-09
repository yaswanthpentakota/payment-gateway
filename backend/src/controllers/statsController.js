import { pool } from '../config/db.js'

export const getStats = async (req, res) => {
  const merchantId = req.merchant.id

  try {
    const query = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as total_amount,
        COUNT(CASE WHEN status = 'success' THEN 1 END) as success_count
      FROM payments
      WHERE merchant_id = $1
    `

    const result = await pool.query(query, [merchantId])
    const { total_transactions, total_amount, success_count } = result.rows[0]

    const total = parseInt(total_transactions, 10)
    const amount = parseInt(total_amount || 0, 10)
    const success = parseInt(success_count, 10)
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0

    res.status(200).json({
      total_transactions: total,
      total_amount: amount,
      success_rate: successRate
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR' }
    })
  }
}
