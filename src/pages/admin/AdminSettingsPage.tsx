import React, { useState } from 'react';
import { Save, Check, Download, Upload, RotateCcw } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, exportData, importData, resetAll, announce } = useCMS();
  const [formData, setFormData] = useState({ ...settings });
  const [importJson, setImportJson] = useState('');
  const [saved, setSaved] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abdullah_website_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    announce('Website complete JSON backup downloaded successfully');
  };

  const handleImport = () => {
    if (!importJson.trim()) {
      announce('Please paste valid JSON data to restore.', true);
      return;
    }
    const ok = importData(importJson);
    if (ok) {
      setImportSuccess(true);
      setImportJson('');
      setTimeout(() => setImportSuccess(false), 4000);
    } else {
      announce('Invalid JSON backup file. Please verify format.', true);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <SEO title="Admin - Settings & Backup" />

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Website Settings & Database Backup
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage global website metadata, developer credits, full JSON export backups, and restoration.
        </p>
      </div>

      {saved && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
          <span>Website settings updated successfully!</span>
        </div>
      )}

      {/* General Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
          Global Meta & Branding Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="set-name" className="block text-xs font-bold text-slate-700">
              Website Brand Title <span className="text-red-500">*</span>
            </label>
            <input
              id="set-name"
              type="text"
              required
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="set-meta-title" className="block text-xs font-bold text-slate-700">
              Default SEO Title Tag
            </label>
            <input
              id="set-meta-title"
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="set-meta-desc" className="block text-xs font-bold text-slate-700">
            Default SEO Meta Description
          </label>
          <textarea
            id="set-meta-desc"
            rows={2}
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="set-dev-cred" className="block text-xs font-bold text-slate-700">
              Developer Credit Text
            </label>
            <input
              id="set-dev-cred"
              type="text"
              value={formData.developerCredit}
              onChange={(e) => setFormData({ ...formData, developerCredit: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="set-dev-url" className="block text-xs font-bold text-slate-700">
              Developer Website Link
            </label>
            <input
              id="set-dev-url"
              type="text"
              value={formData.developerUrl}
              onChange={(e) => setFormData({ ...formData, developerUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="set-footer" className="block text-xs font-bold text-slate-700">
            Footer Copyright Text
          </label>
          <input
            id="set-footer"
            type="text"
            value={formData.footerText}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-400"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Backup & Restore Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
          1-Click Database Backup & Restore
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-slate-900">Export Full Website JSON Backup</h3>
            <p className="text-xs text-slate-500">Downloads all profiles, qualifications, awards, videos, courses, and inquiries.</p>
          </div>
          <button
            onClick={handleExport}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Restore */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-sm text-slate-900">Restore from JSON Backup</h3>
          {importSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl">
              Backup restored successfully! All data updated.
            </div>
          )}
          <textarea
            rows={3}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste your JSON backup code here..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
          />
          <button
            onClick={handleImport}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Restore Backup</span>
          </button>
        </div>

        {/* Reset to initial defaults */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-red-700 block">Reset to Verified Initial Seed Data</span>
            <span className="text-[11px] text-slate-500">Restores all original verified client content.</span>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all content to default verified client records?')) {
                resetAll();
              }
            }}
            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Content</span>
          </button>
        </div>
      </div>
    </div>
  );
};
