import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const result = await pool.query(
      'INSERT INTO profiles (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      ['test@example.com', 'dummyhash', 'Test User']
    );
    console.log("Success:", result.rows);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    pool.end();
  }
}

run();
