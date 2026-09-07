export type ContentStatus = 'draft' | 'published';

export interface Profile {
  id: string;
  fullName: string;
  professionalTitle: string;
  headline: string;
  tagline: string;
  shortBio: string;
  fullBio: string;
  profileImage: string;
  heroImage: string;
  heroVideoUrl?: string;
  heroVideoEnabled: boolean;
  location: string;
  languages: string[];
  email: string;
  whatsapp: string;
  phone?: string;
}

export interface AboutSection {
  whoIAm: string;
  whereJourneyBegan: string;
  whatIDo: string;
  whatIBelieve: string;
  mission: string;
  vision: string;
  corePillars: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface Qualification {
  id: string;
  title: string;
  description: string;
  category: 'Quran' | 'Language' | 'Media' | 'Broadcasting' | 'Assistive Tech' | 'Creative' | 'Digital';
  icon: string;
  details?: string[];
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  category: 'Quran' | 'Journalism' | 'Broadcasting' | 'Education' | 'Award' | 'Public Speaking';
  year?: string;
  period?: string;
  description: string;
  organization?: string;
  location?: string;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export interface Award {
  id: string;
  name: string;
  recipient: string;
  designation: string;
  organization: string;
  date: string;
  year: string;
  venue: string;
  description: string;
  citationText: string;
  plaqueImage: string;
  ceremonyImage: string;
  featured: boolean;
  status: ContentStatus;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: 'Journalism' | 'Broadcasting' | 'Islamic Education' | 'Public Speaking' | 'Interviews';
  youtubeUrl: string;
  videoId: string;
  thumbnail: string;
  publishDate: string;
  featured: boolean;
  status: ContentStatus;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: 'Awards' | 'Journalism' | 'Broadcasting' | 'Islamic Education' | 'Personal Brand';
  imageUrl: string;
  altText: string;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  initiativeName: string;
  targetAge: string;
  studentType: string;
  learningMode: string;
  teacher: string;
  description: string;
  programAreas: string[];
  featured: boolean;
  status: ContentStatus;
}

export interface SocialLink {
  id: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'whatsapp';
  name: string;
  url: string;
  handle: string;
  enabled: boolean;
  displayOrder: number;
}

export interface Enquiry {
  id: string;
  type: 'quran_classes' | 'speaking_invitation' | 'media_inquiry' | 'general';
  name: string;
  age?: string;
  country?: string;
  preferredLanguage?: string;
  courseInterest?: string;
  whatsapp: string;
  email: string;
  message: string;
  status: 'unread' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  primaryColor: string;
  contactEmail: string;
  contactWhatsapp: string;
  heroVideoUrl: string;
  heroVideoEnabled: boolean;
  footerText: string;
  developerCredit: string;
  developerUrl: string;
  enableLiveAnnouncements: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  isAuthenticated: boolean;
}
