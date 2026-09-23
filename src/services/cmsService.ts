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
};

export const CMSService = {
  getProfile(): Profile {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) return initialProfile;
    try {
      const parsed: Profile = JSON.parse(data);
      let updated = false;
      if (parsed.heroVideoUrl?.includes('dQw4w9WgXcQ')) {
        parsed.heroVideoUrl = 'https://www.youtube.com/watch?v=7fqZvAI2w2c';
        updated = true;
      }
      if (!parsed.heroImage || parsed.heroImage === '/assets/hero_portrait.jpg') {
        parsed.heroImage = '/assets/hero_executive_bg.png';
        updated = true;
      }
      if (updated) {
        this.saveProfile(parsed);
      }
      return parsed;
    } catch {
      return initialProfile;
    }
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
    if (!data) return initialVideos;
    try {
      const parsed: VideoItem[] = JSON.parse(data);
      // Migrate if old placeholder videos with RickRoll exist
      const hasOldPlaceholders = parsed.some((v) => v.videoId === 'dQw4w9WgXcQ' || v.youtubeUrl?.includes('dQw4w9WgXcQ'));
      if (hasOldPlaceholders || parsed.length === 0) {
        this.saveVideos(initialVideos);
        return initialVideos;
      }
      return parsed;
    } catch {
      return initialVideos;
    }
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
    if (!data) return initialSocialLinks;
    try {
      const parsed: SocialLink[] = JSON.parse(data);
      const yt = parsed.find((s) => s.platform === 'youtube');
      if (yt && (!yt.url.includes('_abdullah') || yt.handle === '@islamictvmedia')) {
        yt.url = 'https://youtube.com/@islamictvmedia_abdullah?si=ZGYZWdd-UBXzrqBH';
        yt.handle = '@islamictvmedia_abdullah';
        this.saveSocialLinks(parsed);
      }
      return parsed;
    } catch {
      return initialSocialLinks;
    }
  },
  saveSocialLinks(social: SocialLink[]): void {
    localStorage.setItem(STORAGE_KEYS.SOCIAL, JSON.stringify(social));
  },

  getSettings(): SiteSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return initialSettings;
    try {
      const parsed: SiteSettings = JSON.parse(data);
      if (parsed.heroVideoUrl?.includes('dQw4w9WgXcQ')) {
        parsed.heroVideoUrl = 'https://www.youtube.com/watch?v=7fqZvAI2w2c';
        this.saveSettings(parsed);
      }
      return parsed;
    } catch {
      return initialSettings;
    }
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
  }
};
