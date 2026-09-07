import React, { useState } from 'react';
import { Inbox, Trash2, Mail, Download } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { WhatsAppIcon } from '../../components/common/SocialIcons';
import { SEO } from '../../components/common/SEO';

export const AdminEnquiriesPage: React.FC = () => {
  const { enquiries, updateEnquiryStatus, deleteEnquiry, announce } = useCMS();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEnquiries = enquiries
    .filter((e) => filterStatus === 'all' || e.status === filterStatus)
    .filter((e) => filterType === 'all' || e.type === filterType);

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Name', 'Age', 'Country', 'Language', 'Course Interest', 'WhatsApp', 'Email', 'Status', 'Message'];
    const rows = enquiries.map((e) => [
      new Date(e.createdAt).toLocaleDateString(),
      e.type,
      `"${e.name}"`,
      e.age || '',
      `"${e.country || ''}"`,
      e.preferredLanguage || '',
      `"${e.courseInterest || ''}"`,
      `"${e.whatsapp}"`,
      `"${e.email}"`,
      e.status,
      `"${(e.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `abdullah_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    announce('Exported inquiries to CSV successfully');
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <SEO title="Admin - Inquiries Inbox" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Student & Speaking Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage received admission applications for Quran Madarsa and speaking invitations.
          </p>
        </div>

        {enquiries.length > 0 && (
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Status:</span>
          {['all', 'unread', 'contacted', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider ${
                filterStatus === st ? 'bg-emerald-800 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Type:</span>
          {['all', 'quran_classes', 'speaking_invitation', 'general'].map((tp) => (
            <button
              key={tp}
              onClick={() => setFilterType(tp)}
              className={`px-3 py-1.5 rounded-lg ${
                filterType === tp ? 'bg-emerald-800 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tp === 'quran_classes' ? 'Quran Madarsa' : tp === 'speaking_invitation' ? 'Speaking' : tp}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredEnquiries.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <h2 className="text-base font-bold text-slate-700">No inquiries found</h2>
            <p className="text-xs text-slate-500">New submissions from the website will automatically appear here.</p>
          </div>
        ) : (
          filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className={`p-6 rounded-3xl border transition-all ${
                enq.status === 'unread'
                  ? 'bg-amber-50/60 border-amber-300 shadow-md'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-slate-900">{enq.name}</span>
                  {enq.age && (
                    <span className="text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                      Age: {enq.age}
                    </span>
                  )}
                  {enq.country && (
                    <span className="text-xs text-slate-500">({enq.country})</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">
                    {new Date(enq.createdAt).toLocaleString()}
                  </span>
                  <select
                    value={enq.status}
                    onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="unread">Unread</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-3">
                {enq.courseInterest && (
                  <p className="text-xs font-bold text-emerald-800">
                    Course Interest: <span className="text-slate-900 font-medium">{enq.courseInterest}</span>
                  </p>
                )}

                <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {enq.message}
                </p>

                {/* Actions & Contact Details */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <a
                      href={`mailto:${enq.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{enq.email}</span>
                    </a>

                    <a
                      href={`https://wa.me/${enq.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Reply on WhatsApp ({enq.whatsapp})</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Delete enquiry from ${enq.name}?`)) {
                        deleteEnquiry(enq.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    aria-label={`Delete enquiry from ${enq.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
