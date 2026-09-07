import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  Video,
  Radio,
  Smartphone,
  Feather,
  Cpu,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const QualificationsPage: React.FC = () => {
  const { qualifications } = useCMS();

  const getQualIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
      case 'Layers':
        return <Layers className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
      case 'Video':
        return <Video className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
      case 'Radio':
        return <Radio className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
      case 'Smartphone':
        return <Smartphone className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
      case 'Feather':
        return <Feather className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
      case 'Cpu':
        return <Cpu className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
      case 'Share2':
        return <Share2 className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
      default:
        return <Sparkles className="w-7 h-7 text-emerald-800" aria-hidden="true" />;
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="Qualifications & Expertise"
        description="Explore Al Hafeel Abdullah's verified qualifications: Hafiz-ul-Qur'an, Braille in 4 languages, TalkBack accessibility, and broadcast media."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
            <span>Verified Knowledge & Skills</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900">
            Qualifications & Expertise
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-sans">
            A comprehensive overview of Abdullah's core competencies across sacred Islamic sciences, multilingual Braille, broadcast media, and digital accessibility.
          </p>
        </div>

        {/* 8 Qualifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {qualifications
            .filter((q) => q.status === 'published')
            .map((qual, index) => (
              <div
                key={qual.id}
                className="glass-card p-8 rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all space-y-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    {getQualIcon(qual.icon)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {qual.category}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-800 block mb-1">
                    0{index + 1}. Domain Expertise
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    {qual.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {qual.description}
                </p>

                {qual.details && qual.details.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Core Competencies
                    </span>
                    <ul className="space-y-1.5">
                      {qual.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Feature Callout Box: Braille & Screen Reader Superpowers */}
        <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 text-left">
          <div className="max-w-3xl space-y-3">
            <span className="inline-block px-3 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300">
              Accessibility Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Pioneering Inclusive Communication & Assistive Literacy
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Demonstrating that visual impairment is not a barrier to intellectual leadership, media presentation, and community education. Through Braille mastery in four languages and advanced screen-reader navigation, Abdullah leads by inspiring example.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/contact"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <span>Invite for Accessibility Talk</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
