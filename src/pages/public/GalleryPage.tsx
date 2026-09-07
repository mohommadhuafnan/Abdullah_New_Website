import React, { useState } from 'react';
import { Sparkles, Filter, ExternalLink } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';
import { LightboxModal } from '../../components/common/LightboxModal';

export const GalleryPage: React.FC = () => {
  const { gallery, announce } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const categories = ['All', 'Awards', 'Journalism', 'Broadcasting', 'Islamic Education', 'Personal Brand'];

  const filteredGallery = gallery
    .filter((g) => g.status === 'published')
    .filter((g) => selectedCategory === 'All' || g.category === selectedCategory)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const activeItem = selectedIndex !== null ? filteredGallery[selectedIndex] : null;

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="Moments & Memories Gallery"
        description="Visual archive of Al Hafeel Abdullah: award ceremonies, broadcast studio sessions, Islamic TV Media classrooms, and milestones."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>Visual Archive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900">
            Moments & Memories
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-sans">
            A photographic archive capturing dedicated service, community education, journalism milestones, and recognition.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" /> Filter by:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(null);
                announce(`Filtered gallery by ${cat}`);
              }}
              aria-pressed={selectedCategory === cat}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelectedIndex(idx);
              }}
              aria-label={`Enlarge photo: ${item.title}`}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                  <span>Enlarge Photo</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>

              <div className="p-5 space-y-1.5 text-left bg-white">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                  {item.category}
                </span>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox with Pagination */}
      {activeItem && (
        <LightboxModal
          isOpen={true}
          onClose={() => setSelectedIndex(null)}
          imageUrl={activeItem.imageUrl}
          title={activeItem.title}
          caption={activeItem.caption}
          altText={activeItem.altText}
          hasPrev={selectedIndex! > 0}
          hasNext={selectedIndex! < filteredGallery.length - 1}
          onPrev={() => setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
          onNext={() =>
            setSelectedIndex((prev) =>
              prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : prev
            )
          }
        />
      )}
    </main>
  );
};
