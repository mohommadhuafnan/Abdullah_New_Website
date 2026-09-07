import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Globe2,
  MessageCircle,
  Send
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const QuranClassesPage: React.FC = () => {
  const { courses, profile, submitEnquiry, announce } = useCMS();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    country: '',
    preferredLanguage: 'Tamil',
    courseInterest: 'Quran Recitation with Tajweed & Memorization',
    whatsapp: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const course = courses[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.email) {
      announce('Please fill in your name, WhatsApp number, and email.', true);
      return;
    }

    setIsSubmitting(true);
    const success = await submitEnquiry({
      type: 'quran_classes',
      name: formData.name,
      age: formData.age,
      country: formData.country,
      preferredLanguage: formData.preferredLanguage,
      courseInterest: formData.courseInterest,
      whatsapp: formData.whatsapp,
      email: formData.email,
      message: formData.message,
    });
    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
      setFormData({
        name: '',
        age: '',
        country: '',
        preferredLanguage: 'Tamil',
        courseInterest: 'Quran Recitation with Tajweed & Memorization',
        whatsapp: '',
        email: '',
        message: '',
      });
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="Online Quran Madarsa | Islamic TV Media"
        description="Join Islamic TV Media's Online Quran Madarsa for students aged 6–15 worldwide. Learn Tajweed, Quran memorization, Hadith, and character development with Hafiz Abdullah."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>Islamic TV Media Educational Initiative</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900">
            Online Quran Madarsa
          </h1>
          <p className="text-lg font-serif text-emerald-800 italic font-semibold">
            “Qur'an • Knowledge • Communication • Character”
          </p>
          <p className="text-base text-slate-600 font-sans">
            A dedicated online educational platform nurturing young hearts in accurate Quranic recitation, memorization, prophetic character, and articulate communication.
          </p>
        </div>

        {/* Hero Banner Grid */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden border border-emerald-800/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-bold uppercase">
                <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Global Admissions Open</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                Empowering the Next Generation with Sacred Quranic Knowledge
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Led personally by <strong>Al Hafeel A. A. M. Abdullah</strong> (Hafiz-ul-Qur'an), this program combines traditional Tajweed discipline with modern interactive digital learning tools.
              </p>

              {/* Key Quick Facts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700/60">
                  <span className="text-xs text-slate-400 block font-semibold">Target Age Group</span>
                  <span className="text-base font-bold text-white">Ages 6 – 15</span>
                  <span className="text-[11px] text-emerald-300 block">Boys & Girls</span>
                </div>

                <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700/60">
                  <span className="text-xs text-slate-400 block font-semibold">Learning Format</span>
                  <span className="text-base font-bold text-white">Online Video</span>
                  <span className="text-[11px] text-emerald-300 block">Join From Anywhere</span>
                </div>

                <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700/60">
                  <span className="text-xs text-slate-400 block font-semibold">Main Teacher</span>
                  <span className="text-base font-bold text-amber-300">Hafiz Abdullah</span>
                  <span className="text-[11px] text-emerald-300 block">Tajweed Certified</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-xl bg-emerald-950">
                <img
                  src="/assets/islamic_tv_media_banner.jpg"
                  alt="Islamic TV Media Online Quran Madarsa Open Quran Classroom"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Program Curriculum Areas */}
        {course && (
          <div className="space-y-8 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Curriculum & Focus
              </span>
              <h2 className="text-3xl font-serif font-bold text-slate-900">
                What Students Learn in the Madarsa
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.programAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    {area}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Interactive instruction, personalized recitation correction, and regular progress evaluation.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Admission Enquiry Form & WhatsApp Contact */}
        <div id="enquiry-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Left Column: Form Info & WhatsApp Direct */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Admissions
              </span>
              <h2 className="text-3xl font-serif font-bold text-slate-900">
                Enquire for Admission
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Parents from anywhere in the world can submit an enquiry for their children (ages 6–15). We will contact you with batch schedules and details.
              </p>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base">Direct WhatsApp Support</h3>
                  <span className="text-xs text-slate-600">Immediate response for admissions</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                You can also reach out directly via WhatsApp with your child's age and preferred learning times.
              </p>

              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}?text=Assalamu%20Alaikum,%20I%20am%20interested%20in%20enrolling%20my%20child%20in%20the%20Online%20Quran%20Madarsa`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md transition-all focus:ring-4 focus:ring-amber-400"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                <span>Chat on WhatsApp ({profile.whatsapp})</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accessible Registration Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-10 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    Enquiry Submitted Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for your interest in Islamic TV Media's Online Quran Madarsa. Hafiz Abdullah will review your details and reach out via WhatsApp or email.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-emerald-900 cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Student Registration Enquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Parent / Student Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="student-name" className="block text-xs font-bold text-slate-700">
                        Parent or Student Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="student-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Mohamed Farhan"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                      />
                    </div>

                    {/* Student Age */}
                    <div className="space-y-1.5">
                      <label htmlFor="student-age" className="block text-xs font-bold text-slate-700">
                        Student Age (6 – 15 years) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="student-age"
                        type="number"
                        min="5"
                        max="18"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="e.g. 10"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country */}
                    <div className="space-y-1.5">
                      <label htmlFor="student-country" className="block text-xs font-bold text-slate-700">
                        Country of Residence <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="student-country"
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. Sri Lanka, UK, UAE, Canada"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                      />
                    </div>

                    {/* Preferred Language */}
                    <div className="space-y-1.5">
                      <label htmlFor="student-lang" className="block text-xs font-bold text-slate-700">
                        Preferred Medium of Teaching
                      </label>
                      <select
                        id="student-lang"
                        value={formData.preferredLanguage}
                        onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                      >
                        <option value="Tamil">Tamil</option>
                        <option value="English">English</option>
                        <option value="Sinhala">Sinhala</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <label htmlFor="student-whatsapp" className="block text-xs font-bold text-slate-700">
                        WhatsApp Number (with country code) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="student-whatsapp"
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="e.g. +94 77 123 4567"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="student-email" className="block text-xs font-bold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="student-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="parent@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  {/* Course Interest */}
                  <div className="space-y-1.5">
                    <label htmlFor="course-interest" className="block text-xs font-bold text-slate-700">
                      Primary Course Interest
                    </label>
                    <select
                      id="course-interest"
                      value={formData.courseInterest}
                      onChange={(e) => setFormData({ ...formData, courseInterest: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                    >
                      <option value="Quran Recitation with Tajweed & Memorization">
                        Quran Recitation with Tajweed & Memorization
                      </option>
                      <option value="Quran Memorization (Hifz)">
                        Complete Quran Memorization (Hifz)
                      </option>
                      <option value="Hadith Memorization & Character Building">
                        Hadith Memorization & Character Building
                      </option>
                      <option value="Youth Communication & Islamic Content Creation">
                        Youth Communication & Islamic Content Creation
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="student-message" className="block text-xs font-bold text-slate-700">
                      Additional Notes or Questions (Optional)
                    </label>
                    <textarea
                      id="student-message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your child's current Quran level, preferred days/times, or questions..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 focus:ring-4 focus:ring-amber-400 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>{isSubmitting ? 'Submitting Enquiry...' : 'Send Admission Enquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
