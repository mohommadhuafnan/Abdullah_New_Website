import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-emerald-800 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-2xl focus:ring-4 focus:ring-amber-400 focus:outline-none transition-all"
    >
      Skip to main content (Press Enter)
    </a>
  );
};
