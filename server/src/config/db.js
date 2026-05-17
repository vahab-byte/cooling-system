import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('⚠️  WARNING: DATABASE_URL is not set. Database queries will fail.');
}

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Increase resilience with connection limits and timeouts
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Only enable SSL for remote databases (not localhost)
const dbUrl = process.env.DATABASE_URL || '';
if (dbUrl.includes('supabase.co') || dbUrl.includes('render.com') || dbUrl.includes('neon.tech') || process.env.NODE_ENV === 'production') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

// Connection pool error handler — prevents unhandled crashes
pool.on('error', (err) => {
  console.error('🔴 Database pool error:', err.message);
  if (err.message.includes('ENOTFOUND')) {
    console.error('💡 TIP: Your database host is unreachable. If using Supabase free tier, your project may be paused.');
    console.error('   → Go to https://supabase.com/dashboard and unpause your project.');
  }
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => {
    console.error('🔴 Database connection failed:', err.message);
    if (err.message.includes('ENOTFOUND')) {
      console.error('💡 TIP: Database host not found. Your Supabase project may be paused or the URL is incorrect.');
    } else if (err.message.includes('password authentication failed')) {
      console.error('💡 TIP: Database password is incorrect. Check your DATABASE_URL.');
    } else if (err.message.includes('ETIMEDOUT')) {
      console.error('💡 TIP: Database connection timed out. Check your network or firewall settings.');
    }
  });

export const query = (text, params) => pool.query(text, params);

export default pool;
