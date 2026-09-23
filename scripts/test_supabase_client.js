import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('Testing Supabase REST Client connection...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) {
      console.error('Supabase query error:', error);
      process.exit(1);
    }
    console.log('✅ Supabase REST Client query succeeded! Data:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

test();
