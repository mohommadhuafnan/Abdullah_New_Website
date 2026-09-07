import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  caption?: string;
  altText: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  caption,
  altText,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}) => {
  const { announce } = useCMS();

  useEffect(() => {
    if (isOpen) {
      announce(`Viewing image: ${title}. ${caption || ''}`);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
        if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, title, caption, onPrev, onNext, hasPrev, hasNext, onClose, announce]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-caption"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
    >
      <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close image preview"
          className="absolute -top-12 right-0 sm:right-0 p-2 text-white/80 hover:text-white bg-slate-800/80 rounded-full focus:ring-4 focus:ring-amber-400 focus:outline-none transition-all cursor-pointer"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Previous Button */}
        {hasPrev && onPrev && (
          <button
            onClick={onPrev}
            aria-label="Previous image"
            className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 p-3 text-white/90 hover:text-white bg-slate-900/80 rounded-full focus:ring-4 focus:ring-amber-400 focus:outline-none cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
        )}

        {/* Next Button */}
        {hasNext && onNext && (
          <button
            onClick={onNext}
            aria-label="Next image"
            className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 p-3 text-white/90 hover:text-white bg-slate-900/80 rounded-full focus:ring-4 focus:ring-amber-400 focus:outline-none cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>
        )}

        {/* Main Image */}
        <div className="overflow-hidden rounded-2xl bg-slate-950 border border-slate-700/50 shadow-2xl flex flex-col items-center">
          <img
            src={imageUrl}
            alt={altText || title}
            className="max-h-[70vh] w-auto max-w-full object-contain"
          />

          <div className="w-full bg-slate-900/90 text-white p-4 text-left border-t border-slate-800">
            <h3 id="lightbox-title" className="text-lg font-bold text-amber-300">
              {title}
            </h3>
            {caption && (
              <p id="lightbox-caption" className="text-sm text-slate-300 mt-1">
                {caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
