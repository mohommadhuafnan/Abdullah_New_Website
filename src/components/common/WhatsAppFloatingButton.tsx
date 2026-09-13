import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { profile, announce } = useCMS();
  const [showTooltip, setShowTooltip] = useState(false);

  // Clean phone number for WhatsApp link
  const rawNumber = profile.whatsapp || '+94771234567';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent('Assalamu Alaikum Ustadh Abdullah, I am contacting you through your website.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip speech bubble */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-slate-900/95 backdrop-blur-xl text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>Chat with Abdullah on WhatsApp</span>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat with Al Hafeel Abdullah"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => announce('Opening WhatsApp chat')}
        className="relative group p-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl shadow-emerald-950/60 hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-400 cursor-pointer"
      >
        {/* Subtle Pulse Animation Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 fill-white relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.84.498 3.568 1.365 5.053L2 22l5.097-1.336A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-10.004C22.008 6.48 17.527 2 12.004 2zm5.82 14.195c-.244.686-1.42 1.258-1.956 1.338-.51.077-1.173.11-1.895-.123-.437-.14-1-.326-1.728-.642-3.064-1.332-5.074-4.437-5.228-4.644-.153-.207-1.246-1.658-1.246-3.162 0-1.503.788-2.243 1.068-2.548.28-.306.61-.383.813-.383.204 0 .407.002.585.01.19.009.444-.072.695.53.254.61.865 2.112.941 2.266.076.153.127.332.025.535-.102.204-.153.33-.305.509-.153.178-.321.397-.459.533-.153.152-.313.318-.135.624.178.305.792 1.306 1.698 2.112 1.166 1.037 2.148 1.358 2.454 1.511.305.153.483.127.661-.076.178-.204.763-.89 9.67-1.12.204-.229.407-.178.686-.076.28.102 1.776.838 2.081.99.305.153.509.229.585.356.076.128.076.737-.168 1.423z"/>
        </svg>

        {/* Online Green Indicator Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-slate-950 rounded-full" />
      </a>
    </div>
  );
};
