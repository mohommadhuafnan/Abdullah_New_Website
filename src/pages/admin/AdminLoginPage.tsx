import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isAdmin, announce } = useCMS();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const ok = login(password);
    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password. Default demo passcode is: abdullah2026');
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <SEO
        title="Admin Sign In"
        description="Sign in to the content management dashboard for Al Hafeel Abdullah's website."
      />

      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-left">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Public Website</span>
        </Link>

        {/* Brand Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-600 flex items-center justify-center text-amber-300 font-bold font-serif text-xl">
            A
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Admin Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Screen-reader accessible administration dashboard for Al Hafeel Abdullah.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium space-y-1"
          >
            <strong className="block font-bold">Authentication Notice:</strong>
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-passcode" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Admin Passcode <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="admin-passcode"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full pl-4 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const next = !showPassword;
                  setShowPassword(next);
                  announce(next ? 'Password visible' : 'Password hidden');
                }}
                aria-label={showPassword ? 'Hide password characters' : 'Show password characters'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded focus:ring-2 focus:ring-emerald-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Default passcode: <code className="text-amber-400 bg-slate-800 px-1 py-0.5 rounded">abdullah2026</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-400"
          >
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Sign In to Admin Dashboard</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-900 text-center">
          <span className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            Protected Admin Session • WCAG 2.2 AA Compliant
          </span>
        </div>
      </div>
    </main>
  );
};
