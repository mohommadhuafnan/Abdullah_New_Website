import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import type { Award as AwardType } from '../../types';
import { SEO } from '../../components/common/SEO';

export const AdminAwardsPage: React.FC = () => {
  const { awards, addAward, updateAward, deleteAward, announce } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<AwardType, 'id'>>({
    name: '',
    recipient: 'Abdullah',
    designation: 'Journalist',
    organization: 'Social TV Media Network (Pvt) Ltd',
    date: 'December 06, 2025',
    year: '2025',
    venue: 'Faculty of Technology Auditorium, South Eastern University of Sri Lanka',
    description: '',
    citationText: '',
    plaqueImage: '/assets/award_plaque_2025.jpg',
    ceremonyImage: '/assets/award_ceremony.jpg',
    featured: true,
    status: 'published',
  });

  const startEdit = (a: AwardType) => {
    setEditingId(a.id);
    setIsCreating(false);
    setFormData({ ...a });
    announce(`Editing award: ${a.name}`);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: '',
      recipient: 'Abdullah',
      designation: 'Journalist',
      organization: '',
      date: '',
      year: new Date().getFullYear().toString(),
      venue: '',
      description: '',
      citationText: '',
      plaqueImage: '/assets/award_plaque_2025.jpg',
      ceremonyImage: '/assets/award_ceremony.jpg',
      featured: true,
      status: 'published',
    });
    announce('Opened add new award form');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      addAward(formData);
      setIsCreating(false);
    } else if (editingId) {
      updateAward(editingId, formData);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <SEO title="Admin - Awards" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Awards & Honors Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage your verified award records including the Social TV Award 2025 presentation.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Award Record</span>
          </button>
        )}
      </div>

      {/* Form modal/box */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {isCreating ? 'Add Award Record' : 'Edit Award Record'}
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
              <label htmlFor="aw-name" className="block text-xs font-bold text-slate-700">
                Award Title / Name <span className="text-red-500">*</span>
              </label>
              <input
                id="aw-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="aw-org" className="block text-xs font-bold text-slate-700">
                Presenting Organization <span className="text-red-500">*</span>
              </label>
              <input
                id="aw-org"
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="aw-rec" className="block text-xs font-bold text-slate-700">
                Recipient Name
              </label>
              <input
                id="aw-rec"
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="aw-desig" className="block text-xs font-bold text-slate-700">
                Designation / Role
              </label>
              <input
                id="aw-desig"
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="aw-date" className="block text-xs font-bold text-slate-700">
                Date Presented
              </label>
              <input
                id="aw-date"
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="aw-venue" className="block text-xs font-bold text-slate-700">
              Venue & Auditorium Location <span className="text-red-500">*</span>
            </label>
            <input
              id="aw-venue"
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="aw-citation" className="block text-xs font-bold text-slate-700">
              Official Plaque Inscription / Citation Transcript <span className="text-red-500">*</span>
            </label>
            <textarea
              id="aw-citation"
              rows={3}
              required
              value={formData.citationText}
              onChange={(e) => setFormData({ ...formData, citationText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none font-serif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="aw-plaque-img" className="block text-xs font-bold text-slate-700">
                Plaque Image Path
              </label>
              <input
                id="aw-plaque-img"
                type="text"
                value={formData.plaqueImage}
                onChange={(e) => setFormData({ ...formData, plaqueImage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="aw-cer-img" className="block text-xs font-bold text-slate-700">
                Ceremony Stage Image Path
              </label>
              <input
                id="aw-cer-img"
                type="text"
                value={formData.ceremonyImage}
                onChange={(e) => setFormData({ ...formData, ceremonyImage: e.target.value })}
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
              Save Award
            </button>
          </div>
        </form>
      )}

      {/* Awards List */}
      <div className="space-y-4">
        {awards.map((award) => (
          <div key={award.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-slate-900">{award.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                  {award.date}
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-800">{award.organization} • {award.venue}</p>
              <p className="text-xs text-slate-600 line-clamp-1 italic">“{award.citationText}”</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(award)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete award: ${award.name}?`)) {
                    deleteAward(award.id);
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
