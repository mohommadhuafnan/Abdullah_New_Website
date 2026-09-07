import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import type { Qualification } from '../../types';
import { SEO } from '../../components/common/SEO';

export const AdminQualificationsPage: React.FC = () => {
  const {
    qualifications,
    addQualification,
    updateQualification,
    deleteQualification,
    announce
  } = useCMS();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Qualification, 'id'>>({
    title: '',
    description: '',
    category: 'Quran',
    icon: 'BookOpen',
    details: [],
    featured: true,
    displayOrder: 1,
    status: 'published',
  });
  const [detailsText, setDetailsText] = useState('');

  const startEdit = (q: Qualification) => {
    setEditingId(q.id);
    setIsCreating(false);
    setFormData({
      title: q.title,
      description: q.description,
      category: q.category,
      icon: q.icon,
      details: q.details || [],
      featured: q.featured,
      displayOrder: q.displayOrder,
      status: q.status,
    });
    setDetailsText((q.details || []).join('\n'));
    announce(`Editing qualification: ${q.title}`);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Quran',
      icon: 'BookOpen',
      details: [],
      featured: true,
      displayOrder: qualifications.length + 1,
      status: 'published',
    });
    setDetailsText('');
    announce('Adding new qualification form opened');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDetails = detailsText
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const payload = {
      ...formData,
      details: parsedDetails,
    };

    if (isCreating) {
      addQualification(payload);
      setIsCreating(false);
    } else if (editingId) {
      updateQualification(editingId, payload);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <SEO title="Admin - Qualifications" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Qualifications & Expertise
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage your verified competencies, Braille mastery in 4 languages, and broadcast expertise.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Qualification</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form Modal / Box */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {isCreating ? 'Add New Qualification' : 'Edit Qualification'}
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
              <label htmlFor="q-title" className="block text-xs font-bold text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="q-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="q-category" className="block text-xs font-bold text-slate-700">
                Category
              </label>
              <select
                id="q-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
              >
                <option value="Quran">Quran</option>
                <option value="Language">Language & Braille</option>
                <option value="Media">Media & Public Speaking</option>
                <option value="Broadcasting">Radio & Broadcasting</option>
                <option value="Assistive Tech">Assistive Tech</option>
                <option value="Creative">Creative Writing</option>
                <option value="Digital">Digital & Mobile</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="q-desc" className="block text-xs font-bold text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="q-desc"
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="q-details" className="block text-xs font-bold text-slate-700">
              Detailed Bullet Points (One per line)
            </label>
            <textarea
              id="q-details"
              rows={3}
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
              placeholder="Tamil Braille&#10;Sinhala Braille&#10;English Braille&#10;Arabic Braille"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-emerald-800 rounded"
              />
              <span>Featured on Homepage</span>
            </label>

            <div className="space-y-1.5">
              <label htmlFor="q-status" className="block text-xs font-bold text-slate-700">
                Publication Status
              </label>
              <select
                id="q-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
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
              Save Qualification
            </button>
          </div>
        </form>
      )}

      {/* Qualifications List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {qualifications.map((qual) => (
          <div key={qual.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-slate-900">{qual.title}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {qual.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    qual.status === 'published' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {qual.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{qual.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(qual)}
                aria-label={`Edit ${qual.title}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete qualification: ${qual.title}?`)) {
                    deleteQualification(qual.id);
                  }
                }}
                aria-label={`Delete ${qual.title}`}
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
