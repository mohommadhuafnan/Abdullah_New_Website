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
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      to: '/awards',
      label: 'Awards & Honors',
      desc: 'Social TV Award 2025 & university recognitions',
      icon: Award,
      color: 'text-amber-700 bg-amber-50',
    },
    {
      to: '/gallery',
      label: 'Photo Gallery',
      desc: 'Broadcasting studios, SEUSL stage & event press archive',
      icon: Image,
      color: 'text-blue-700 bg-blue-50',
    },
  ];

  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80'
          : 'bg-white/95 backdrop-blur-md py-3.5 border-b border-slate-100'
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
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-amber-300 font-serif font-black text-xl shadow-md border border-amber-400/40 group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="text-left">
              <span className="font-serif text-lg sm:text-xl font-black text-slate-900 tracking-tight block leading-tight group-hover:text-emerald-800 transition-colors">
                Al Hafeel Abdullah
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 tracking-wider uppercase block">
                Journalist & Islamic Educator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Organized & Spacious */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 font-sans"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50'
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/journey"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50'
                }`
              }
            >
              Journey
            </NavLink>

            <NavLink
              to="/media"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50'
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
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPortfolioActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                <span>Credentials</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-emerald-800' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown Menu Panel */}
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1">
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
                              ? 'bg-emerald-50 text-emerald-950 font-bold'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-bold block text-slate-900 leading-snug">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">
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
                `px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50'
                }`
              }
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              <span>Online Madarsa</span>
            </NavLink>
          </nav>

          {/* Dedicated Action CTA: Clean & Focused Contact Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              onClick={() => announce('Navigating to Contact page')}
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-emerald-700/60 focus:ring-4 focus:ring-amber-400"
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
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 focus:outline-none focus:ring-4 focus:ring-amber-400 cursor-pointer"
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

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="region"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 text-left"
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
                        ? 'bg-emerald-800 text-white font-extrabold shadow-xs'
                        : 'bg-slate-50 text-slate-800 hover:bg-emerald-50 hover:text-emerald-900'
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
                          ? 'bg-emerald-800 text-white font-extrabold shadow-xs'
                          : 'bg-slate-50 text-slate-800 hover:bg-emerald-50 hover:text-emerald-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-amber-500" aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Educational Initiative & Contact Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/quran-classes"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-2xs hover:bg-emerald-100"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>Islamic TV Media • Online Quran Madarsa</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-900"
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
