import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  'postgresql://postgres:ygAyYcLLAxDTdBaJ@db.iyzxleylinwfwkmlkqhk.supabase.co:5432/postgres';

console.log('Connecting to Supabase PostgreSQL database...');

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected successfully to Supabase PostgreSQL!');

    const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying supabase/schema.sql...');
    await client.query(sql);
    console.log('✅ Schema and RLS policies applied successfully to Supabase!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\nCreated tables in public schema:');
    res.rows.forEach((r) => console.log(` - ${r.table_name}`));
  } catch (err) {
    console.error('Error applying schema to Supabase:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
