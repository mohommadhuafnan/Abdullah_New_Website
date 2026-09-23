import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import type { GalleryItem } from '../../types';
import { SEO } from '../../components/common/SEO';
import { ImageUploadInput } from '../../components/admin/ImageUploadInput';

export const AdminGalleryPage: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, announce } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    caption: '',
    category: 'Awards',
    imageUrl: '/assets/award_ceremony.jpg',
    altText: '',
    featured: true,
    displayOrder: gallery.length + 1,
    status: 'published',
  });

  const startEdit = (g: GalleryItem) => {
    setEditingId(g.id);
    setIsCreating(false);
    setFormData({ ...g });
    announce(`Editing gallery photo: ${g.title}`);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      title: '',
      caption: '',
      category: 'Awards',
      imageUrl: '/assets/award_ceremony.jpg',
      altText: '',
      featured: true,
      displayOrder: gallery.length + 1,
      status: 'published',
    });
    announce('Opened add new gallery photo form');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.altText) {
      announce('Accessibility requirement: Please provide descriptive alternative text for screen readers.', true);
      return;
    }

    if (isCreating) {
      addGalleryItem(formData);
      setIsCreating(false);
    } else if (editingId) {
      updateGalleryItem(editingId, formData);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <SEO title="Admin - Gallery" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Moments & Memories Gallery Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Upload and organize photographs. Meaningful alternative text is required for screen-reader accessibility.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gallery Photograph</span>
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {isCreating ? 'Add Photograph to Gallery' : 'Edit Photograph'}
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
              <label htmlFor="gal-title" className="block text-xs font-bold text-slate-700">
                Photo Title <span className="text-red-500">*</span>
              </label>
              <input
                id="gal-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Social TV Award Presentation"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="gal-cat" className="block text-xs font-bold text-slate-700">
                Category
              </label>
              <select
                id="gal-cat"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
              >
                <option value="Awards">Awards</option>
                <option value="Journalism">Journalism</option>
                <option value="Broadcasting">Broadcasting</option>
                <option value="Islamic Education">Islamic Education</option>
                <option value="Personal Brand">Personal Brand</option>
              </select>
            </div>
          </div>

          <ImageUploadInput
            id="gal-url"
            label="Gallery Photograph"
            required
            value={formData.imageUrl}
            onChange={(val) => setFormData({ ...formData, imageUrl: val })}
            helpText="Upload a high-resolution photo from your device or specify an image URL."
            previewHeight="h-48"
          />

          {/* Accessible Alt-Text Input */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <AlertCircle className="w-4 h-4 text-emerald-700" />
              <label htmlFor="gal-alt">Screen Reader Descriptive Alt Text <span className="text-red-600">*</span></label>
            </div>
            <p className="text-[11px] text-emerald-800">
              Describe what is visually happening in the photograph for visually impaired visitors and screen readers.
            </p>
            <input
              id="gal-alt"
              type="text"
              required
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
              placeholder="e.g. Abdullah receiving award trophy on stage in auditorium"
              className="w-full px-4 py-2 bg-white rounded-xl border border-emerald-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="gal-caption" className="block text-xs font-bold text-slate-700">
              Caption / Context Description
            </label>
            <textarea
              id="gal-caption"
              rows={2}
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
            />
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
              Save Photograph
            </button>
          </div>
        </form>
      )}

      {/* Grid of gallery items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="aspect-4/3 overflow-hidden bg-slate-100">
                <img src={item.imageUrl} alt={item.altText} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800">{item.category}</span>
                <h3 className="font-serif font-bold text-sm text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{item.caption}</p>
                <p className="text-[11px] text-slate-400 italic">Alt: {item.altText}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
              <button
                onClick={() => startEdit(item)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete gallery image: ${item.title}?`)) {
                    deleteGalleryItem(item.id);
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
