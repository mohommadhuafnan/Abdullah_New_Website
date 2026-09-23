import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Award,
  Video,
  Image,
  Milestone,
  Share2,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const AdminLayout: React.FC = () => {
  const { logout, enquiries, announce } = useCMS();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = enquiries.filter((e) => e.status === 'unread').length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/admin/profile', label: 'Profile & Brand Bio', icon: User },
    { to: '/admin/about', label: 'Storytelling & Mission', icon: BookOpen },
    { to: '/admin/qualifications', label: 'Qualifications & Skills', icon: ShieldCheck },
    { to: '/admin/journey', label: 'Timeline & Milestones', icon: Milestone },
    { to: '/admin/awards', label: 'Social TV Award 2025', icon: Award },
    { to: '/admin/courses', label: 'Online Quran Madarsa', icon: GraduationCap },
    { to: '/admin/videos', label: 'Videos & Broadcasts', icon: Video },
    { to: '/admin/gallery', label: 'Moments Gallery', icon: Image },
    { to: '/admin/social', label: 'Social Channels', icon: Share2 },
    { to: '/admin/enquiries', label: 'Inquiries Inbox', icon: Inbox, badge: unreadCount },
    { to: '/admin/settings', label: 'Settings & JSON Backup', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top App Bar */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400/40 bg-slate-900 shrink-0">
            <img
              src="/assets/logo_emblem.jpg"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-sm block">Abdullah CMS</span>
            <span className="text-[10px] text-emerald-400">Admin Control</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Public Website in new tab"
            className="p-2 text-slate-300 hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close admin navigation' : 'Open admin navigation'}
            className="p-2 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation - Fixed & Non-scrolling on Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen md:w-64 shrink-0 flex flex-col border-r border-slate-800 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-400/40 bg-slate-900 shrink-0 shadow-sm">
              <img
                src="/assets/logo_emblem.jpg"
                alt="Al Hafeel Abdullah Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-white text-sm block leading-tight">
                Al Hafeel Abdullah
              </span>
              <span className="text-[10px] font-semibold text-emerald-400">
                Accessible CMS Panel
              </span>
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links - Compact to fit standard desktop screens without scrolling */}
        <nav
          aria-label="Admin Navigation"
          className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 text-left"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  setMobileOpen(false);
                  announce(`Navigated to ${item.label}`);
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-white" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-1.5 shrink-0">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Preview Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 text-xs font-semibold transition-colors border border-red-900/30 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
