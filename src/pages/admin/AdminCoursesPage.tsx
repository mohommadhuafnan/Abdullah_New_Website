import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SEO } from '../../components/common/SEO';

export const AdminCoursesPage: React.FC = () => {
  const { courses, updateCourses } = useCMS();
  const [courseData, setCourseData] = useState(courses[0] || {
    id: 'course_online_madarsa',
    title: 'Islamic TV Media - Online Quran Madarsa',
    subtitle: '“Qur\'an • Knowledge • Communication • Character”',
    initiativeName: 'Islamic TV Media - Online Quran Madarsa',
    targetAge: 'Ages 6 – 15',
    studentType: 'Boys & Girls (Worldwide)',
    learningMode: 'Online Interactive Video Classes',
    teacher: 'Al Hafeel A. A. M. Abdullah (Hafiz-ul-Qur\'an)',
    description: '',
    programAreas: [],
    featured: true,
    status: 'published',
  });
  const [programAreasText, setProgramAreasText] = useState(
    (courseData.programAreas || []).join('\n')
  );
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const areas = programAreasText
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const updated = [{ ...courseData, programAreas: areas }];
    updateCourses(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <SEO title="Admin - Quran Madarsa Editor" />

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Online Quran Madarsa Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage Islamic TV Media educational initiatives, age requirements, curriculum areas, and enrollment information.
        </p>
      </div>

      {saved && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
          <span>Quran Madarsa program details saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="crs-name" className="block text-xs font-bold text-slate-700">
              Initiative Title <span className="text-red-500">*</span>
            </label>
            <input
              id="crs-name"
              type="text"
              required
              value={courseData.initiativeName}
              onChange={(e) => setCourseData({ ...courseData, initiativeName: e.target.value, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="crs-sub" className="block text-xs font-bold text-slate-700">
              Motto / Subtitle
            </label>
            <input
              id="crs-sub"
              type="text"
              value={courseData.subtitle}
              onChange={(e) => setCourseData({ ...courseData, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="crs-age" className="block text-xs font-bold text-slate-700">
              Target Age Group
            </label>
            <input
              id="crs-age"
              type="text"
              value={courseData.targetAge}
              onChange={(e) => setCourseData({ ...courseData, targetAge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="crs-students" className="block text-xs font-bold text-slate-700">
              Eligible Students
            </label>
            <input
              id="crs-students"
              type="text"
              value={courseData.studentType}
              onChange={(e) => setCourseData({ ...courseData, studentType: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="crs-teacher" className="block text-xs font-bold text-slate-700">
              Lead Instructor
            </label>
            <input
              id="crs-teacher"
              type="text"
              value={courseData.teacher}
              onChange={(e) => setCourseData({ ...courseData, teacher: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="crs-desc" className="block text-xs font-bold text-slate-700">
            Program Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="crs-desc"
            rows={4}
            required
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="crs-areas" className="block text-xs font-bold text-slate-700">
            Program Curriculum Areas (One per line)
          </label>
          <textarea
            id="crs-areas"
            rows={6}
            value={programAreasText}
            onChange={(e) => setProgramAreasText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none font-sans"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-400"
          >
            <Save className="w-4 h-4" />
            <span>Save Madarsa Program</span>
          </button>
        </div>
      </form>
    </div>
  );
};
