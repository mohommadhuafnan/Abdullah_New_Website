import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  Mic,
  Eye,
  Video,
  Radio,
  Feather,
  Layers,
  Smartphone,
  Share2,
  ExternalLink,
  ChevronRight,
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  Users
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';
import { LightboxModal } from '../../components/common/LightboxModal';
import { VideoModal } from '../../components/common/VideoModal';
import { YoutubeIcon } from '../../components/common/SocialIcons';

export const HomePage: React.FC = () => {
  const { profile, about, qualifications, awards, courses, videos, gallery, socialLinks, announce } = useCMS();

  // Typewriter animation state for hero headline
  const phrases = [
    'Faith That Inspires.',
    'Knowledge That Empowers.',
    'Voices That Resonate.',
    'Wisdom That Enlightens.',
    'Truth That Overcomes.',
  ];
  const [typedText, setTypedText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    const typingSpeed = isDeleting ? 35 : 75;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        } else {
          // Pause at full word
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(currentPhrase.slice(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIdx]);

  // State for modals
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string;
    title: string;
    caption?: string;
    altText: string;
  } | null>(null);

  const [selectedVideo, setSelectedVideo] = useState<{
    title: string;
    youtubeUrl: string;
    videoId: string;
  } | null>(null);

  // Auto-play looping video state for "Watch My Work" section
  const publishedVideos = videos.filter((v) => v.status === 'published');
  const [activeLoopVideoIdx, setActiveLoopVideoIdx] = useState(0);
  const [isLoopMuted, setIsLoopMuted] = useState(true);

  const activeLoopVideo = publishedVideos[activeLoopVideoIdx] || publishedVideos[0];

  const primaryAward = awards.find((a) => a.id === 'award_social_tv_2025') || awards[0];
  const primaryCourse = courses[0];

  const getQualIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-emerald-700" aria-hidden="true" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-emerald-700" aria-hidden="true" />;
      case 'Video':
        return <Video className="w-6 h-6 text-emerald-700" aria-hidden="true" />;
      case 'Radio':
        return <Radio className="w-6 h-6 text-emerald-700" aria-hidden="true" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-emerald-700" aria-hidden="true" />;
      case 'Feather':
        return <Feather className="w-6 h-6 text-emerald-700" aria-hidden="true" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-emerald-700" aria-hidden="true" />;
      default:
        return <Sparkles className="w-6 h-6 text-emerald-700" aria-hidden="true" />;
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-white">
      <SEO
        title="Home"
        description="Official platform of Al Hafeel A. A. M. Abdullah — Journalist, Media Presenter, Islamic Educator, Hafiz-ul-Qur'an, and Public Speaker."
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (FULL SCREEN CINEMATIC EXECUTIVE BACKGROUND) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (FULL-SCREEN CINEMATIC MINIMAL LUXURY) */}
      {/* ========================================================================= */}
      <section
        aria-label="Introduction and Hero"
        className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center overflow-hidden bg-slate-950 text-white border-b border-slate-800/80"
      >
        {/* Full-Screen Background Image */}
        <img
          src={profile.heroImage || '/assets/hero_executive_bg.png'}
          alt="Al Hafeel A. A. M. Abdullah - Executive Studio"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-[65%_center] lg:object-[60%_center] xl:object-center select-none"
        />

        {/* Subtle Top & Bottom Gradient for Content Contrast */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

        {/* Minimal Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pt-36 lg:pb-16 w-full flex flex-col justify-between min-h-[90vh]">
          <div className="max-w-xl lg:max-w-2xl space-y-4 text-left">
            {/* Pill Tag with emerald dot */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>AL HAFEEL A. A. M. ABDULLAH</span>
            </motion.div>

            {/* Grand Editorial Headline with Dynamic Typewriter Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.08] tracking-tight drop-shadow-xl min-h-[2.15em] sm:min-h-[2.2em]"
            >
              Words That Inspire. <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                {typedText}
              </span>
              <span
                aria-hidden="true"
                className="inline-block w-[3px] sm:w-[4px] h-[0.82em] bg-amber-400 ml-1.5 align-baseline animate-pulse shadow-sm shadow-amber-400"
              />
            </motion.h1>

            {/* Clean 1-Line Role Descriptor */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base text-slate-200 font-semibold tracking-wide flex flex-wrap items-center gap-x-2.5 gap-y-1"
            >
              <span>Journalist</span>
              <span className="text-emerald-400 font-bold">•</span>
              <span>Media Presenter</span>
              <span className="text-emerald-400 font-bold">•</span>
              <span>Islamic Educator</span>
              <span className="text-emerald-400 font-bold">•</span>
              <span>Hafiz-ul-Qur'an</span>
            </motion.p>

            {/* Mission Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-xs sm:text-sm text-slate-300/90 max-w-lg leading-relaxed pt-1"
            >
              Spreading knowledge, strengthening faith and creating positive change through media and education.
            </motion.p>

            {/* Sleek Action Buttons (Matched to Mock) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-3.5"
            >
              <Link
                to="/journey"
                onClick={() => announce('Navigating to Professional Journey')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-full shadow-xl shadow-emerald-950/60 hover:shadow-emerald-500/30 transition-all flex items-center gap-2.5 text-xs sm:text-sm focus:ring-4 focus:ring-emerald-400"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Explore My Journey</span>
              </Link>

              <button
                onClick={() => {
                  const firstVid = videos[0];
                  if (firstVid) {
                    setSelectedVideo(firstVid);
                  }
                }}
                className="px-6 py-3 bg-slate-950/60 hover:bg-slate-900 text-white font-bold rounded-full border border-slate-700/80 backdrop-blur-md shadow-lg transition-all flex items-center gap-2.5 text-xs sm:text-sm focus:ring-4 focus:ring-emerald-500 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" aria-hidden="true" />
                </div>
                <span>Watch My Work</span>
              </button>
            </motion.div>
          </div>

          {/* Bottom Feature Dock (4 Cards matched to design mock) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-4 w-full max-w-xl lg:max-w-2xl"
          >
            <div className="p-2 sm:p-2.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Card 1: Media Presenter */}
              <Link
                to="/media"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-center flex flex-col items-center justify-center space-y-1.5 group cursor-pointer"
              >
                <Radio className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block leading-tight">Media Presenter</span>
                <span className="text-[10px] text-slate-400 block">On TV & Digital</span>
              </Link>

              {/* Card 2: Islamic Educator */}
              <Link
                to="/quran-classes"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-center flex flex-col items-center justify-center space-y-1.5 group cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block leading-tight">Islamic Educator</span>
                <span className="text-[10px] text-slate-400 block">Guiding Hearts</span>
              </Link>

              {/* Card 3: Journalist */}
              <Link
                to="/journey"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-center flex flex-col items-center justify-center space-y-1.5 group cursor-pointer"
              >
                <Users className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block leading-tight">Journalist</span>
                <span className="text-[10px] text-slate-400 block">Telling Real Stories</span>
              </Link>

              {/* Card 4: Hafiz-ul-Qur'an */}
              <Link
                to="/qualifications"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-center flex flex-col items-center justify-center space-y-1.5 group cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block leading-tight">Hafiz-ul-Qur'an</span>
                <span className="text-[10px] text-slate-400 block">Quran in Life</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Callout: "Knowledge Builds Better Tomorrows" Calligraphy */}
        <div className="hidden xl:block absolute right-8 bottom-32 pointer-events-none text-right">
          <p className="font-serif italic text-amber-200/80 text-sm font-semibold tracking-wide">
            Knowledge<br />
            <span className="text-white text-base">Builds</span><br />
            <span className="text-emerald-400 text-lg font-bold">Better</span><br />
            <span className="text-emerald-300 text-sm">Tomorrows</span>
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THREE PILLARS OF IDENTITY (MEDIA + EDUCATION + INSPIRATION) */}
      {/* ========================================================================= */}
      <section aria-label="Core Pillars" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Professional Foundations
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
              A Triad of Purpose & Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Bridging professional journalism, heart-centered Islamic education, and transformative public communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Media & Journalism */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl space-y-4 border-t-4 border-t-emerald-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Mic className="w-6 h-6 text-emerald-800" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">Media & Journalism</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated reporting, professional program hosting, news delivery, and digital content creation with highest journalistic ethics.
              </p>
              <Link
                to="/media"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                <span>Explore Media Work</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Islamic Education */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl space-y-4 border-t-4 border-t-emerald-600">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">Islamic Education & Hifz</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tajweed-certified recitation, Holy Qur’an memorization, Hadith studies, and ethical character development for young learners aged 6–15 globally.
              </p>
              <Link
                to="/quran-classes"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                <span>View Online Madarsa</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Inspiration & Assistive Tech */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl space-y-4 border-t-4 border-t-amber-600">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Eye className="w-6 h-6 text-amber-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">Inspiration & Accessibility</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Braille mastery in four languages, TalkBack digital empowerment, YouTube public coaching, and inspirational storytelling that breaks barriers.
              </p>
              <Link
                to="/qualifications"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950"
              >
                <span>View Qualifications</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT ABDULLAH (STORYTELLING & BELIEF) */}
      {/* ========================================================================= */}
      <section aria-label="About Abdullah" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <img
                  src="/assets/braille_assistive_tech.jpg"
                  alt="Braille reading book and assistive technology display"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Accompanying Quote Card */}
              <div className="mt-6 p-6 rounded-2xl bg-emerald-900 text-white shadow-lg space-y-2">
                <span className="text-amber-300 text-3xl font-serif leading-none">“</span>
                <p className="text-sm italic font-serif leading-relaxed text-emerald-100">
                  {about.whatIBelieve}
                </p>
                <span className="block text-xs font-bold tracking-wider uppercase text-amber-300 pt-1">
                  — Al Hafeel A. A. M. Abdullah
                </span>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                  Who I Am & Where It Began
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                  A Journey Powered by Faith, Voice, and Determination
                </h2>
              </div>

              <p className="text-base text-slate-700 leading-relaxed">
                {about.whoIAm}
              </p>

              <p className="text-base text-slate-600 leading-relaxed">
                {about.whereJourneyBegan}
              </p>

              {/* Key Competency Bullet Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Hafiz-ul-Qur'an</span>
                    <span className="text-xs text-slate-600">30 Juz Tajweed Memorization</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">4-Language Braille</span>
                    <span className="text-xs text-slate-600">Tamil, Sinhala, English, Arabic</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Radio & Media Presenter</span>
                    <span className="text-xs text-slate-600">Broadcasting & News Delivery</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">TalkBack Screen-Reader</span>
                    <span className="text-xs text-slate-600">Assistive Digital Accessibility</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-900 transition-colors text-sm"
                >
                  <span>Read Full Story & Mission</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. QUALIFICATIONS & EXPERTISE (8 VERIFIED DOMAINS) */}
      {/* ========================================================================= */}
      <section aria-label="Qualifications & Expertise" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Skills & Credentials
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                Qualifications & Mastery
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                Real, verifiable credentials spanning sacred Quranic knowledge, multilingual Braille, broadcast media, and assistive technology.
              </p>
            </div>
            <Link
              to="/qualifications"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 underline"
            >
              <span>View All 8 Qualifications in Detail</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualifications
              .filter((q) => q.status === 'published')
              .slice(0, 8)
              .map((qual) => (
                <div
                  key={qual.id}
                  className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      {getQualIcon(qual.icon)}
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                      {qual.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {qual.description}
                    </p>
                  </div>

                  {qual.details && qual.details.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-1">
                      {qual.details.slice(0, 2).map((detail, idx) => (
                        <span
                          key={idx}
                          className="block text-[11px] font-semibold text-emerald-800 truncate"
                        >
                          • {detail}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED AWARD SHOWCASE (SOCIAL TV AWARD–2025) */}
      {/* ========================================================================= */}
      {primaryAward && (
        <section aria-label="Awards and Honors" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-100/30 rounded-3xl p-8 sm:p-12 border-2 border-amber-300/80 shadow-xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Award Image & Plaque Preview */}
                <div className="lg:col-span-5 flex justify-center">
                  <div
                    onClick={() =>
                      setSelectedImage({
                        imageUrl: primaryAward.plaqueImage,
                        title: primaryAward.name,
                        caption: primaryAward.venue,
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
                          caption: primaryAward.venue,
                          altText: primaryAward.citationText,
                        });
                      }
                    }}
                    aria-label="Enlarge Social TV Award 2025 Plaque"
                    className="relative max-w-sm w-full rounded-2xl overflow-hidden border-2 border-amber-300 shadow-2xl bg-white group cursor-pointer"
                  >
                    <img
                      src={primaryAward.plaqueImage}
                      alt="Social TV Award 2025 Trophy Plaque presented to Abdullah Journalist"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                      <span>Click to View Plaque</span>
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* Award Details & Citation */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-700" aria-hidden="true" />
                    <span>Featured Major Recognition</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
                    {primaryAward.name}
                  </h2>

                  <div className="space-y-1">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 block">
                      Awarded To
                    </span>
                    <p className="text-lg font-bold text-slate-900 font-serif">
                      {primaryAward.recipient} • <span className="text-emerald-800">{primaryAward.designation}</span>
                    </p>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed font-sans bg-white/80 p-4 rounded-xl border border-amber-200">
                    "{primaryAward.citationText}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900 block">Organization:</span>
                      <span>{primaryAward.organization}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Presented On:</span>
                      <span>{primaryAward.date}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-bold text-slate-900 block">Venue:</span>
                      <span>{primaryAward.venue}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      to="/awards"
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 focus:ring-4 focus:ring-amber-400"
                    >
                      <span>View Full Awards Archive</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. ISLAMIC TV MEDIA • ONLINE QURAN MADARSA */}
      {/* ========================================================================= */}
      {primaryCourse && (
        <section aria-label="Islamic TV Media Education" className="py-20 bg-emerald-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                  <span>Educational Initiative</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
                    {primaryCourse.initiativeName}
                  </h2>
                  <p className="text-amber-300 font-serif text-lg italic">
                    {primaryCourse.subtitle}
                  </p>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {primaryCourse.description}
                </p>

                {/* Key Program Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {primaryCourse.programAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-900/60 border border-emerald-800 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>

                {/* Admission Info Box */}
                <div className="p-4 rounded-2xl bg-emerald-900/80 border border-emerald-700 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Target Students:</span>
                    <span className="font-bold text-white text-sm">{primaryCourse.targetAge} ({primaryCourse.studentType})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Instructor:</span>
                    <span className="font-bold text-amber-300 text-sm">{primaryCourse.teacher}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Format:</span>
                    <span className="font-bold text-white text-sm">Online (Worldwide)</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to="/quran-classes"
                    className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 focus:ring-4 focus:ring-amber-300"
                  >
                    <span>Enquire About Classes</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>

                  <a
                    href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl border border-emerald-600 text-sm flex items-center gap-2 transition-all focus:ring-4 focus:ring-amber-400"
                  >
                    <span>WhatsApp Admission Help</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Educational Visual Banner */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-800/60 shadow-2xl bg-emerald-950">
                  <img
                    src="/assets/islamic_tv_media_banner.jpg"
                    alt="Islamic TV Media Online Quran Madarsa Open Quran Classroom"
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4 bg-emerald-900 text-center border-t border-emerald-800">
                    <span className="text-xs font-semibold text-emerald-200">
                      Open to young students worldwide • Interactive live sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. WATCH MY WORK (YOUTUBE & MEDIA SHOWCASE) */}
      {/* ========================================================================= */}
      <section aria-label="Media and Video Showcase" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider">
                <YoutubeIcon className="w-3.5 h-3.5 text-red-600" />
                <span>Islamic TV Media • @islamictvmedia_abdullah</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                Watch My Work
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                Official YouTube episodes, Quran Tajweed education, and inspirational Tamil presentations. Over 18,300+ subscribers worldwide.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={
                  socialLinks.find((s) => s.platform === 'youtube')?.url ||
                  'https://youtube.com/@islamictvmedia_abdullah?si=ZGYZWdd-UBXzrqBH'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <span>YouTube Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link
                to="/media"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <span>Media Player</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Continuous Auto-Playing Looping Video Theater Player */}
          {activeLoopVideo && (
            <div className="mb-10 rounded-3xl bg-slate-950 text-white p-4 sm:p-6 lg:p-8 border border-slate-800 shadow-2xl space-y-5">
              {/* Theater Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                    <YoutubeIcon className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base sm:text-lg text-white">Now Auto-Playing In Loop</span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live Stream / Loop
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Plays automatically on visit with infinite seamless loop
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLoopMuted(!isLoopMuted)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white"
                    title={isLoopMuted ? 'Unmute video audio' : 'Mute video audio'}
                  >
                    {isLoopMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unmute Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mute Audio</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveLoopVideoIdx((prev) => (prev + 1) % publishedVideos.length);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-200"
                    title="Switch to next video"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Next Video</span>
                  </button>
                </div>
              </div>

              {/* Looping IFrame (autoplay=1&loop=1&playlist=ID&mute=...) */}
              <div className="relative pb-[56.25%] sm:pb-[48%] md:pb-[42%] h-0 rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800">
                <iframe
                  key={`${activeLoopVideo.videoId}-${isLoopMuted}`}
                  src={`https://www.youtube-nocookie.com/embed/${activeLoopVideo.videoId}?autoplay=1&mute=${isLoopMuted ? '1' : '0'}&loop=1&playlist=${activeLoopVideo.videoId}&controls=1&rel=0&playsinline=1&modestbranding=1`}
                  title={activeLoopVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              {/* Video Title & Quick Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-left">
                <div className="space-y-1 max-w-2xl">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    {activeLoopVideo.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                    {activeLoopVideo.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {activeLoopVideo.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedVideo(activeLoopVideo)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Open Fullscreen Theater</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Selection Grid / Playlist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishedVideos.slice(0, 4).map((video, idx) => {
              const isCurrentPlaying = activeLoopVideo?.id === video.id;
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveLoopVideoIdx(idx)}
                  className={`glass-card rounded-2xl overflow-hidden group flex flex-col justify-between border transition-all text-left cursor-pointer ${
                    isCurrentPlaying
                      ? 'border-emerald-500 ring-2 ring-emerald-400/50 shadow-xl'
                      : 'border-slate-200 hover:shadow-xl hover:border-slate-300'
                  }`}
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badge Overlay */}
                    <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/50 flex items-center justify-center transition-colors">
                      {isCurrentPlaying ? (
                        <div className="px-3 py-1.5 rounded-full bg-emerald-600/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span>Looping Now</span>
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-900/80 group-hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                          <Play className="w-4 h-4 fill-white ml-0.5" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded">
                      {video.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 text-left">
                    <h3 className={`font-serif font-bold text-sm line-clamp-2 ${isCurrentPlaying ? 'text-emerald-800' : 'text-slate-900'}`}>
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {video.description}
                    </p>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLoopVideoIdx(idx);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        isCurrentPlaying
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-800'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCurrentPlaying ? 'Now Auto-Playing' : 'Switch & Play Loop'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MOMENTS & MEMORIES GALLERY */}
      {/* ========================================================================= */}
      <section aria-label="Moments & Memories Gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Photographic Archive
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                Moments & Memories
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                Captured milestones from journalism, award ceremonies, and media broadcasting.
              </p>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 underline"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery
              .filter((g) => g.status === 'published')
              .slice(0, 6)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    setSelectedImage({
                      imageUrl: item.imageUrl,
                      title: item.title,
                      caption: item.caption,
                      altText: item.altText,
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedImage({
                        imageUrl: item.imageUrl,
                        title: item.title,
                        caption: item.caption,
                        altText: item.altText,
                      });
                    }
                  }}
                  aria-label={`Enlarge photo: ${item.title}`}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1">
                      <span>View High-Res Photo</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="p-4 space-y-1 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FUTURE VISION (ONE VOICE. A GLOBAL MISSION.) */}
      {/* ========================================================================= */}
      <section aria-label="Future Vision" className="py-20 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
            <span>Future Vision</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            “One Voice. A Global Mission.”
          </h2>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-serif italic max-w-3xl mx-auto">
            {about.vision}
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm focus:ring-4 focus:ring-amber-300"
            >
              Invite Abdullah to Speak
            </Link>
          </div>
        </div>
      </section>

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

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          youtubeUrl={selectedVideo.youtubeUrl}
          videoId={selectedVideo.videoId}
        />
      )}
    </main>
  );
};
