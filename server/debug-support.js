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
    console.log('Connected to DB.');
    const res = await client.query(
      "INSERT INTO support_tickets (user_id, issue_type, message, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [null, 'Billing', 'Test message for billing issue', 'open']
    );
    console.log('Insert Success:', res.rows[0]);
  } catch (err) {
    console.error('Insert Failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
