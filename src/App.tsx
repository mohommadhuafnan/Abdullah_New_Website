import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CMSProvider, useCMS } from './context/CMSContext';

import { SkipToContent } from './components/common/SkipToContent';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { AriaLiveAnnouncer } from './components/common/AriaLiveAnnouncer';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { JourneyPage } from './pages/public/JourneyPage';
import { QualificationsPage } from './pages/public/QualificationsPage';
import { MediaPage } from './pages/public/MediaPage';
import { AwardsPage } from './pages/public/AwardsPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { QuranClassesPage } from './pages/public/QuranClassesPage';
import { ContactPage } from './pages/public/ContactPage';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { AdminAboutPage } from './pages/admin/AdminAboutPage';
import { AdminQualificationsPage } from './pages/admin/AdminQualificationsPage';
import { AdminJourneyPage } from './pages/admin/AdminJourneyPage';
import { AdminAwardsPage } from './pages/admin/AdminAwardsPage';
import { AdminVideosPage } from './pages/admin/AdminVideosPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminSocialPage } from './pages/admin/AdminSocialPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Protected Route Guard with Server Session Validation
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isAuthChecking } = useCMS();

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Verifying administrator session...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Public Layout wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SkipToContent />
      <Navbar />
      <div className={`flex-1 ${isHomePage ? '' : 'pt-20'}`}>{children}</div>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export function App() {
  return (
    <CMSProvider>
      <Router>
        <ScrollToTop />
        <AriaLiveAnnouncer />

        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/journey"
            element={
              <PublicLayout>
                <JourneyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/qualifications"
            element={
              <PublicLayout>
                <QualificationsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/media"
            element={
              <PublicLayout>
                <MediaPage />
              </PublicLayout>
            }
          />
          <Route
            path="/videos"
            element={
              <PublicLayout>
                <MediaPage />
              </PublicLayout>
            }
          />
          <Route
            path="/awards"
            element={
              <PublicLayout>
                <AwardsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/gallery"
            element={
              <PublicLayout>
                <GalleryPage />
              </PublicLayout>
            }
          />
          <Route
            path="/quran-classes"
            element={
              <PublicLayout>
                <QuranClassesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="qualifications" element={<AdminQualificationsPage />} />
            <Route path="journey" element={<AdminJourneyPage />} />
            <Route path="awards" element={<AdminAwardsPage />} />
            <Route path="videos" element={<AdminVideosPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="social" element={<AdminSocialPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CMSProvider>
  );
}

export default App;
