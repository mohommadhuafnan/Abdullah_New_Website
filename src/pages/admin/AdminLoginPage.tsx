import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, RefreshCw, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const AdminLoginPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Timers: 5-minute expiry countdown & 60-second resend cooldown
  const [expiresIn, setExpiresIn] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { isAdmin, isAuthChecking, requestOtp, verifyOtp, resendOtp, announce } = useCMS();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthChecking && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, isAuthChecking, navigate]);

  // Expiration & Cooldown timers
  useEffect(() => {
    if (step !== 'otp') return;

    const timer = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // Auto-focus first OTP box upon transitioning to step 2
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  // STEP 1: Handle Email Submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      announce('Please enter a valid email address.', true);
      return;
    }

    setLoading(true);
    announce('Sending verification code...');

    try {
      const res = await requestOtp(cleanEmail);
      if (res.success && res.challengeId) {
        setChallengeId(res.challengeId);
        setMaskedEmail(res.maskedEmail || 'your authorized email');
        setExpiresIn(res.expiresIn || 300);
        setResendCooldown(60);
        setStep('otp');
        setOtp(['', '', '', '']);
        setSuccessMessage('A 4-digit verification code has been dispatched.');
      } else {
        setError(res.error || res.message || 'Unable to start administrator verification.');
      }
    } catch {
      setError('Unable to contact the authentication service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Handle OTP Input Changes
  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, ''); // only numbers

    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // Single digit input
    const newOtp = [...otp];
    newOtp[index] = cleaned[cleaned.length - 1]; // take last entered digit
    setOtp(newOtp);

    // Auto-advance to next input box
    if (index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Backspace and Arrow navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Paste event across all boxes
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pasted.length >= 4) {
      const digits = pasted.slice(0, 4).split('');
      setOtp(digits);
      otpInputsRef.current[3]?.focus();
    }
  };

  // STEP 2: Handle OTP Verification
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = otp.join('');
    if (fullCode.length !== 4) {
      setError('Please enter all 4 digits of your verification code.');
      announce('Please enter all 4 digits of your verification code.', true);
      return;
    }

    if (expiresIn <= 0) {
      setError('This verification code has expired. Please request a new code.');
      announce('Verification code expired.', true);
      return;
    }

    setLoading(true);
    announce('Verifying administrator code...');

    try {
      const res = await verifyOtp(challengeId, fullCode);
      if (res.success) {
        setSuccessMessage('Code verified! Entering admin dashboard...');
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 600);
      } else {
        setError(res.error || res.message || 'Incorrect verification code. Please try again.');
        // Clear OTP boxes on error for quick retry
        setOtp(['', '', '', '']);
        otpInputsRef.current[0]?.focus();
      }
    } catch {
      setError('Authentication failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend Request
  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setError(null);
    setResending(true);
    announce('Resending verification code...');

    try {
      const res = await resendOtp(challengeId);
      if (res.success) {
        setExpiresIn(300);
        setResendCooldown(60);
        setOtp(['', '', '', '']);
        setSuccessMessage('A fresh verification code has been sent to your email.');
        otpInputsRef.current[0]?.focus();
      } else {
        setError(res.error || res.message || 'Unable to resend code.');
      }
    } catch {
      setError('Network error during resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden"
    >
      <SEO
        title="Admin Sign In"
        description="Secure passwordless OTP administration access for Al Hafeel Abdullah."
      />

      {/* Subtle background ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative z-10">
        {/* Top Return Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Public Website</span>
        </Link>

        {/* Brand Header */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400/40 bg-slate-950 shadow-md">
            <img
              src="/assets/logo_emblem.jpg"
              alt="Al Hafeel Abdullah Brand Seal"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Admin Sign In
            </h1>
            <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-0.5">
              Secure administrator access
            </p>
          </div>
        </div>

        {/* Status Announcements & Alerts */}
        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-0.5">
              <strong className="block font-bold">Authentication Notice</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-medium flex items-start gap-2.5 animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: EMAIL REQUEST FORM */}
        {/* ========================================================================= */}
        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                ADMINISTRATOR EMAIL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email address"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-500"
                />
                <Mail
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                A verification code will be sent to the authorized administrator email.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-400"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-amber-300" aria-hidden="true" />
                  <span>Send Verification Code</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* ========================================================================= */
          /* STEP 2: 4-DIGIT OTP VERIFICATION FORM */
          /* ========================================================================= */
          <form onSubmit={handleVerifySubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Verify Your Email
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Change Email
                </button>
              </div>
              <p className="text-xs text-slate-400">
                We sent a 4-digit verification code to:
              </p>
              <div className="text-xs font-mono font-bold text-amber-300 pt-0.5 break-all">
                {maskedEmail}
              </div>
            </div>

            {/* 4 Separate Numeric Input Boxes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 text-center">
                Enter 4-Digit Verification Code
              </label>

              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    aria-label={`Digit ${idx + 1} of 4`}
                    className="w-13 h-14 sm:w-14 sm:h-16 text-center text-2xl font-mono font-black text-amber-300 bg-slate-950 border-2 border-slate-700 focus:border-amber-400 focus:ring-4 focus:ring-emerald-500/30 rounded-2xl outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Expiration Timer & Resend Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 font-medium">
                <span>Code expires in:</span>
                <span
                  className={`font-mono font-bold ${
                    expiresIn < 60 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                  }`}
                >
                  {formatTime(expiresIn)}
                </span>
              </div>

              <div>
                {resendCooldown > 0 ? (
                  <span className="text-slate-500 text-[11px]">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {resending ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Didn't receive code? Resend</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 4}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-400"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                  <span>Verify & Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Compliance Footer */}
        <div className="pt-4 border-t border-slate-800/80 text-center">
          <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            Protected Administrator Access • OTP Two-Factor Authentication
          </span>
        </div>
      </div>
    </main>
  );
};
