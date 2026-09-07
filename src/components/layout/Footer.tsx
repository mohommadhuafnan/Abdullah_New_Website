import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Sparkles,
  Phone,
  Lock,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import {
  YoutubeIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon
} from '../common/SocialIcons';

export const Footer: React.FC = () => {
  const { profile, settings, socialLinks, announce } = useCMS();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <YoutubeIcon className="w-5 h-5" />;
      case 'facebook':
        return <FacebookIcon className="w-5 h-5" />;
      case 'instagram':
        return <InstagramIcon className="w-5 h-5" />;
      case 'tiktok':
        return <TikTokIcon className="w-5 h-5" />;
      case 'whatsapp':
        return <WhatsAppIcon className="w-5 h-5" />;
      default:
        return <ArrowUpRight className="w-5 h-5" aria-hidden="true" />;
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Callout Card: Islamic TV Media Online Quran Madarsa */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-8 sm:p-10 border border-emerald-800/40 shadow-2xl mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/50 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>Global Online Admissions Open</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Islamic TV Media • Online Quran Madarsa
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Nurturing boys & girls aged 6–15 in Tajweed-certified recitation, Quran & Hadith memorization, public speaking, and ethical character.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/quran-classes"
              onClick={() => announce('Navigating to Quran Classes admission page')}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-700/30 transition-all text-sm flex items-center gap-2 focus:ring-4 focus:ring-amber-400"
            >
              <BookOpen className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>Enroll Student</span>
            </Link>
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 text-sm flex items-center gap-2 transition-all focus:ring-4 focus:ring-amber-400"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Inquiries</span>
            </a>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 text-left">
          {/* Col 1 & 2: Bio & Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-amber-300 font-bold font-serif text-lg border border-amber-400/40">
                A
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">{profile.fullName}</h3>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Journalist & Islamic Educator
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {profile.tagline}
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-3">Connect on Social Media</span>
              <div className="flex flex-wrap gap-2">
                {socialLinks
                  .filter((s) => s.enabled)
                  .map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit Abdullah's ${social.name}`}
                      className="p-2.5 bg-slate-800 hover:bg-emerald-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all hover:scale-105 focus:ring-2 focus:ring-amber-400"
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About Abdullah
                </Link>
              </li>
              <li>
                <Link to="/journey" className="hover:text-emerald-400 transition-colors">
                  Professional Journey
                </Link>
              </li>
              <li>
                <Link to="/qualifications" className="hover:text-emerald-400 transition-colors">
                  Qualifications & Skills
                </Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-emerald-400 transition-colors">
                  Media & Broadcasting
                </Link>
              </li>
              <li>
                <Link to="/awards" className="hover:text-emerald-400 transition-colors">
                  Social TV Award–2025
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Initiatives & Programs */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">Programs & Media</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/quran-classes" className="hover:text-emerald-400 transition-colors">
                  Online Quran Madarsa (Ages 6-15)
                </Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-emerald-400 transition-colors">
                  Watch My Work (YouTube)
                </Link>
              </li>
              <li>
                <Link to="/qualifications" className="hover:text-emerald-400 transition-colors">
                  Braille in 4 Languages
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-emerald-400 transition-colors">
                  Moments & Memories Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Invite for Keynote / Speaking
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">Direct Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <a href={`mailto:${profile.email}`} className="hover:text-emerald-400 truncate">
                  {profile.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} className="hover:text-emerald-400">
                  {profile.whatsapp}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg text-xs border border-slate-700 focus:ring-2 focus:ring-amber-400"
                >
                  <span>Send Direct Inquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{settings.footerText}</p>
          <div className="flex items-center gap-4">
            <a
              href={settings.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {settings.developerCredit}
            </a>
            <span className="text-slate-700">|</span>
            <Link
              to="/admin/login"
              aria-label="Admin sign-in portal"
              className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors"
            >
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
