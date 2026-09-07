import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const AdminAboutPage: React.FC = () => {
  const { about, updateAbout } = useCMS();
  const [formData, setFormData] = useState({ ...about });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <SEO title="Admin - About Storytelling" />

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          About & Storytelling Content
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your personal narrative, background story, guiding beliefs, mission, and future vision.
        </p>
      </div>

      {saved && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
          <span>About section updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Who I Am */}
        <div className="space-y-1.5">
          <label htmlFor="abt-who" className="block text-xs font-bold text-slate-700">
            Who I Am <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abt-who"
            rows={3}
            required
            value={formData.whoIAm}
            onChange={(e) => setFormData({ ...formData, whoIAm: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        {/* Where Journey Began */}
        <div className="space-y-1.5">
          <label htmlFor="abt-began" className="block text-xs font-bold text-slate-700">
            Where My Journey Began <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abt-began"
            rows={3}
            required
            value={formData.whereJourneyBegan}
            onChange={(e) => setFormData({ ...formData, whereJourneyBegan: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        {/* What I Do */}
        <div className="space-y-1.5">
          <label htmlFor="abt-what" className="block text-xs font-bold text-slate-700">
            What I Do <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abt-what"
            rows={3}
            required
            value={formData.whatIDo}
            onChange={(e) => setFormData({ ...formData, whatIDo: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        {/* What I Believe */}
        <div className="space-y-1.5">
          <label htmlFor="abt-believe" className="block text-xs font-bold text-slate-700">
            What I Believe (Philosophy / Core Quote) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abt-believe"
            rows={3}
            required
            value={formData.whatIBelieve}
            onChange={(e) => setFormData({ ...formData, whatIBelieve: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        {/* Mission */}
        <div className="space-y-1.5">
          <label htmlFor="abt-mission" className="block text-xs font-bold text-slate-700">
            My Mission <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abt-mission"
            rows={3}
            required
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        {/* Vision */}
        <div className="space-y-1.5">
          <label htmlFor="abt-vision" className="block text-xs font-bold text-slate-700">
            Future Vision ("One Voice. A Global Mission.") <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abt-vision"
            rows={3}
            required
            value={formData.vision}
            onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-400"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>Save About Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
