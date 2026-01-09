import dotenv from 'dotenv'
dotenv.config()

import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const initializeDatabase = async () => {
  try {
    console.log('📊 Initializing database...')
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Execute schema
    await pool.query(schema)
    console.log('✅ Database schema created')

    // Verify test merchant
    const testEmail = 'test@example.com'
    const checkMerchant = await pool.query(
      'SELECT * FROM merchants WHERE email = $1',
      [testEmail]
    )

    if (checkMerchant.rows.length === 0) {
      console.log('🌱 Seeding test merchant...')
      await pool.query(
        `INSERT INTO merchants (id, name, email, api_key, api_secret, is_active)
         VALUES ($1, $2, $3, $4, $5, true)`,
        [
          '550e8400-e29b-41d4-a716-446655440000',
          'Test Merchant',
          testEmail,
          'key_test_abc123',
          'secret_test_xyz789'
        ]
      )
      console.log('✅ Test merchant seeded')
    } else {
      console.log('✅ Test merchant already exists')
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  }
}

export { pool, initializeDatabase }
