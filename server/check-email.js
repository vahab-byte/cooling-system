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
    const userExists = await pool.query('SELECT * FROM profiles WHERE email = $1', ['sabdulwahab252@gmail.com']);
    console.log("Found users:", userExists.rows);
  } catch (err) {
    console.error("SELECT Error:", err.message);
  } finally {
    pool.end();
  }
}

run();
