import React, { useState } from 'react';
import { Award, Calendar, MapPin, Building, ExternalLink } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';
import { LightboxModal } from '../../components/common/LightboxModal';

export const AwardsPage: React.FC = () => {
  const { awards } = useCMS();
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string;
    title: string;
    caption?: string;
    altText: string;
  } | null>(null);

  const primaryAward = awards.find((a) => a.id === 'award_social_tv_2025') || awards[0];

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="Awards & Honors"
        description="Official recognition and honors for Abdullah: Social TV Award 2025 at South Eastern University of Sri Lanka for 5-year journalism dedication."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
            <span>Honors & Recognitions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900">
            Awards & Distinctions
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-sans">
            Celebrating milestones of dedicated service in journalism, community broadcasting, and media contributions.
          </p>
        </div>

        {/* Feature Presentation: Social TV Award 2025 */}
        {primaryAward && (
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-100/30 rounded-3xl p-8 sm:p-12 border-2 border-amber-300 shadow-xl space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Plaque Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() =>
                    setSelectedImage({
                      imageUrl: primaryAward.plaqueImage,
                      title: primaryAward.name,
                      caption: `${primaryAward.venue} — ${primaryAward.date}`,
                      altText: primaryAward.citationText,
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedImage({
                        imageUrl: primaryAward.plaqueImage,
                        title: primaryAward.name,
                        caption: `${primaryAward.venue} — ${primaryAward.date}`,
                        altText: primaryAward.citationText,
                      });
                    }
                  }}
                  aria-label="Enlarge Social TV Award Plaque"
                  className="relative max-w-sm w-full rounded-2xl overflow-hidden border-2 border-amber-300 shadow-2xl bg-white group cursor-pointer"
                >
                  <img
                    src={primaryAward.plaqueImage}
                    alt="Social TV Award 2025 Commemorative Trophy Plaque"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                    <span>Click to Enlarge Plaque</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Award Details & Citation Transcript */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-200 text-amber-950 rounded-full text-xs font-extrabold uppercase tracking-wider">
                  <span>Major Journalism Honor</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
                  {primaryAward.name}
                </h2>

                <div className="space-y-1">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 block">
                    Recipient & Role
                  </span>
                  <p className="text-xl font-bold text-slate-900 font-serif">
                    {primaryAward.recipient} • <span className="text-emerald-800">{primaryAward.designation}</span>
                  </p>
                </div>

                {/* Plaque Inscription Transcript */}
                <div className="p-6 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                    Official Plaque Citation
                  </span>
                  <p className="text-sm sm:text-base text-slate-700 italic font-serif leading-relaxed">
                    “{primaryAward.citationText}”
                  </p>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-2">
                  <div className="flex items-start gap-2 p-3 bg-white/70 rounded-xl border border-amber-200">
                    <Building className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Presenting Organization:</strong>
                      <span>{primaryAward.organization}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-white/70 rounded-xl border border-amber-200">
                    <Calendar className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Date of Presentation:</strong>
                      <span>{primaryAward.date}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-start gap-2 p-3 bg-white/70 rounded-xl border border-amber-200">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Auditorium & Venue:</strong>
                      <span>{primaryAward.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ceremony Event Photo Banner */}
            <div className="border-t border-amber-200 pt-8 space-y-4 text-left">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Award Ceremony Stage Presentation
              </h3>
              <div
                onClick={() =>
                  setSelectedImage({
                    imageUrl: primaryAward.ceremonyImage,
                    title: 'Social TV Award 2025 Presentation Stage',
                    caption: 'Faculty of Technology Auditorium, South Eastern University of Sri Lanka',
                    altText: 'Ceremony photograph at South Eastern University of Sri Lanka',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedImage({
                      imageUrl: primaryAward.ceremonyImage,
                      title: 'Social TV Award 2025 Presentation Stage',
                      caption: 'Faculty of Technology Auditorium, South Eastern University of Sri Lanka',
                      altText: 'Ceremony photograph at South Eastern University of Sri Lanka',
                    });
                  }
                }}
                aria-label="Enlarge Ceremony Stage Photo"
                className="relative rounded-2xl overflow-hidden shadow-lg border border-amber-200 bg-slate-900 group cursor-pointer aspect-21/9"
              >
                <img
                  src={primaryAward.ceremonyImage}
                  alt="Social TV Award Ceremony Auditorium Stage"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/50 transition-colors flex items-center justify-center text-white font-bold text-sm gap-2">
                  <span>View Ceremony Stage Photograph</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <LightboxModal
          isOpen={true}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.imageUrl}
          title={selectedImage.title}
          caption={selectedImage.caption}
          altText={selectedImage.altText}
        />
      )}
    </main>
  );
};
