import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const user = (process.env.SMTP_USER || '').trim();
const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '');

console.log('Testing Gmail SMTP with user:', user);
console.log('Pass length:', pass.length);

async function testPort(port, secure) {
  console.log(`\nTesting port ${port} (secure: ${secure})...`);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  try {
    const verified = await transporter.verify();
    console.log(`✅ Port ${port} verified successfully! Result:`, verified);
    return true;
  } catch (err) {
    console.error(`❌ Port ${port} failed:`, err.message || err);
    return false;
  }
}

async function run() {
  const p465 = await testPort(465, true);
  const p587 = await testPort(587, false);
  console.log('\nSummary:');
  console.log('Port 465 (SSL):', p465 ? 'WORKING' : 'FAILED');
  console.log('Port 587 (STARTTLS):', p587 ? 'WORKING' : 'FAILED');
}

run();
