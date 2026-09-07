import React from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  ShieldCheck,
  Video,
  Image,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const AdminDashboardPage: React.FC = () => {
  const {
    qualifications,
    videos,
    gallery,
    enquiries,
  } = useCMS();

  const unreadEnquiries = enquiries.filter((e) => e.status === 'unread');

  return (
    <div className="space-y-8 text-left">
      <SEO title="Admin Dashboard" />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Website Live & Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Welcome, Abdullah
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Accessible content management system. Edit your profile, qualifications, awards, videos, and student enquiries.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-sm transition-colors shrink-0"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unread Inquiries */}
        <div className={`p-5 rounded-2xl border ${unreadEnquiries.length > 0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'} shadow-sm space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Unread Inquiries</span>
            <Inbox className={`w-5 h-5 ${unreadEnquiries.length > 0 ? 'text-amber-700' : 'text-slate-400'}`} aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-slate-900 font-serif">
            {unreadEnquiries.length}
          </p>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Inbox</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Qualifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Qualifications</span>
            <ShieldCheck className="w-5 h-5 text-emerald-700" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-slate-900 font-serif">
            {qualifications.length}
          </p>
          <Link
            to="/admin/qualifications"
            className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            <span>View Qualifications</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Videos Published */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Videos & Broadcasts</span>
            <Video className="w-5 h-5 text-red-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-slate-900 font-serif">
            {videos.length}
          </p>
          <Link
            to="/admin/videos"
            className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Videos</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Gallery Photos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Gallery Photos</span>
            <Image className="w-5 h-5 text-emerald-700" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-slate-900 font-serif">
            {gallery.length}
          </p>
          <Link
            to="/admin/gallery"
            className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Gallery</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-slate-900">
          Quick Management Portals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/profile"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all space-y-1 block"
          >
            <h3 className="font-bold text-sm text-slate-900">Edit Profile & Bio</h3>
            <p className="text-xs text-slate-500">Update full name, headlines, tagline, and contact numbers.</p>
          </Link>

          <Link
            to="/admin/about"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all space-y-1 block"
          >
            <h3 className="font-bold text-sm text-slate-900">Edit Storytelling & Values</h3>
            <p className="text-xs text-slate-500">Update "Who I Am", "Where Journey Began", and vision.</p>
          </Link>

          <Link
            to="/admin/awards"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all space-y-1 block"
          >
            <h3 className="font-bold text-sm text-slate-900">Manage Awards & Citations</h3>
            <p className="text-xs text-slate-500">Manage Social TV Award 2025 and add new honors.</p>
          </Link>

          <Link
            to="/admin/courses"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all space-y-1 block"
          >
            <h3 className="font-bold text-sm text-slate-900">Online Quran Madarsa</h3>
            <p className="text-xs text-slate-500">Manage curriculum, target ages, and admission details.</p>
          </Link>

          <Link
            to="/admin/social"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all space-y-1 block"
          >
            <h3 className="font-bold text-sm text-slate-900">Social Media Channels</h3>
            <p className="text-xs text-slate-500">Update YouTube, WhatsApp, Facebook, and Instagram links.</p>
          </Link>

          <Link
            to="/admin/settings"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all space-y-1 block"
          >
            <h3 className="font-bold text-sm text-slate-900">Backup & System Settings</h3>
            <p className="text-xs text-slate-500">Export complete JSON backup, restore data, or change title.</p>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-serif font-bold text-slate-900">
            Recent Enquiries
          </h2>
          <Link to="/admin/enquiries" className="text-xs font-bold text-emerald-800 hover:underline">
            View All ({enquiries.length})
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No enquiries received yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {enquiries.slice(0, 3).map((enq) => (
              <div key={enq.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{enq.name}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        enq.status === 'unread'
                          ? 'bg-amber-100 text-amber-900'
                          : enq.status === 'contacted'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{enq.message}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  <a
                    href={`https://wa.me/${enq.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg hover:bg-emerald-100"
                  >
                    WhatsApp Reply
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
