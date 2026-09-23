import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mic, ArrowRight, HeartHandshake, Compass } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const AboutPage: React.FC = () => {
  const { profile, about } = useCMS();

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="About Abdullah"
        description="Learn about Al Hafeel A. A. M. Abdullah — Journalist, Media Presenter, Islamic Educator, Hafiz-ul-Qur'an, and Public Speaker."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>Biography & Purpose</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900">
            About Al Hafeel Abdullah
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-sans">
            Journalist, radio & TV presenter, Quran educator, and motivational speaker dedicated to uplifting communities through truth, knowledge, and accessible media.
          </p>
        </div>

        {/* Narrative Section: Who I Am */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-50">
              <img
                src={profile.profileImage || '/assets/Profile.jpeg'}
                alt="Portrait of Al Hafeel A. A. M. Abdullah"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Introduction
              </span>
              <h2 className="text-3xl font-serif font-bold text-slate-900">
                Who I Am
              </h2>
            </div>
            <p className="text-base text-slate-700 leading-relaxed">
              {about.whoIAm}
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              {profile.fullBio}
            </p>
          </div>
        </div>

        {/* Story Section: Where Journey Began & What I Do */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-3xl space-y-4 border-l-4 border-l-emerald-700 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Compass className="w-5 h-5 text-emerald-800" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Where My Journey Began</h3>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {about.whereJourneyBegan}
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 border-l-4 border-l-amber-600 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Mic className="w-5 h-5 text-amber-700" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">What I Do</h3>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {about.whatIDo}
            </p>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-emerald-900 text-white p-8 rounded-3xl space-y-4 shadow-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800 border border-emerald-600 rounded-full text-xs font-bold text-amber-300">
              <HeartHandshake className="w-4 h-4" aria-hidden="true" />
              <span>Core Mission</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">My Mission</h3>
            <p className="text-emerald-100 text-base leading-relaxed">
              {about.mission}
            </p>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 shadow-xl text-left border border-amber-400/40">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-amber-400/40 rounded-full text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Future Aspiration</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">My Vision</h3>
            <p className="text-slate-300 text-base leading-relaxed font-serif italic">
              “{about.vision}”
            </p>
          </div>
        </div>

        {/* Belief Statement Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Guiding Philosophy
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            What I Believe
          </h3>
          <p className="text-slate-700 text-base sm:text-lg italic font-serif leading-relaxed max-w-2xl mx-auto">
            “{about.whatIBelieve}”
          </p>
        </div>

        {/* CTA Strip */}
        <div className="text-center pt-4">
          <Link
            to="/journey"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-lg transition-all text-sm focus:ring-4 focus:ring-amber-400"
          >
            <span>Explore My Professional Journey</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
};
