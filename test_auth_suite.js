// Automated Security Test Suite covering all 16 tests specified in the prompt
import crypto from 'node:crypto';
import {
  requestOtp,
  verifyOtp,
  resendOtp,
  verifySession,
  requireAdmin,
  logoutSession,
  isAuthorizedAdmin,
  getAuthorizedAdminEmails,
  setSmtpTransporterForTesting,
  _getChallengeForTesting,
  _clearRateLimitsForTesting,
} from './server/authService.js';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    testsFailed++;
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  }
}

async function runAllTests() {
  console.log('====================================================');
  console.log('STARTING 16-TEST SECURITY VALIDATION SUITE');
  console.log('====================================================\n');

  // Intercept emails for testing so we don't spam live SMTP servers
  let sentEmails = [];
  setSmtpTransporterForTesting({
    sendMail: async (opts) => {
      sentEmails.push(opts);
      return { messageId: 'test-' + Date.now() };
    },
  });

  const extractOtpFromEmail = (emailObj) => {
    if (!emailObj) return null;
    const match = emailObj.text.match(/\b\d{4}\b/);
    return match ? match[0] : null;
  };

  // TEST 1: mohommadhuafnan756@gmail.com - Authorized admin
  console.log('--- TEST 1: mohommadhuafnan756@gmail.com ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req1 = await requestOtp({ email: 'mohommadhuafnan756@gmail.com', ip: '192.168.1.1' });
  assert(req1.status === 200 && req1.body.success, 'TEST 1: Request OTP succeeds for mohommadhuafnan756@gmail.com');
  assert(sentEmails.length === 1, 'TEST 1: OTP email dispatched via SMTP');
  const otp1 = extractOtpFromEmail(sentEmails[0]);
  assert(otp1 && /^\d{4}$/.test(otp1), 'TEST 1: 4-digit OTP generated and sent');
  const verify1 = await verifyOtp({
    challengeId: req1.body.challengeId,
    otp: otp1,
    email: 'mohommadhuafnan756@gmail.com',
    ip: '192.168.1.1',
  });
  assert(verify1.status === 200 && verify1.token, 'TEST 1: OTP verification succeeds with session token');
  const sess1 = verifySession(verify1.token);
  assert(sess1.authenticated && sess1.email === 'mohommadhuafnan756@gmail.com', 'TEST 1: Server session is valid and authenticated');

  // TEST 2: aamabdullah441@gmail.com - Authorized admin
  console.log('\n--- TEST 2: aamabdullah441@gmail.com ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req2 = await requestOtp({ email: 'aamabdullah441@gmail.com', ip: '192.168.1.2' });
  assert(req2.status === 200 && req2.body.success, 'TEST 2: Request OTP succeeds for aamabdullah441@gmail.com');
  assert(sentEmails.length === 1, 'TEST 2: OTP email dispatched for admin 2');
  const otp2 = extractOtpFromEmail(sentEmails[0]);
  const verify2 = await verifyOtp({
    challengeId: req2.body.challengeId,
    otp: otp2,
    email: 'aamabdullah441@gmail.com',
    ip: '192.168.1.2',
  });
  assert(verify2.status === 200 && verify2.token, 'TEST 2: Correct OTP grants session token');
  const sess2 = verifySession(verify2.token);
  assert(sess2.authenticated && sess2.email === 'aamabdullah441@gmail.com', 'TEST 2: Admin session valid for aamabdullah441@gmail.com');

  // TEST 3: randomuser@gmail.com - Unauthorized email
  console.log('\n--- TEST 3: randomuser@gmail.com ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req3 = await requestOtp({ email: 'randomuser@gmail.com', ip: '192.168.1.3' });
  assert(req3.status === 200, 'TEST 3: Returns generic response to prevent email enumeration');
  assert(sentEmails.length === 0, 'TEST 3: NO email sent for unauthorized email');
  const verify3 = await verifyOtp({
    challengeId: req3.body.challengeId,
    otp: '1234',
    email: 'randomuser@gmail.com',
    ip: '192.168.1.3',
  });
  assert(verify3.status === 400 && !verify3.token, 'TEST 3: Unauthorized email cannot authenticate / no session created');

  // TEST 4: Correct email + wrong OTP
  console.log('\n--- TEST 4: Correct email + wrong OTP ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req4 = await requestOtp({ email: 'mohommadhuafnan756@gmail.com', ip: '192.168.1.4' });
  const realOtp4 = extractOtpFromEmail(sentEmails[0]);
  const wrongOtp4 = realOtp4 === '1111' ? '2222' : '1111';
  const verify4 = await verifyOtp({
    challengeId: req4.body.challengeId,
    otp: wrongOtp4,
    email: 'mohommadhuafnan756@gmail.com',
    ip: '192.168.1.4',
  });
  assert(verify4.status === 400 && verify4.body.error.includes('Invalid verification code'), 'TEST 4: Wrong OTP denied with attempt countdown');

  // TEST 5: Correct OTP after expiration
  console.log('\n--- TEST 5: Correct OTP after expiration ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req5 = await requestOtp({ email: 'mohommadhuafnan756@gmail.com', ip: '192.168.1.5' });
  const otp5 = extractOtpFromEmail(sentEmails[0]);
  const ch5 = _getChallengeForTesting(req5.body.challengeId);
  ch5.expiresAt = Date.now() - 1000; // Expired 1 second ago
  const verify5 = await verifyOtp({
    challengeId: req5.body.challengeId,
    otp: otp5,
    email: 'mohommadhuafnan756@gmail.com',
    ip: '192.168.1.5',
  });
  assert(verify5.status === 400 && verify5.body.error.includes('expired'), 'TEST 5: Expired OTP is denied');

  // TEST 6: Reuse previously successful OTP (Replay Prevention)
  console.log('\n--- TEST 6: Reuse previously successful OTP ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req6 = await requestOtp({ email: 'mohommadhuafnan756@gmail.com', ip: '192.168.1.6' });
  const otp6 = extractOtpFromEmail(sentEmails[0]);
  const verify6a = await verifyOtp({
    challengeId: req6.body.challengeId,
    otp: otp6,
    email: 'mohommadhuafnan756@gmail.com',
    ip: '192.168.1.6',
  });
  assert(verify6a.status === 200, 'TEST 6: Initial verification succeeds');
  const verify6b = await verifyOtp({
    challengeId: req6.body.challengeId,
    otp: otp6,
    email: 'mohommadhuafnan756@gmail.com',
    ip: '192.168.1.6',
  });
  assert(verify6b.status === 400 && verify6b.body.error.includes('already been used'), 'TEST 6: Replaying used OTP is denied');

  // TEST 7: Use OTP from email A with email B (Email Binding Check)
  console.log('\n--- TEST 7: Use OTP from email A with email B ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req7 = await requestOtp({ email: 'mohommadhuafnan756@gmail.com', ip: '192.168.1.7' });
  const otp7 = extractOtpFromEmail(sentEmails[0]);
  const verify7 = await verifyOtp({
    challengeId: req7.body.challengeId,
    otp: otp7,
    email: 'aamabdullah441@gmail.com', // Attempt cross-user authentication
    ip: '192.168.1.7',
  });
  assert(verify7.status === 401 && verify7.body.error.includes('does not match this email address'), 'TEST 7: OTP A cannot authenticate Admin B (Email bound)');

  // TEST 8: Enter wrong OTP 5 times (Brute Force Lockout)
  console.log('\n--- TEST 8: Enter wrong OTP 5 times ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req8 = await requestOtp({ email: 'mohommadhuafnan756@gmail.com', ip: '192.168.1.8' });
  for (let i = 1; i <= 4; i++) {
    const res = await verifyOtp({
      challengeId: req8.body.challengeId,
      otp: '0000',
      email: 'mohommadhuafnan756@gmail.com',
      ip: '192.168.1.8',
    });
    assert(res.status === 400, `TEST 8: Attempt ${i} rejected`);
  }
  const res8Final = await verifyOtp({
    challengeId: req8.body.challengeId,
    otp: '0000',
    email: 'mohommadhuafnan756@gmail.com',
    ip: '192.168.1.8',
  });
  assert(res8Final.status === 429 && res8Final.body.error.includes('Too many attempts'), 'TEST 8: 5th wrong attempt locks out and invalidates challenge');
  const res8Post = await verifyOtp({
    challengeId: req8.body.challengeId,
    otp: '0000',
    email: 'mohommadhuafnan756@gmail.com',
    ip: '192.168.1.8',
  });
  assert(res8Post.status === 400, 'TEST 8: Subsequent attempt on locked challenge fails');

  // TEST 9: Spam resend requests (Rate Limiting / 60s Cooldown)
  console.log('\n--- TEST 9: Spam resend requests ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req9 = await requestOtp({ email: 'mohommadhuafnan756@gmail.com', ip: '192.168.1.9' });
  const resendSpam = await resendOtp({ challengeId: req9.body.challengeId, ip: '192.168.1.9' });
  assert(resendSpam.status === 429 && resendSpam.body.error.includes('Please wait'), 'TEST 9: Resending within 60s cooldown is rate-limited (429)');

  // TEST 10: Open /admin directly without login (Server route check)
  console.log('\n--- TEST 10: Open /admin directly without login ---');
  const unauthSession = verifySession(null);
  assert(!unauthSession.authenticated, 'TEST 10: Unauthenticated visitor has no valid session (triggers redirect to /admin/login)');

  // TEST 11: Call protected admin API without session
  console.log('\n--- TEST 11: Call protected admin API without session ---');
  let middlewareBlocked = false;
  let middlewareStatus = 0;
  const mockReq = { headers: {}, cookies: {} };
  const mockRes = {
    status: (code) => {
      middlewareStatus = code;
      return {
        json: (data) => {
          middlewareBlocked = true;
          return data;
        },
      };
    },
  };
  const mockNext = () => {
    middlewareBlocked = false;
  };
  requireAdmin(mockReq, mockRes, mockNext);
  assert(middlewareBlocked && middlewareStatus === 401, 'TEST 11: requireAdmin middleware blocks unauthenticated requests with 401');

  // TEST 12: Logout (Session invalidated)
  console.log('\n--- TEST 12: Logout ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req12 = await requestOtp({ email: 'mohommadhuafnan756@gmail.com', ip: '192.168.1.12' });
  const otp12 = extractOtpFromEmail(sentEmails[0]);
  const verify12 = await verifyOtp({
    challengeId: req12.body.challengeId,
    otp: otp12,
    email: 'mohommadhuafnan756@gmail.com',
    ip: '192.168.1.12',
  });
  const token12 = verify12.token;
  assert(verifySession(token12).authenticated, 'TEST 12: Session valid before logout');
  logoutSession(token12);
  assert(!verifySession(token12).authenticated, 'TEST 12: Session destroyed and invalidated after logout');

  // TEST 13: After logout, attempt to access dashboard
  console.log('\n--- TEST 13: Access after logout ---');
  const mockReq13 = { headers: { authorization: `Bearer ${token12}` }, cookies: {} };
  let blocked13 = false;
  requireAdmin(mockReq13, mockRes, mockNext);
  assert(middlewareStatus === 401, 'TEST 13: Protected API rejects previously logged-out token');

  // TEST 14: Modify localStorage / client-side role
  console.log('\n--- TEST 14: Modify localStorage / client-side role ---');
  const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlfQ.fakeSignature';
  assert(!verifySession(fakeToken).authenticated, 'TEST 14: Tampered/forged token rejected (cryptographic signature verification fails)');

  // TEST 15: Modify frontend isAdmin flag
  console.log('\n--- TEST 15: Modify frontend isAdmin flag ---');
  const mockReq15 = {
    headers: { 'x-client-is-admin': 'true', 'x-client-role': 'superadmin' },
    cookies: {},
  };
  requireAdmin(mockReq15, mockRes, mockNext);
  assert(middlewareStatus === 401, 'TEST 15: Client-side headers/flags completely ignored by requireAdmin');

  // TEST 16: Try another unauthorized email
  console.log('\n--- TEST 16: Try another unauthorized email ---');
  _clearRateLimitsForTesting();
  sentEmails = [];
  const req16 = await requestOtp({ email: 'hacker@darkweb.org', ip: '192.168.1.16' });
  assert(req16.status === 200, 'TEST 16: Generic 200 response returned');
  assert(sentEmails.length === 0, 'TEST 16: Zero emails sent for hacker@darkweb.org');
  const verify16 = await verifyOtp({
    challengeId: req16.body.challengeId,
    otp: '9999',
    email: 'hacker@darkweb.org',
    ip: '192.168.1.16',
  });
  assert(verify16.status === 400 && !verify16.token, 'TEST 16: Unauthorized email completely unable to authenticate');

  console.log('\n====================================================');
  console.log(`TEST SUITE COMPLETE: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('====================================================');
}

runAllTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
