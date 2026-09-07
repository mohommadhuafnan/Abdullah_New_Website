import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import type { JourneyMilestone } from '../../types';
import { SEO } from '../../components/common/SEO';

export const AdminJourneyPage: React.FC = () => {
  const { journey, addJourneyMilestone, updateJourneyMilestone, deleteJourneyMilestone, announce } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<JourneyMilestone, 'id'>>({
    title: '',
    category: 'Quran',
    period: '',
    year: '',
    description: '',
    organization: '',
    location: '',
    featured: true,
    displayOrder: journey.length + 1,
    status: 'published',
  });

  const startEdit = (m: JourneyMilestone) => {
    setEditingId(m.id);
    setIsCreating(false);
    setFormData({ ...m });
    announce(`Editing milestone: ${m.title}`);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Quran',
      period: '',
      year: '',
      description: '',
      organization: '',
      location: '',
      featured: true,
      displayOrder: journey.length + 1,
      status: 'published',
    });
    announce('Opened new timeline milestone form');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      addJourneyMilestone(formData);
      setIsCreating(false);
    } else if (editingId) {
      updateJourneyMilestone(editingId, formData);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <SEO title="Admin - Journey" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Professional Journey Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage your career progression, education milestones, broadcasting service, and awards.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {isCreating ? 'Add Timeline Milestone' : 'Edit Milestone'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="j-title" className="block text-xs font-bold text-slate-700">
                Milestone Title <span className="text-red-500">*</span>
              </label>
              <input
                id="j-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="j-category" className="block text-xs font-bold text-slate-700">
                Category
              </label>
              <select
                id="j-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
              >
                <option value="Quran">Quran</option>
                <option value="Education">Education</option>
                <option value="Broadcasting">Broadcasting</option>
                <option value="Journalism">Journalism</option>
                <option value="Award">Award</option>
                <option value="Public Speaking">Public Speaking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="j-period" className="block text-xs font-bold text-slate-700">
                Period / Tagline (e.g. Foundational Milestone, 5-Year Dedicated Contribution)
              </label>
              <input
                id="j-period"
                type="text"
                value={formData.period || ''}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="j-year" className="block text-xs font-bold text-slate-700">
                Year (Optional)
              </label>
              <input
                id="j-year"
                type="text"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="j-desc" className="block text-xs font-bold text-slate-700">
              Milestone Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="j-desc"
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="j-org" className="block text-xs font-bold text-slate-700">
                Organization (Optional)
              </label>
              <input
                id="j-org"
                type="text"
                value={formData.organization || ''}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="j-loc" className="block text-xs font-bold text-slate-700">
                Location / Venue (Optional)
              </label>
              <input
                id="j-loc"
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {journey.map((item) => (
          <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-slate-900">{item.title}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
                  {item.category}
                </span>
                {item.period && (
                  <span className="text-xs text-slate-500 italic">({item.period})</span>
                )}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(item)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete milestone: ${item.title}?`)) {
                    deleteJourneyMilestone(item.id);
                  }
                }}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
