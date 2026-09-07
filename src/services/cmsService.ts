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
import {
  initialProfile,
  initialAbout,
  initialQualifications,
  initialAwards,
  initialJourney,
  initialCourses,
  initialVideos,
  initialGallery,
  initialSocialLinks,
  initialSettings,
  initialEnquiries,
} from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'abdullah_cms_profile',
  ABOUT: 'abdullah_cms_about',
  QUALIFICATIONS: 'abdullah_cms_qualifications',
  AWARDS: 'abdullah_cms_awards',
  JOURNEY: 'abdullah_cms_journey',
  COURSES: 'abdullah_cms_courses',
  VIDEOS: 'abdullah_cms_videos',
  GALLERY: 'abdullah_cms_gallery',
  SOCIAL: 'abdullah_cms_social',
  SETTINGS: 'abdullah_cms_settings',
  ENQUIRIES: 'abdullah_cms_enquiries',
  AUTH: 'abdullah_cms_auth',
};

export const CMSService = {
  getProfile(): Profile {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : initialProfile;
  },
  saveProfile(profile: Profile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getAbout(): AboutSection {
    const data = localStorage.getItem(STORAGE_KEYS.ABOUT);
    return data ? JSON.parse(data) : initialAbout;
  },
  saveAbout(about: AboutSection): void {
    localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(about));
  },

  getQualifications(): Qualification[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUALIFICATIONS);
    return data ? JSON.parse(data) : initialQualifications;
  },
  saveQualifications(qualifications: Qualification[]): void {
    localStorage.setItem(STORAGE_KEYS.QUALIFICATIONS, JSON.stringify(qualifications));
  },

  getAwards(): Award[] {
    const data = localStorage.getItem(STORAGE_KEYS.AWARDS);
    return data ? JSON.parse(data) : initialAwards;
  },
  saveAwards(awards: Award[]): void {
    localStorage.setItem(STORAGE_KEYS.AWARDS, JSON.stringify(awards));
  },

  getJourney(): JourneyMilestone[] {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNEY);
    return data ? JSON.parse(data) : initialJourney;
  },
  saveJourney(journey: JourneyMilestone[]): void {
    localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(journey));
  },

  getCourses(): Course[] {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : initialCourses;
  },
  saveCourses(courses: Course[]): void {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  getVideos(): VideoItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    return data ? JSON.parse(data) : initialVideos;
  },
  saveVideos(videos: VideoItem[]): void {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  },

  getGallery(): GalleryItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
    return data ? JSON.parse(data) : initialGallery;
  },
  saveGallery(gallery: GalleryItem[]): void {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  },

  getSocialLinks(): SocialLink[] {
    const data = localStorage.getItem(STORAGE_KEYS.SOCIAL);
    return data ? JSON.parse(data) : initialSocialLinks;
  },
  saveSocialLinks(social: SocialLink[]): void {
    localStorage.setItem(STORAGE_KEYS.SOCIAL, JSON.stringify(social));
  },

  getSettings(): SiteSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : initialSettings;
  },
  saveSettings(settings: SiteSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getEnquiries(): Enquiry[] {
    const data = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    return data ? JSON.parse(data) : initialEnquiries;
  },
  saveEnquiries(enquiries: Enquiry[]): void {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  },
  addEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
    const current = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: 'enq_' + Date.now(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    const updated = [newEnquiry, ...current];
    this.saveEnquiries(updated);
    return newEnquiry;
  },

  exportAllData(): string {
    const fullBackup = {
      profile: this.getProfile(),
      about: this.getAbout(),
      qualifications: this.getQualifications(),
      awards: this.getAwards(),
      journey: this.getJourney(),
      courses: this.getCourses(),
      videos: this.getVideos(),
      gallery: this.getGallery(),
      social: this.getSocialLinks(),
      settings: this.getSettings(),
      enquiries: this.getEnquiries(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(fullBackup, null, 2);
  },

  importAllData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (parsed.about) this.saveAbout(parsed.about);
      if (parsed.qualifications) this.saveQualifications(parsed.qualifications);
      if (parsed.awards) this.saveAwards(parsed.awards);
      if (parsed.journey) this.saveJourney(parsed.journey);
      if (parsed.courses) this.saveCourses(parsed.courses);
      if (parsed.videos) this.saveVideos(parsed.videos);
      if (parsed.gallery) this.saveGallery(parsed.gallery);
      if (parsed.social) this.saveSocialLinks(parsed.social);
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (parsed.enquiries) this.saveEnquiries(parsed.enquiries);
      return true;
    } catch {
      return false;
    }
  },

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ABOUT);
    localStorage.removeItem(STORAGE_KEYS.QUALIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AWARDS);
    localStorage.removeItem(STORAGE_KEYS.JOURNEY);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.SOCIAL);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
  },

  getAuthStatus(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },
  setAuthStatus(isAuth: boolean): void {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAuth ? 'true' : 'false');
  }
};
