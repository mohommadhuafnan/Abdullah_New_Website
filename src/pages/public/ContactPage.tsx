import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  MapPin,
  CheckCircle2,
  Mic,
  BookOpen,
  Radio,
  Sparkles
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const ContactPage: React.FC = () => {
  const { profile, submitEnquiry, announce } = useCMS();
  const [formData, setFormData] = useState({
    type: 'general' as 'quran_classes' | 'speaking_invitation' | 'media_inquiry' | 'general',
    name: '',
    email: '',
    whatsapp: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.message) {
      announce('Please fill in all required fields.', true);
      return;
    }

    setIsSubmitting(true);
    const success = await submitEnquiry({
      type: formData.type,
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      message: formData.message,
    });
    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
      setFormData({
        type: 'general',
        name: '',
        email: '',
        whatsapp: '',
        message: '',
      });
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-white py-12 sm:py-16">
      <SEO
        title="Contact Abdullah"
        description="Get in touch with Al Hafeel Abdullah for speaking invitations, media/journalism inquiries, Quran classes, and collaboration."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
            <span>Connect & Collaborate</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900">
            Contact Abdullah
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-sans">
            Whether inviting Abdullah for a speaking engagement, media interview, or Quran Madarsa enrollment, we welcome your message.
          </p>
        </div>

        {/* Quick Contact Options Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-800" aria-hidden="true" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">Speaking & Keynotes</h3>
            <p className="text-xs text-slate-600">Youth conferences, motivational talks, and Islamic forums.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Radio className="w-5 h-5 text-emerald-800" aria-hidden="true" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">Media & Interviews</h3>
            <p className="text-xs text-slate-600">Radio, television, press commentary, and podcasts.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-800" aria-hidden="true" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">Quran Madarsa</h3>
            <p className="text-xs text-slate-600">Admissions for students aged 6–15 worldwide.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-700" aria-hidden="true" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">General Inquiries</h3>
            <p className="text-xs text-slate-600">Feedback, collaborations, and community discussions.</p>
          </div>
        </div>

        {/* Main Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-start">
          {/* Left Column: Direct Info & WhatsApp Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Direct Channels
              </span>
              <h2 className="text-3xl font-serif font-bold text-slate-900">
                Get In Touch Directly
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect directly through WhatsApp, email, or by completing the structured inquiry form.
              </p>
            </div>

            {/* Contact Details List */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-emerald-800" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</span>
                  <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-slate-900 hover:text-emerald-800">
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-emerald-800" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">WhatsApp & Phone</span>
                  <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} className="text-sm font-semibold text-slate-900 hover:text-emerald-800">
                    {profile.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-800" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Location</span>
                  <span className="text-sm font-semibold text-slate-900">{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Instant WhatsApp Chat</h3>
                  <span className="text-xs text-emerald-200">Fastest response for speaking & admissions</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all focus:ring-4 focus:ring-amber-400"
              >
                <MessageCircle className="w-4 h-4 text-white" aria-hidden="true" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accessible Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-10 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out to Al Hafeel Abdullah. Your inquiry has been safely received and will be reviewed promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-emerald-900 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Send a Message
                  </h3>

                  {/* Inquiry Type Radio Group */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Inquiry Category <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'general', label: 'General' },
                        { id: 'speaking_invitation', label: 'Speaking' },
                        { id: 'media_inquiry', label: 'Media / TV' },
                        { id: 'quran_classes', label: 'Madarsa' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: item.id as any })}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            formData.type === item.id
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Brother Ahmed / Media Producer"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-whatsapp" className="block text-xs font-bold text-slate-700">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-whatsapp"
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+94 77 123 4567"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700">
                      Message / Request Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your event, interview request, or inquiry..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 focus:ring-4 focus:ring-amber-400 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
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
