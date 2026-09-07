import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import type { VideoItem } from '../../types';
import { SEO } from '../../components/common/SEO';

export const AdminVideosPage: React.FC = () => {
  const { videos, addVideo, updateVideo, deleteVideo, announce } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<VideoItem, 'id'>>({
    title: '',
    description: '',
    category: 'Journalism',
    youtubeUrl: '',
    videoId: '',
    thumbnail: '/assets/broadcasting_studio.jpg',
    publishDate: new Date().toISOString().split('T')[0],
    featured: false,
    status: 'published',
  });

  const startEdit = (v: VideoItem) => {
    setEditingId(v.id);
    setIsCreating(false);
    setFormData({ ...v });
    announce(`Editing video: ${v.title}`);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Journalism',
      youtubeUrl: '',
      videoId: '',
      thumbnail: '/assets/broadcasting_studio.jpg',
      publishDate: new Date().toISOString().split('T')[0],
      featured: false,
      status: 'published',
    });
    announce('Opened add new video form');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let vidId = formData.videoId;
    if (!vidId && formData.youtubeUrl) {
      if (formData.youtubeUrl.includes('v=')) {
        vidId = formData.youtubeUrl.split('v=')[1]?.split('&')[0] || '';
      } else if (formData.youtubeUrl.includes('youtu.be/')) {
        vidId = formData.youtubeUrl.split('youtu.be/')[1]?.split('?')[0] || '';
      }
    }

    const payload = { ...formData, videoId: vidId || 'dQw4w9WgXcQ' };

    if (isCreating) {
      addVideo(payload);
      setIsCreating(false);
    } else if (editingId) {
      updateVideo(editingId, payload);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <SEO title="Admin - Videos" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Video & YouTube Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage your "Watch My Work" video showcase, journalism features, and Islamic TV Media broadcasts.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add YouTube Video</span>
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {isCreating ? 'Add YouTube Video' : 'Edit Video Entry'}
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
              <label htmlFor="vid-title" className="block text-xs font-bold text-slate-700">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                id="vid-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="vid-cat" className="block text-xs font-bold text-slate-700">
                Category
              </label>
              <select
                id="vid-cat"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
              >
                <option value="Journalism">Journalism</option>
                <option value="Broadcasting">Broadcasting</option>
                <option value="Islamic Education">Islamic Education</option>
                <option value="Public Speaking">Public Speaking</option>
                <option value="Interviews">Interviews</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="vid-url" className="block text-xs font-bold text-slate-700">
              YouTube Video URL <span className="text-red-500">*</span>
            </label>
            <input
              id="vid-url"
              type="url"
              required
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="vid-desc" className="block text-xs font-bold text-slate-700">
              Description
            </label>
            <textarea
              id="vid-desc"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="vid-thumb" className="block text-xs font-bold text-slate-700">
              Thumbnail URL / Path
            </label>
            <input
              id="vid-thumb"
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
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
              Save Video
            </button>
          </div>
        </form>
      )}

      {/* Videos List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {videos.map((vid) => (
          <div key={vid.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-slate-900">{vid.title}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {vid.category}
                </span>
              </div>
              <p className="text-xs text-slate-600">{vid.description}</p>
              <a
                href={vid.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>{vid.youtubeUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(vid)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete video: ${vid.title}?`)) {
                    deleteVideo(vid.id);
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
