import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Building, Award, BookOpen, Mic, Radio, Layers, Filter } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const JourneyPage: React.FC = () => {
  const { journey, announce } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Quran', 'Education', 'Broadcasting', 'Journalism', 'Award'];

  const filteredJourney = journey
    .filter((j) => j.status === 'published')
    .filter((j) => selectedCategory === 'All' || j.category === selectedCategory)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const getMilestoneIcon = (category: string) => {
    switch (category) {
      case 'Quran':
        return <BookOpen className="w-5 h-5 text-emerald-700" aria-hidden="true" />;
      case 'Education':
        return <Layers className="w-5 h-5 text-emerald-700" aria-hidden="true" />;
      case 'Broadcasting':
        return <Radio className="w-5 h-5 text-emerald-700" aria-hidden="true" />;
      case 'Journalism':
        return <Mic className="w-5 h-5 text-emerald-700" aria-hidden="true" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-600" aria-hidden="true" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-700" aria-hidden="true" />;
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="Professional Journey"
        description="Explore the chronological milestones, broadcasting journey, and major achievements of Al Hafeel Abdullah."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>Milestones & Growth</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900">
            Professional Journey
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-sans">
            A chronological timeline celebrating faith, discipline, broadcasting excellence, and impactful community journalism.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" /> Filter by:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                announce(`Filtered journey milestones by ${cat}`);
              }}
              aria-pressed={selectedCategory === cat}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Visual Timeline */}
        <div className="relative pl-6 sm:pl-12 space-y-10 sm:space-y-12 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-700 before:via-emerald-400 before:to-emerald-200">
          {filteredJourney.map((milestone) => (
            <div key={milestone.id} className="relative group text-left">
              {/* Timeline Dot Node - centered directly on the vertical stem */}
              <div className="absolute -left-[14px] sm:-left-[11px] top-4 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-emerald-700 shadow-md flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 group-hover:border-emerald-800 transition-all z-10">
                {getMilestoneIcon(milestone.category)}
              </div>

              {/* Timeline Card */}
              <div
                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
                  milestone.category === 'Award'
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50/60 to-white shadow-md'
                    : 'border-slate-200/90 bg-white/90 shadow-xs hover:border-emerald-300'
                }`}
              >
                {/* Milestone Period, Category & Year Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3.5">
                  {milestone.period && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold tracking-wide">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                      {milestone.period}
                    </span>
                  )}
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 px-2.5 py-1 bg-slate-100 rounded-full">
                    {milestone.category}
                  </span>
                  {milestone.year && (
                    <span className="sm:ml-auto inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-600" aria-hidden="true" />
                      {milestone.year}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-2.5 group-hover:text-emerald-900 transition-colors">
                  {milestone.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                  {milestone.description}
                </p>

                {/* Additional Metadata */}
                {(milestone.organization || milestone.location) && (
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs text-slate-600">
                    {milestone.organization && (
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Building className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                        <strong className="font-semibold text-slate-800">Organization:</strong> {milestone.organization}
                      </span>
                    )}
                    {milestone.location && (
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                        <strong className="font-semibold text-slate-800">Venue:</strong> {milestone.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
