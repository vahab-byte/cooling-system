import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  host: 'db.ltomdnhuqxpwvsccicya.supabase.co',
  port: 6543,
  user: 'postgres',
  password: 'Shaikh_vahab',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to database to fix profiles table.');
    
    // Explicitly add columns if they don't exist
    await client.query("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE");
    await client.query("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT");
    
    // Drop foreign key if it's causing issues (usually profiles_id_fkey)
    try {
        await client.query("ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey");
    } catch (e) {
        console.log('Note: FK drop skipped or already gone');
    }
    
    await client.query("ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid()");
    
    console.log('Profiles table updated successfully.');
  } catch (err) {
    console.error('Update failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
