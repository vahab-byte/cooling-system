import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  host: 'db.ltomdnhuqxpwvsccicya.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'Shaikh_vahab',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected.');
    
    // Enable extensions
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Fix default
    await client.query('ALTER TABLE support_tickets ALTER COLUMN id SET DEFAULT gen_random_uuid()');
    console.log('Fixed support_tickets id default.');
  } catch (err) {
    console.error(err.message);
  } finally {
    await client.end();
  }
}

run();
