import React, { useState, useRef } from 'react';
import { Play, Radio, Mic, ExternalLink, Sparkles, Volume2, Maximize2 } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { YoutubeIcon } from '../../components/common/SocialIcons';
import { SEO } from '../../components/common/SEO';
import { VideoModal } from '../../components/common/VideoModal';
import type { VideoItem } from '../../types';

export const MediaPage: React.FC = () => {
  const { videos, socialLinks, announce } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Theater inline autoplay state
  const publishedVideos = videos.filter((v) => v.status === 'published');
  const [theaterVideo, setTheaterVideo] = useState<VideoItem>(publishedVideos[0] || {
    id: 'default',
    title: 'கண் பார்வை இல்லாத நாங்கள் எப்படி வாசிக்கிறோம் தெரியுமா | Braille & Inspiring Journey',
    description: 'Al Hafeel Abdullah demonstrates how visually impaired students and individuals read, study, and memorize using Braille literacy and assistive tools.',
    category: 'Broadcasting',
    youtubeUrl: 'https://www.youtube.com/watch?v=7fqZvAI2w2c',
    videoId: '7fqZvAI2w2c',
    thumbnail: 'https://img.youtube.com/vi/7fqZvAI2w2c/hqdefault.jpg',
    publishDate: '2026-02-28',
    featured: true,
    status: 'published',
  });
  const [theaterAutoplay, setTheaterAutoplay] = useState(true);
  const theaterRef = useRef<HTMLDivElement>(null);

  // Modal player state
  const [activeModalVideo, setActiveModalVideo] = useState<{
    title: string;
    youtubeUrl: string;
    videoId: string;
  } | null>(null);

  const categories = ['All', 'Journalism', 'Broadcasting', 'Islamic Education', 'Public Speaking'];

  const filteredVideos = publishedVideos.filter(
    (v) => selectedCategory === 'All' || v.category === selectedCategory
  );

  const youtubeLink = socialLinks.find((s) => s.platform === 'youtube') || {
    url: 'https://youtube.com/@islamictvmedia_abdullah?si=ZGYZWdd-UBXzrqBH',
    handle: '@islamictvmedia_abdullah',
  };

  const handleSelectTheaterVideo = (video: VideoItem) => {
    setTheaterVideo(video);
    setTheaterAutoplay(true);
    announce(`Now playing in video player: ${video.title}`);
    if (theaterRef.current) {
      theaterRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="Media & Broadcasting | Al Hafeel Abdullah"
        description="Watch Al Hafeel Abdullah's Islamic TV Media broadcasts, Quran Tajweed lessons, journalism presentations, and motivational Tamil speeches."
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
            Official broadcasts, news presentations, and inspiring spiritual content from the{' '}
            <strong className="text-slate-900 font-semibold">Islamic TV Media</strong> YouTube channel.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* FEATURED THEATRE / INLINE AUTO-PLAYER */}
        {/* ========================================================================= */}
        <div
          ref={theaterRef}
          className="rounded-3xl bg-slate-950 text-white p-4 sm:p-8 border border-slate-800 shadow-2xl space-y-6"
        >
          {/* Top Bar with Channel Branding & Subscriber Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <YoutubeIcon className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-lg text-white">Islamic tv media</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-[10px] font-bold text-red-300 uppercase">
                    Official Channel
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  <span className="text-amber-400 font-semibold">@islamictvmedia_abdullah</span> • 18.3K Subscribers • 571+ Videos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full font-medium">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Auto-play Enabled</span>
              </span>

              <a
                href={youtubeLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all"
              >
                <span>Subscribe</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Main 16:9 Video Player Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Embedded Iframe Player (2 cols on desktop) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                <iframe
                  key={theaterVideo.videoId}
                  src={`https://www.youtube-nocookie.com/embed/${theaterVideo.videoId}?autoplay=${theaterAutoplay ? '1' : '0'}&enablejsapi=1&rel=0&playsinline=1`}
                  title={theaterVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-0"
                />
              </div>

              {/* Active Video Info */}
              <div className="text-left space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                    {theaterVideo.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActiveModalVideo({
                          title: theaterVideo.title,
                          youtubeUrl: theaterVideo.youtubeUrl,
                          videoId: theaterVideo.videoId,
                        })
                      }
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Fullscreen Modal</span>
                    </button>
                    <a
                      href={theaterVideo.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open in YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {theaterVideo.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {theaterVideo.description}
                </p>
              </div>
            </div>

            {/* Side Playlist: Select another video to auto-play */}
            <div className="lg:col-span-1 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Channel Playlist ({publishedVideos.length})
                </span>
                <span className="text-[11px] text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Click to play</span>
                </span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {publishedVideos.map((vid) => {
                  const isPlaying = vid.videoId === theaterVideo.videoId;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => handleSelectTheaterVideo(vid)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex gap-3 cursor-pointer group ${
                        isPlaying
                          ? 'bg-emerald-950/70 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                          : 'bg-slate-900/90 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black shrink-0">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div
                          className={`absolute inset-0 flex items-center justify-center ${
                            isPlaying ? 'bg-emerald-900/60' : 'bg-black/30 group-hover:bg-black/50'
                          }`}
                        >
                          <Play
                            className={`w-4 h-4 fill-white ${
                              isPlaying ? 'text-amber-300 scale-110' : 'text-white'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <p
                          className={`text-xs font-bold line-clamp-2 ${
                            isPlaying ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {vid.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{vid.category}</span>
                          {isPlaying && (
                            <span className="text-[10px] font-bold text-emerald-400">
                              • Playing Now
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
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
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <YoutubeIcon className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="font-serif font-bold text-slate-900 text-lg">Islamic TV Media</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Active YouTube channel with over 18,300+ subscribers and 570+ videos dedicated to Quran, Tajweed, and youth inspiration.
            </p>
          </div>
        </div>

        {/* Watch My Work Section Header & Category Filters */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                All Channel Broadcasts
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Filter by topic or select any video to watch immediately.
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
                    onClick={() => handleSelectTheaterVideo(video)}
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
                    onClick={() => handleSelectTheaterVideo(video)}
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                    <span>Play in Player</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveModalVideo({
                        title: video.title,
                        youtubeUrl: video.youtubeUrl,
                        videoId: video.videoId,
                      })
                    }
                    aria-label={`Open ${video.title} in fullscreen modal`}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
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
              Join 18,300+ subscribers to watch Holy Quran Tajweed masterclasses, Tamil inspirational speeches, and Islamic education videos by Al Hafeel Abdullah.
            </p>
          </div>

          <a
            href={youtubeLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-all shrink-0"
          >
            <span>Visit @islamictvmedia_abdullah</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {activeModalVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setActiveModalVideo(null)}
          title={activeModalVideo.title}
          youtubeUrl={activeModalVideo.youtubeUrl}
          videoId={activeModalVideo.videoId}
        />
      )}
    </main>
  );
};
