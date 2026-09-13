import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  BookOpen,
  Phone,
  ChevronDown,
  GraduationCap,
  Award,
  Image
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { announce } = useCMS();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPortfolioActive =
    location.pathname === '/qualifications' ||
    location.pathname === '/awards' ||
    location.pathname === '/gallery';

  const portfolioItems = [
    {
      to: '/qualifications',
      label: 'Qualifications & Braille',
      desc: 'Islamic scholarship & 4-language Braille literacy',
      icon: GraduationCap,
      color: 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60',
    },
    {
      to: '/awards',
      label: 'Awards & Honors',
      desc: 'Social TV Award 2025 & university recognitions',
      icon: Award,
      color: 'text-amber-400 bg-amber-950/60 border border-amber-800/60',
    },
    {
      to: '/gallery',
      label: 'Photo Gallery',
      desc: 'Broadcasting studios, SEUSL stage & event press archive',
      icon: Image,
      color: 'text-blue-400 bg-blue-950/60 border border-blue-800/60',
    },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-2xl backdrop-saturate-150 py-3 border-b border-white/10 shadow-2xl shadow-black/60'
          : isHomePage
          ? 'bg-transparent py-4 sm:py-5 border-b border-transparent'
          : 'bg-slate-950/70 backdrop-blur-xl py-3.5 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <Link
            to="/"
            onClick={() => announce('Navigated to Home page')}
            aria-label="Al Hafeel A. A. M. Abdullah - Return to Homepage"
            className="flex items-center gap-3 group focus:outline-none focus:ring-4 focus:ring-amber-400 rounded-xl p-1 shrink-0"
          >
            {/* Monogram emblem */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-700/90 to-emerald-950/90 flex items-center justify-center text-amber-300 font-serif font-black text-xl shadow-lg border border-amber-400/40 backdrop-blur-md group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="text-left">
              <span className="font-serif text-lg sm:text-xl font-black text-white tracking-tight block leading-tight group-hover:text-emerald-300 transition-colors drop-shadow">
                Al Hafeel Abdullah
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 tracking-wider uppercase block drop-shadow-sm">
                Journalist & Islamic Educator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 font-sans"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-inner font-extrabold backdrop-blur-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-inner font-extrabold backdrop-blur-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/journey"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-inner font-extrabold backdrop-blur-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Journey
            </NavLink>

            <NavLink
              to="/media"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-inner font-extrabold backdrop-blur-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Media & TV
            </NavLink>

            {/* Portfolio & Credentials Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPortfolioActive
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-inner font-extrabold backdrop-blur-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Credentials</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-emerald-300' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown Menu Panel (iOS Frosted Glass) */}
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="bg-slate-950/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-2 space-y-1 text-white">
                    {portfolioItems.map((item) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            active
                              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold'
                              : 'hover:bg-white/10 text-slate-200 hover:text-white'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-bold block text-white leading-snug">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-slate-400 line-clamp-1">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Online Quran Madarsa Special Link */}
            <NavLink
              to="/quran-classes"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-inner font-extrabold backdrop-blur-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Online Madarsa</span>
            </NavLink>
          </nav>

          {/* Dedicated Action CTA: Apple-style Glass Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              onClick={() => announce('Navigating to Contact page')}
              className="px-4 sm:px-5 py-2.5 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/60 border border-emerald-400/30 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 focus:ring-4 focus:ring-amber-400"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>Contact & Inquiries</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => {
                const next = !mobileMenuOpen;
                setMobileMenuOpen(next);
                announce(next ? 'Mobile menu opened' : 'Mobile menu closed');
              }}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2.5 rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-amber-400 cursor-pointer backdrop-blur-md"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Frosted Glass) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="region"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/15 px-4 pt-3 pb-6 space-y-4 shadow-2xl text-white text-left animate-in slide-in-from-top-2"
        >
          {/* Main Pages Group */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-2 block mb-1">
              Main Menu
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/journey', label: 'Journey' },
                { to: '/media', label: 'Media & TV' },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-xs font-bold transition-colors block text-left ${
                      isActive
                        ? 'bg-emerald-600 text-white font-extrabold shadow-sm border border-emerald-400/30'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Credentials & Honors Group */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-2 block mb-1">
              Credentials & Archive
            </span>
            <div className="space-y-1.5">
              {portfolioItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors text-left ${
                        isActive
                          ? 'bg-emerald-600 text-white font-extrabold shadow-sm border border-emerald-400/30'
                          : 'bg-white/5 text-slate-200 hover:bg-white/10'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Educational Initiative & Contact Action Buttons */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/quran-classes"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-900/60 backdrop-blur-md"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Islamic TV Media • Online Quran Madarsa</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-500 border border-emerald-400/40"
            >
              <Phone className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>Contact & Inquiries</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
