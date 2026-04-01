import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const client = new Client({
  host: 'db.ltomdnhuqxpwvsccicya.supabase.co',
  port: 6543,
  user: 'postgres',
  password: 'Shaikh_vahab',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  try {
    await client.connect();
    console.log('Seeding additional data...');
    
    const sql = fs.readFileSync('../supabase/migrations/04_seed_more.sql', 'utf8');
    
    // Split by semicolon and filter empty lines
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
      
    for (const stmt of statements) {
      console.log('Executing:', stmt.substring(0, 50), '...');
      await client.query(stmt);
    }
    
    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await client.end();
  }
}

seed();
