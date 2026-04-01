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

async function check() {
  try {
    await client.connect();
    const s = await client.query('SELECT count(*) FROM spare_parts');
    const t = await client.query('SELECT count(*) FROM technicians');
    console.log('Spare parts count:', s.rows[0].count);
    console.log('Technicians count:', t.rows[0].count);
    
    if (s.rows[0].count == 0) {
      console.log('Attempting manual insert for spare parts...');
      await client.query("INSERT INTO spare_parts (name, description, price, stock, category) VALUES ('Premium Dust Filters', 'Test description', 299, 10, 'filter')");
      console.log('Manual insert success');
    }
  } catch (err) {
    console.error('Check failed:', err.message);
  } finally {
    await client.end();
  }
}

check();
