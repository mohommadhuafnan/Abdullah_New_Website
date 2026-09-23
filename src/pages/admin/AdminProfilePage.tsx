import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';
import { ImageUploadInput } from '../../components/admin/ImageUploadInput';

export const AdminProfilePage: React.FC = () => {
  const { profile, updateProfile } = useCMS();
  const [formData, setFormData] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <SEO title="Admin - Profile & Bio" />

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Profile & Bio Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your personal brand name, professional titles, bio descriptions, profile photo, and direct contact details.
        </p>
      </div>

      {saved && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="prof-name" className="block text-xs font-bold text-slate-700">
              Full Legal / Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              id="prof-name"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          {/* Professional Title */}
          <div className="space-y-1.5">
            <label htmlFor="prof-title" className="block text-xs font-bold text-slate-700">
              Professional Designation Titles <span className="text-red-500">*</span>
            </label>
            <input
              id="prof-title"
              type="text"
              required
              value={formData.professionalTitle}
              onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-1.5">
          <label htmlFor="prof-headline" className="block text-xs font-bold text-slate-700">
            Hero Headline <span className="text-red-500">*</span>
          </label>
          <input
            id="prof-headline"
            type="text"
            required
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        {/* Tagline / Subtitle */}
        <div className="space-y-1.5">
          <label htmlFor="prof-tagline" className="block text-xs font-bold text-slate-700">
            Supporting Subtitle / Tagline <span className="text-red-500">*</span>
          </label>
          <textarea
            id="prof-tagline"
            rows={2}
            required
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
          />
        </div>

        {/* Short Bio */}
        <div className="space-y-1.5">
          <label htmlFor="prof-shortbio" className="block text-xs font-bold text-slate-700">
            Short Biography
          </label>
          <textarea
            id="prof-shortbio"
            rows={3}
            value={formData.shortBio}
            onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
          />
        </div>

        {/* Full Bio */}
        <div className="space-y-1.5">
          <label htmlFor="prof-fullbio" className="block text-xs font-bold text-slate-700">
            Full Biography
          </label>
          <textarea
            id="prof-fullbio"
            rows={4}
            value={formData.fullBio}
            onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="prof-email" className="block text-xs font-bold text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="prof-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label htmlFor="prof-whatsapp" className="block text-xs font-bold text-slate-700">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              id="prof-whatsapp"
              type="tel"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label htmlFor="prof-loc" className="block text-xs font-bold text-slate-700">
              Location / Country
            </label>
            <input
              id="prof-loc"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>
        </div>

        {/* Profile & Hero Imagery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <ImageUploadInput
            id="prof-img"
            label="Profile / Portrait Photo"
            value={formData.profileImage}
            onChange={(val) => setFormData({ ...formData, profileImage: val })}
            helpText="Displayed on About page, author badges, and brand identity."
            previewHeight="h-44"
          />

          <ImageUploadInput
            id="hero-img"
            label="Homepage Hero Background Banner"
            value={formData.heroImage}
            onChange={(val) => setFormData({ ...formData, heroImage: val })}
            helpText="Full-screen cinematic executive background behind the homepage headline."
            previewHeight="h-44"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-400"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
