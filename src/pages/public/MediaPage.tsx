import React, { useState } from 'react';
import { Play, Radio, Mic, ExternalLink } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { YoutubeIcon } from '../../components/common/SocialIcons';
import { SEO } from '../../components/common/SEO';
import { VideoModal } from '../../components/common/VideoModal';

export const MediaPage: React.FC = () => {
  const { videos, socialLinks, announce } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    youtubeUrl: string;
    videoId: string;
  } | null>(null);

  const categories = ['All', 'Journalism', 'Broadcasting', 'Islamic Education', 'Public Speaking'];

  const filteredVideos = videos
    .filter((v) => v.status === 'published')
    .filter((v) => selectedCategory === 'All' || v.category === selectedCategory);

  const youtubeLink = socialLinks.find((s) => s.platform === 'youtube');

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="Media & Broadcasting"
        description="Watch Al Hafeel Abdullah's broadcasting presentations, journalism features, and Islamic TV Media video episodes."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
            <span>Broadcasting & Content</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900">
            Media & Broadcasting
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-sans">
            Presenting news bulletins, moderating community discussions, broadcasting educational programs, and inspiring through digital media.
          </p>
        </div>

        {/* Media Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-800" aria-hidden="true" />
            </div>
            <h2 className="font-serif font-bold text-lg text-slate-900">Journalism & Reporting</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ethical news reporting, community story investigations, and 5-year dedicated contribution to Social TV Media Network.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Radio className="w-5 h-5 text-emerald-800" aria-hidden="true" />
            </div>
            <h2 className="font-serif font-bold text-lg text-slate-900">Radio Program Announcing</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Studio presenting, voice modulation, live broadcast news bulletins, and guest interview hosting.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <YoutubeIcon className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="font-serif font-bold text-slate-900 text-lg">Islamic TV Media</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated YouTube content creation, Quranic educational programs, and youth motivational communication.
            </p>
          </div>
        </div>

        {/* Watch My Work Section Header & Category Filters */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Watch My Work
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Browse video episodes and broadcasts.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    announce(`Filtered videos by ${cat}`);
                  }}
                  aria-pressed={selectedCategory === cat}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => setActiveVideo(video)}
                    aria-label={`Play video: ${video.title}`}
                    className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/60 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" aria-hidden="true" />
                    </div>
                  </button>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded">
                    {video.category}
                  </span>
                </div>

                <div className="p-5 space-y-2 text-left">
                  <h3 className="font-serif font-bold text-base text-slate-900 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {video.description}
                  </p>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                    <span>Watch Now</span>
                  </button>

                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${video.title} directly on YouTube`}
                    className="p-2.5 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Channel Banner Connect Box */}
        {youtubeLink && (
          <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-red-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
                <YoutubeIcon className="w-4 h-4" />
                <span>Official Channel</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">
                Subscribe to Islamic TV Media on YouTube
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Stay updated with new Quran recitation lessons, motivational reminders, and broadcasting episodes.
              </p>
            </div>

            <a
              href={youtubeLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Visit YouTube Channel</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.title}
          youtubeUrl={activeVideo.youtubeUrl}
          videoId={activeVideo.videoId}
        />
      )}
    </main>
  );
};
