import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  Eye,
  Type,
  HelpCircle,
  X,
  Sparkles,
  Accessibility,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigate = useNavigate();

  const {
    highContrast,
    toggleHighContrast,
    fontSizeScale,
    setFontSizeScale,
    dyslexiaFont,
    toggleDyslexiaFont,
    isReadingPage,
    togglePageReader,
    announce
  } = useCMS();

  // Keyboard shortcut listener (Alt + Key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case '1':
            e.preventDefault();
            navigate('/');
            announce('Navigated to Home page');
            break;
          case '2':
            e.preventDefault();
            navigate('/about');
            announce('Navigated to About page');
            break;
          case '3':
            e.preventDefault();
            navigate('/qualifications');
            announce('Navigated to Qualifications page');
            break;
          case '4':
            e.preventDefault();
            navigate('/quran-classes');
            announce('Navigated to Quran Classes page');
            break;
          case '5':
            e.preventDefault();
            navigate('/awards');
            announce('Navigated to Awards page');
            break;
          case '6':
            e.preventDefault();
            navigate('/contact');
            announce('Navigated to Contact page');
            break;
          case 'a':
            e.preventDefault();
            navigate('/admin');
            announce('Navigated to Admin Portal');
            break;
          case 'h':
            e.preventDefault();
            toggleHighContrast();
            break;
          case 'r':
            e.preventDefault();
            togglePageReader();
            break;
          case '?':
            e.preventDefault();
            setShowShortcuts((prev) => !prev);
            announce('Opened keyboard shortcuts helper');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, announce, toggleHighContrast, togglePageReader]);

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const next = !isOpen;
            setIsOpen(next);
            announce(next ? 'Accessibility menu opened' : 'Accessibility menu closed');
          }}
          aria-expanded={isOpen}
          aria-label="Accessibility options and screen reader tools"
          aria-controls="accessibility-panel"
          className="flex items-center gap-2 px-4 py-3 bg-emerald-800 text-white rounded-full shadow-2xl hover:bg-emerald-900 border-2 border-emerald-600 focus:ring-4 focus:ring-amber-400 focus:outline-none transition-all cursor-pointer font-medium text-sm"
        >
          <Accessibility className="w-5 h-5 text-amber-300" aria-hidden="true" />
          <span className="hidden sm:inline">Accessibility Tools</span>
        </button>
      </div>

      {/* Slide-out Accessibility Drawer */}
      {isOpen && (
        <div
          id="accessibility-panel"
          role="region"
          aria-label="Accessibility settings panel"
          className="fixed bottom-20 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 text-slate-800 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900">Assistive Preferences</h2>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                announce('Accessibility menu closed');
              }}
              aria-label="Close accessibility panel"
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-700"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Screen Speech Reader */}
            <button
              onClick={togglePageReader}
              aria-pressed={isReadingPage}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                isReadingPage
                  ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-500'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                {isReadingPage ? (
                  <Volume2 className="w-5 h-5 text-amber-700 animate-pulse" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" aria-hidden="true" />
                )}
                <span>{isReadingPage ? 'Pause Speech Reader' : 'Listen with Speech'}</span>
              </span>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Alt+R</span>
            </button>

            {/* High Contrast Mode */}
            <button
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                highContrast
                  ? 'bg-slate-900 border-amber-400 text-yellow-300 ring-2 ring-yellow-400'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-700" aria-hidden="true" />
                <span>High Contrast Mode</span>
              </span>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Alt+H</span>
            </button>

            {/* Text Resizing Controls */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-600 block">Text Size: {Math.round(fontSizeScale * 100)}%</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFontSizeScale((prev) => Math.max(0.85, prev - 0.1));
                    announce('Text size reduced');
                  }}
                  aria-label="Decrease text size"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" /> Smaller
                </button>
                <button
                  onClick={() => {
                    setFontSizeScale(1);
                    announce('Text size reset to 100 percent');
                  }}
                  aria-label="Reset text size to default"
                  className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs hover:bg-slate-100 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => {
                    setFontSizeScale((prev) => Math.min(1.4, prev + 0.1));
                    announce('Text size increased');
                  }}
                  aria-label="Increase text size"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" /> Larger
                </button>
              </div>
            </div>

            {/* Dyslexia-Friendly Font */}
            <button
              onClick={toggleDyslexiaFont}
              aria-pressed={dyslexiaFont}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                dyslexiaFont
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-600'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Type className="w-5 h-5 text-emerald-700" aria-hidden="true" />
                <span>Dyslexia-Friendly Font</span>
              </span>
              <span className="text-xs text-slate-500">{dyslexiaFont ? 'ON' : 'OFF'}</span>
            </button>

            {/* Keyboard Shortcuts Helper Button */}
            <button
              onClick={() => {
                setShowShortcuts(true);
                announce('Opened keyboard shortcuts reference guide');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              View Keyboard Shortcuts (Alt + ?)
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 id="shortcuts-title" className="text-lg font-bold text-slate-900">
                Keyboard Navigation Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                aria-label="Close keyboard shortcuts dialog"
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Go to Home</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + 1</kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Go to About</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + 2</kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Go to Qualifications</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + 3</kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Go to Quran Classes</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + 4</kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Go to Awards</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + 5</kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Go to Contact</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + 6</kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Toggle Speech Reader</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + R</kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Toggle High Contrast</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + H</kbd>
              </li>
              <li className="flex justify-between items-center py-1">
                <span>Admin Login Portal</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-xs">Alt + A</kbd>
              </li>
            </ul>

            <button
              onClick={() => setShowShortcuts(false)}
              className="w-full py-2.5 bg-emerald-800 text-white rounded-xl font-semibold hover:bg-emerald-900 transition-colors"
            >
              Got it (Close)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
