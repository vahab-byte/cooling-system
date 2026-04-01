import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function runMigrations() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase Database.');

    const schemaSql = fs.readFileSync('./supabase/migrations/01_initial_schema.sql', 'utf8');
    const seedSql = fs.readFileSync('./supabase/migrations/02_seed_data.sql', 'utf8');

    console.log('Applying Initial Schema...');
    await client.query(schemaSql);
    console.log('Schema applied successfully.');

    console.log('Applying Seed Data...');
    await client.query(seedSql);
    console.log('Seed data applied successfully.');

  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

runMigrations();
