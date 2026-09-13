import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, ExternalLink, RotateCcw, Play, Sparkles } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { YoutubeIcon } from '../../components/common/SocialIcons';
import type { VideoItem } from '../../types';
import { initialVideos } from '../../data/initialData';
import { SEO } from '../../components/common/SEO';
import { VideoModal } from '../../components/common/VideoModal';

export const AdminVideosPage: React.FC = () => {
  const { videos, saveVideos, addVideo, updateVideo, deleteVideo, announce } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<{
    title: string;
    youtubeUrl: string;
    videoId: string;
  } | null>(null);

  const [formData, setFormData] = useState<Omit<VideoItem, 'id'>>({
    title: '',
    description: '',
    category: 'Broadcasting',
    youtubeUrl: '',
    videoId: '',
    thumbnail: 'https://img.youtube.com/vi/7fqZvAI2w2c/hqdefault.jpg',
    publishDate: new Date().toISOString().split('T')[0],
    featured: false,
    status: 'published',
  });

  const extractYoutubeId = (url: string) => {
    if (!url) return '';
    if (url.includes('v=')) {
      return url.split('v=')[1]?.split('&')[0] || '';
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    if (url.includes('/shorts/')) {
      return url.split('/shorts/')[1]?.split('?')[0] || '';
    }
    return '';
  };

  const handleUrlChange = (url: string) => {
    const vidId = extractYoutubeId(url);
    const newThumb = vidId
      ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`
      : formData.thumbnail;
    setFormData({
      ...formData,
      youtubeUrl: url,
      videoId: vidId || formData.videoId,
      thumbnail: newThumb,
    });
  };

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
      category: 'Broadcasting',
      youtubeUrl: '',
      videoId: '',
      thumbnail: 'https://img.youtube.com/vi/7fqZvAI2w2c/hqdefault.jpg',
      publishDate: new Date().toISOString().split('T')[0],
      featured: false,
      status: 'published',
    });
    announce('Opened add new video form');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let vidId = formData.videoId || extractYoutubeId(formData.youtubeUrl);
    const thumb = vidId
      ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`
      : formData.thumbnail;

    const payload = {
      ...formData,
      videoId: vidId || '7fqZvAI2w2c',
      thumbnail: thumb,
    };

    if (isCreating) {
      addVideo(payload);
      setIsCreating(false);
    } else if (editingId) {
      updateVideo(editingId, payload);
      setEditingId(null);
    }
  };

  const handleResetToOfficial = () => {
    if (
      confirm(
        'Reload the 6 official videos from YouTube channel @islamictvmedia_abdullah? This will replace current video entries.'
      )
    ) {
      saveVideos(initialVideos);
      announce('Official YouTube channel videos refreshed');
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <SEO title="Admin - Video & YouTube Management" />

      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Video & YouTube Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Connected to official channel{' '}
            <strong className="text-red-700 font-semibold">@islamictvmedia_abdullah</strong>. Manage your
            video showcase with instant auto-play and thumbnail previews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToOfficial}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            title="Reload official channel videos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sync Official Videos</span>
          </button>

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
      </div>

      {/* Channel Quick Info Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-900/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center shrink-0">
            <YoutubeIcon className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base">Islamic tv media</span>
              <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-[10px] font-bold text-red-300">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Channel Handle: <code className="text-amber-300">@islamictvmedia_abdullah</code> • 18.3K Subscribers
            </p>
          </div>
        </div>

        <a
          href="https://youtube.com/@islamictvmedia_abdullah?si=ZGYZWdd-UBXzrqBH"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow transition-all shrink-0"
        >
          <span>Open Channel to Copy URLs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Add / Edit Form */}
      {(isCreating || editingId) && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-md space-y-5"
        >
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
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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
                placeholder="e.g. Braille Reading & Inspiring Journey"
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
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=7fqZvAI2w2c or https://youtu.be/..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Video ID and thumbnail will be automatically detected when you paste a YouTube link.
            </p>
          </div>

          {/* Thumbnail preview */}
          {formData.thumbnail && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
              <img
                src={formData.thumbnail}
                alt="Video Thumbnail Preview"
                className="w-32 aspect-video object-cover rounded-xl shadow-sm bg-black"
              />
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Auto-Generated HD Thumbnail</span>
                </span>
                <p className="text-slate-500 text-[11px] break-all">{formData.thumbnail}</p>
              </div>
            </div>
          )}

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

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              Save Video
            </button>
          </div>
        </form>
      )}

      {/* Videos List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
          <span>Active Videos ({videos.length})</span>
          <span>Click "Test Play" to preview auto-play</span>
        </div>

        {videos.map((vid) => (
          <div
            key={vid.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-slate-200 shadow-sm">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPreviewVideo({
                      title: vid.title,
                      youtubeUrl: vid.youtubeUrl,
                      videoId: vid.videoId,
                    })
                  }
                  title="Test auto-play in modal"
                  className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white text-white" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif font-bold text-sm text-slate-900">{vid.title}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {vid.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {vid.videoId}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{vid.description}</p>
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
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() =>
                  setPreviewVideo({
                    title: vid.title,
                    youtubeUrl: vid.youtubeUrl,
                    videoId: vid.videoId,
                  })
                }
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-emerald-800" />
                <span>Test Play</span>
              </button>
              <button
                type="button"
                onClick={() => startEdit(vid)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
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

      {/* Auto-Play Preview Modal */}
      {previewVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setPreviewVideo(null)}
          title={previewVideo.title}
          youtubeUrl={previewVideo.youtubeUrl}
          videoId={previewVideo.videoId}
        />
      )}
    </div>
  );
};
