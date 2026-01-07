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
    console.log('Database schema initialized and seed data inserted (if needed).');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't exit process here, let retry mechanism handled by Docker or orchestrator deal with it, 
    // or just let it fail. Ideally, we want to retry but for now logging is enough.
  }
};

export { pool, initializeDatabase };
