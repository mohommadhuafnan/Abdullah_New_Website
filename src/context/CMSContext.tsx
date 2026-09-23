import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  Profile,
  AboutSection,
  Qualification,
  JourneyMilestone,
  Award,
  VideoItem,
  GalleryItem,
  Course,
  SocialLink,
  SiteSettings,
  Enquiry
} from '../types';
import { CMSService } from '../services/cmsService';
import { AuthClient } from '../services/authClient';

interface CMSContextType {
  profile: Profile;
  updateProfile: (profile: Profile) => void;
  about: AboutSection;
  updateAbout: (about: AboutSection) => void;
  qualifications: Qualification[];
  saveQualifications: (quals: Qualification[]) => void;
  addQualification: (qual: Omit<Qualification, 'id'>) => void;
  updateQualification: (id: string, qual: Partial<Qualification>) => void;
  deleteQualification: (id: string) => void;
  awards: Award[];
  saveAwards: (awards: Award[]) => void;
  addAward: (award: Omit<Award, 'id'>) => void;
  updateAward: (id: string, award: Partial<Award>) => void;
  deleteAward: (id: string) => void;
  journey: JourneyMilestone[];
  saveJourney: (journey: JourneyMilestone[]) => void;
  addJourneyMilestone: (milestone: Omit<JourneyMilestone, 'id'>) => void;
  updateJourneyMilestone: (id: string, milestone: Partial<JourneyMilestone>) => void;
  deleteJourneyMilestone: (id: string) => void;
  courses: Course[];
  updateCourses: (courses: Course[]) => void;
  videos: VideoItem[];
  saveVideos: (videos: VideoItem[]) => void;
  addVideo: (video: Omit<VideoItem, 'id'>) => void;
  updateVideo: (id: string, video: Partial<VideoItem>) => void;
  deleteVideo: (id: string) => void;
  gallery: GalleryItem[];
  saveGallery: (gallery: GalleryItem[]) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  socialLinks: SocialLink[];
  saveSocialLinks: (social: SocialLink[]) => void;
  updateSocialLink: (id: string, social: Partial<SocialLink>) => void;
  settings: SiteSettings;
  updateSettings: (settings: SiteSettings) => void;
  enquiries: Enquiry[];
  submitEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  deleteEnquiry: (id: string) => void;
  
