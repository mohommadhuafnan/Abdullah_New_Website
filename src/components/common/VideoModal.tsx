import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  youtubeUrl: string;
  videoId: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  youtubeUrl,
  videoId,
}) => {
  const { announce } = useCMS();

  useEffect(() => {
    if (isOpen) {
      announce(`Playing video: ${title}`);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, title, onClose, announce]);

  if (!isOpen) return null;

  // Extract clean video ID if available
  let embedId = videoId;
  if (!embedId || embedId === 'dQw4w9WgXcQ') {
    if (youtubeUrl.includes('v=')) {
      embedId = youtubeUrl.split('v=')[1]?.split('&')[0] || '7fqZvAI2w2c';
    } else if (youtubeUrl.includes('youtu.be/')) {
      embedId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0] || '7fqZvAI2w2c';
    } else if (youtubeUrl.includes('/shorts/')) {
      embedId = youtubeUrl.split('/shorts/')[1]?.split('?')[0] || '7fqZvAI2w2c';
    } else {
      embedId = '7fqZvAI2w2c';
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-title"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
    >
      <div className="relative max-w-4xl w-full flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close video player"
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-slate-800/80 rounded-full focus:ring-4 focus:ring-amber-400 focus:outline-none transition-all cursor-pointer"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>

        <div className="w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          {/* Responsive Video Container */}
          <div className="relative pb-[56.25%] h-0 overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>

          <div className="p-4 bg-slate-900 flex items-center justify-between">
            <h3 id="video-title" className="text-base font-bold text-white truncate max-w-[80%]">
              {title}
            </h3>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold hover:bg-red-800 focus:ring-2 focus:ring-amber-400"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
