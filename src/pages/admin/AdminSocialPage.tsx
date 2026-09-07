import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const AdminSocialPage: React.FC = () => {
  const { socialLinks, saveSocialLinks } = useCMS();
  const [links, setLinks] = useState([...socialLinks]);
  const [saved, setSaved] = useState(false);

  const handleChange = (id: string, field: string, val: any) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSocialLinks(links);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <SEO title="Admin - Social Links" />

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Social Media & Communication Channels
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Configure official links for YouTube, Facebook, Instagram, TikTok, and WhatsApp.
        </p>
      </div>

      {saved && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
          <span>Social links updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  {link.platform} Platform
                </span>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.enabled}
                    onChange={(e) => handleChange(link.id, 'enabled', e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded"
                  />
                  <span>Show on Website</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor={`soc-name-${link.id}`} className="block text-[11px] font-bold text-slate-600">
                    Display Label
                  </label>
                  <input
                    id={`soc-name-${link.id}`}
                    type="text"
                    value={link.name}
                    onChange={(e) => handleChange(link.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor={`soc-handle-${link.id}`} className="block text-[11px] font-bold text-slate-600">
                    Handle / Display Text
                  </label>
                  <input
                    id={`soc-handle-${link.id}`}
                    type="text"
                    value={link.handle}
                    onChange={(e) => handleChange(link.id, 'handle', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor={`soc-url-${link.id}`} className="block text-[11px] font-bold text-slate-600">
                  Destination URL
                </label>
                <input
                  id={`soc-url-${link.id}`}
                  type="text"
                  value={link.url}
                  onChange={(e) => handleChange(link.id, 'url', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-400"
          >
            <Save className="w-4 h-4" />
            <span>Save Social Links</span>
          </button>
        </div>
      </form>
    </div>
  );
};
