import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('Database schema initialized.');

    // Verify test merchant
    const testEmail = 'test@example.com';
    const checkRes = await pool.query('SELECT * FROM merchants WHERE email = $1', [testEmail]);
    if (checkRes.rows.length === 0) {
      console.log('Test merchant missing. Seeding explicitly...');
      await pool.query(`
            INSERT INTO merchants (id, name, email, api_key, api_secret)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440000',
                'Test Merchant',
                'test@example.com',
                'key_test_abc123',
                'secret_test_xyz789'
            )
        `);
      console.log('Test merchant seeded.');
    } else {
      console.log('Test merchant exists.');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export { pool, initializeDatabase };