  // Secure Email + OTP Auth
  isAdmin: boolean;
  adminEmail: string | null;
  isAuthChecking: boolean;
  requestOtp: (email: string) => Promise<{ success: boolean; message: string; challengeId?: string; maskedEmail?: string; expiresIn?: number; error?: string }>;
  verifyOtp: (challengeId: string, otp: string) => Promise<{ success: boolean; message: string; error?: string }>;
  resendOtp: (challengeId: string) => Promise<{ success: boolean; message: string; expiresIn?: number; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  
  // Screen Reader & Live Accessibility
  liveMessage: string;
  isAssertive: boolean;
  announce: (message: string, assertive?: boolean) => void;
  
  // Accessibility Preferences
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSizeScale: number;
  setFontSizeScale: React.Dispatch<React.SetStateAction<number>>;
  dyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;
  isReadingPage: boolean;
  togglePageReader: () => void;
  
  // Backup
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile>(() => CMSService.getProfile());
  const [about, setAboutState] = useState<AboutSection>(() => CMSService.getAbout());
  const [qualifications, setQualificationsState] = useState<Qualification[]>(() => CMSService.getQualifications());
  const [awards, setAwardsState] = useState<Award[]>(() => CMSService.getAwards());
  const [journey, setJourneyState] = useState<JourneyMilestone[]>(() => CMSService.getJourney());
  const [courses, setCoursesState] = useState<Course[]>(() => CMSService.getCourses());
  const [videos, setVideosState] = useState<VideoItem[]>(() => CMSService.getVideos());
  const [gallery, setGalleryState] = useState<GalleryItem[]>(() => CMSService.getGallery());
  const [socialLinks, setSocialLinksState] = useState<SocialLink[]>(() => CMSService.getSocialLinks());
  const [settings, setSettingsState] = useState<SiteSettings>(() => CMSService.getSettings());
  const [enquiries, setEnquiriesState] = useState<Enquiry[]>(() => CMSService.getEnquiries());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Validate server session on mount
  useEffect(() => {
    let isMounted = true;
    AuthClient.checkSession().then((res) => {
      if (isMounted) {
        setIsAdmin(res.authenticated);
        setAdminEmail(res.email || null);
        setIsAuthChecking(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Accessibility State
  const [liveMessage, setLiveMessage] = useState<string>('');
  const [isAssertive, setIsAssertive] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSizeScale, setFontSizeScale] = useState<number>(1);
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(false);
  const [isReadingPage, setIsReadingPage] = useState<boolean>(false);

  // Announce for screen readers
  const announce = (message: string, assertive = false) => {
    setIsAssertive(assertive);
    setLiveMessage(message);
    if (isReadingPage && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.body.classList.add('high-contrast');
      announce('High contrast mode enabled');
    } else {
      document.body.classList.remove('high-contrast');
      announce('High contrast mode disabled');
    }
  };

  const toggleDyslexiaFont = () => {
    const next = !dyslexiaFont;
    setDyslexiaFont(next);
    if (next) {
      document.body.classList.add('dyslexia-font');
      announce('Dyslexia friendly font enabled');
    } else {
      document.body.classList.remove('dyslexia-font');
      announce('Dyslexia friendly font disabled');
    }
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeScale * 100}%`;
  }, [fontSizeScale]);

  const togglePageReader = () => {
    if (!('speechSynthesis' in window)) {
      announce('Text to speech is not supported in this browser.', true);
      return;
    }
    if (isReadingPage) {
      window.speechSynthesis.cancel();
      setIsReadingPage(false);
      announce('Screen speech reader paused.');
    } else {
      setIsReadingPage(true);
      announce('Screen speech reader started. Reading main content.');
      const mainText = document.querySelector('main')?.innerText || document.body.innerText;
      const utterance = new SpeechSynthesisUtterance(mainText.slice(0, 1000));
      utterance.rate = 1.0;
      utterance.onend = () => setIsReadingPage(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const updateProfile = (newProfile: Profile) => {
    setProfileState(newProfile);
    CMSService.saveProfile(newProfile);
    announce('Profile changes saved successfully');
  };

  const updateAbout = (newAbout: AboutSection) => {
    setAboutState(newAbout);
    CMSService.saveAbout(newAbout);
    announce('About section updated successfully');
  };

  const saveQualifications = (quals: Qualification[]) => {
    setQualificationsState(quals);
    CMSService.saveQualifications(quals);
    announce('Qualifications list updated');
  };

  const addQualification = (qual: Omit<Qualification, 'id'>) => {
    const newItem: Qualification = { ...qual, id: 'qual_' + Date.now() };
    const updated = [...qualifications, newItem];
    saveQualifications(updated);
  };

  const updateQualification = (id: string, partial: Partial<Qualification>) => {
    const updated = qualifications.map((q) => (q.id === id ? { ...q, ...partial } : q));
    saveQualifications(updated);
  };

  const deleteQualification = (id: string) => {
    const updated = qualifications.filter((q) => q.id !== id);
    saveQualifications(updated);
  };

  const saveAwards = (newAwards: Award[]) => {
    setAwardsState(newAwards);
    CMSService.saveAwards(newAwards);
    announce('Awards updated');
  };

  const addAward = (award: Omit<Award, 'id'>) => {
    const newItem: Award = { ...award, id: 'award_' + Date.now() };
    saveAwards([newItem, ...awards]);
  };

  const updateAward = (id: string, partial: Partial<Award>) => {
    const updated = awards.map((a) => (a.id === id ? { ...a, ...partial } : a));
    saveAwards(updated);
  };

  const deleteAward = (id: string) => {
    saveAwards(awards.filter((a) => a.id !== id));
  };

  const saveJourney = (newJourney: JourneyMilestone[]) => {
    setJourneyState(newJourney);
    CMSService.saveJourney(newJourney);
    announce('Journey milestones updated');
  };

  const addJourneyMilestone = (milestone: Omit<JourneyMilestone, 'id'>) => {
    const newItem: JourneyMilestone = { ...milestone, id: 'journey_' + Date.now() };
    saveJourney([...journey, newItem]);
  };

  const updateJourneyMilestone = (id: string, partial: Partial<JourneyMilestone>) => {
    saveJourney(journey.map((j) => (j.id === id ? { ...j, ...partial } : j)));
  };

  const deleteJourneyMilestone = (id: string) => {
    saveJourney(journey.filter((j) => j.id !== id));
  };

  const updateCourses = (newCourses: Course[]) => {
    setCoursesState(newCourses);
    CMSService.saveCourses(newCourses);
    announce('Courses updated');
  };

  const saveVideos = (newVideos: VideoItem[]) => {
    setVideosState(newVideos);
    CMSService.saveVideos(newVideos);
    announce('Videos updated');
  };

  const addVideo = (video: Omit<VideoItem, 'id'>) => {
    const newItem: VideoItem = { ...video, id: 'vid_' + Date.now() };
    saveVideos([newItem, ...videos]);
  };

  const updateVideo = (id: string, partial: Partial<VideoItem>) => {
    saveVideos(videos.map((v) => (v.id === id ? { ...v, ...partial } : v)));
  };

  const deleteVideo = (id: string) => {
    saveVideos(videos.filter((v) => v.id !== id));
  };

  const saveGallery = (newGallery: GalleryItem[]) => {
    setGalleryState(newGallery);
    CMSService.saveGallery(newGallery);
    announce('Gallery updated');
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: 'gal_' + Date.now() };
    saveGallery([newItem, ...gallery]);
  };

  const updateGalleryItem = (id: string, partial: Partial<GalleryItem>) => {
    saveGallery(gallery.map((g) => (g.id === id ? { ...g, ...partial } : g)));
  };

  const deleteGalleryItem = (id: string) => {
    saveGallery(gallery.filter((g) => g.id !== id));
  };

  const saveSocialLinks = (newSocial: SocialLink[]) => {
    setSocialLinksState(newSocial);
    CMSService.saveSocialLinks(newSocial);
    announce('Social media links updated');
  };

  const updateSocialLink = (id: string, partial: Partial<SocialLink>) => {
    saveSocialLinks(socialLinks.map((s) => (s.id === id ? { ...s, ...partial } : s)));
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettingsState(newSettings);
    CMSService.saveSettings(newSettings);
    announce('Website settings saved');
  };

  const submitEnquiry = async (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    try {
      const added = CMSService.addEnquiry(enquiry);
      setEnquiriesState([added, ...enquiries]);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0F6B52', '#C8A951', '#064E3B'],
      });
      announce('Thank you! Your enquiry has been received successfully. Abdullah will get back to you soon.', true);
      return true;
    } catch {
      announce('Error sending enquiry. Please try again or reach out on WhatsApp.', true);
      return false;
    }
  };

  const updateEnquiryStatus = (id: string, status: Enquiry['status']) => {
    const updated = enquiries.map((e) => (e.id === id ? { ...e, status } : e));
    setEnquiriesState(updated);
    CMSService.saveEnquiries(updated);
    announce(`Enquiry status changed to ${status}`);
  };

  const deleteEnquiry = (id: string) => {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiriesState(updated);
    CMSService.saveEnquiries(updated);
    announce('Enquiry deleted');
  };

  const requestOtp = async (email: string) => {
    const res = await AuthClient.requestOtp(email);
    if (res.success) {
      announce('Verification code sent to your email.');
    } else {
      announce(res.message, true);
    }
    return res;
  };

  const resendOtp = async (challengeId: string) => {
    const res = await AuthClient.resendOtp(challengeId);
    if (res.success) {
      announce('A new verification code has been sent.');
    } else {
      announce(res.message, true);
    }
    return res;
  };

  const verifyOtp = async (challengeId: string, otp: string) => {
    const res = await AuthClient.verifyOtp(challengeId, otp);
    if (res.success) {
      setIsAdmin(true);
      setAdminEmail(res.email || null);
      announce('Authentication successful. Welcome to the admin dashboard.', true);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch {
        // Ignore
      }
    } else {
      announce(res.message, true);
    }
    return res;
  };

  const logout = async () => {
    await AuthClient.logout();
    setIsAdmin(false);
    setAdminEmail(null);
    announce('You have been signed out from the admin panel.');
  };

  const checkSession = async () => {
    const res = await AuthClient.checkSession();
    setIsAdmin(res.authenticated);
    setAdminEmail(res.email || null);
    return res.authenticated;
  };

  const exportData = () => CMSService.exportAllData();
  const importData = (json: string) => {
    const ok = CMSService.importAllData(json);
    if (ok) {
      setProfileState(CMSService.getProfile());
      setAboutState(CMSService.getAbout());
      setQualificationsState(CMSService.getQualifications());
      setAwardsState(CMSService.getAwards());
      setJourneyState(CMSService.getJourney());
      setCoursesState(CMSService.getCourses());
      setVideosState(CMSService.getVideos());
      setGalleryState(CMSService.getGallery());
      setSocialLinksState(CMSService.getSocialLinks());
      setSettingsState(CMSService.getSettings());
      setEnquiriesState(CMSService.getEnquiries());
      announce('Backup imported successfully');
    }
    return ok;
  };

  const resetAll = () => {
    CMSService.resetToDefaults();
    setProfileState(CMSService.getProfile());
    setAboutState(CMSService.getAbout());
    setQualificationsState(CMSService.getQualifications());
    setAwardsState(CMSService.getAwards());
    setJourneyState(CMSService.getJourney());
    setCoursesState(CMSService.getCourses());
    setVideosState(CMSService.getVideos());
    setGalleryState(CMSService.getGallery());
    setSocialLinksState(CMSService.getSocialLinks());
    setSettingsState(CMSService.getSettings());
    setEnquiriesState(CMSService.getEnquiries());
    announce('Website content reset to initial defaults');
  };

  return (
    <CMSContext.Provider
      value={{
        profile,
        updateProfile,
        about,
        updateAbout,
        qualifications,
        saveQualifications,
        addQualification,
        updateQualification,
        deleteQualification,
        awards,
        saveAwards,
        addAward,
        updateAward,
        deleteAward,
        journey,
        saveJourney,
        addJourneyMilestone,
        updateJourneyMilestone,
        deleteJourneyMilestone,
        courses,
        updateCourses,
        videos,
        saveVideos,
        addVideo,
        updateVideo,
        deleteVideo,
        gallery,
        saveGallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        socialLinks,
        saveSocialLinks,
        updateSocialLink,
        settings,
        updateSettings,
        enquiries,
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        isAdmin,
        adminEmail,
        isAuthChecking,
        requestOtp,
        verifyOtp,
        resendOtp,
        checkSession,
        logout,
        liveMessage,
        isAssertive,
        announce,
        highContrast,
        toggleHighContrast,
        fontSizeScale,
        setFontSizeScale,
        dyslexiaFont,
        toggleDyslexiaFont,
        isReadingPage,
        togglePageReader,
        exportData,
        importData,
        resetAll,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
