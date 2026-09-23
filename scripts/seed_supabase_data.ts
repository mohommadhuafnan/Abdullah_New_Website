import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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
} from '../src/data/initialData';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Use secret key if available for administrative seeding to bypass RLS policies
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding initial data to Supabase...');

  // 1. Profile
  const { data: existingProfile } = await supabase.from('profiles').select('id').limit(1);
  if (!existingProfile || existingProfile.length === 0) {
    console.log('Seeding profile...');
    await supabase.from('profiles').insert([
      {
        full_name: initialProfile.fullName,
        professional_title: initialProfile.professionalTitle,
        headline: initialProfile.headline,
        tagline: initialProfile.tagline,
        short_bio: initialProfile.shortBio,
        full_bio: initialProfile.fullBio,
        profile_image: initialProfile.profileImage,
        hero_image: initialProfile.heroImage,
        hero_video_url: initialProfile.heroVideoUrl,
        hero_video_enabled: initialProfile.heroVideoEnabled,
        location: initialProfile.location,
        languages: initialProfile.languages,
        email: initialProfile.email,
        whatsapp: initialProfile.whatsapp,
        phone: initialProfile.phone,
      },
    ]);
  }

  // 2. About section
  const { data: existingAbout } = await supabase.from('about_sections').select('id').limit(1);
  if (!existingAbout || existingAbout.length === 0) {
    console.log('Seeding about section...');
    await supabase.from('about_sections').insert([
      {
        who_i_am: initialAbout.whoIAm,
        where_journey_began: initialAbout.whereJourneyBegan,
        what_i_do: initialAbout.whatIDo,
        what_i_believe: initialAbout.whatIBelieve,
        mission: initialAbout.mission,
        vision: initialAbout.vision,
      },
    ]);
  }

  // 3. Site Settings
  const { data: existingSettings } = await supabase.from('site_settings').select('id').limit(1);
  if (!existingSettings || existingSettings.length === 0) {
    console.log('Seeding site settings...');
    await supabase.from('site_settings').insert([
      {
        site_name: initialSettings.siteName,
        meta_title: initialSettings.metaTitle,
        meta_description: initialSettings.metaDescription,
        primary_color: initialSettings.primaryColor,
        contact_email: initialSettings.contactEmail,
        contact_whatsapp: initialSettings.contactWhatsapp,
        hero_video_url: initialSettings.heroVideoUrl,
        hero_video_enabled: initialSettings.heroVideoEnabled,
        footer_text: initialSettings.footerText,
        developer_credit: initialSettings.developerCredit,
        developer_url: initialSettings.developerUrl,
        enable_live_announcements: initialSettings.enableLiveAnnouncements,
      },
    ]);
  }

  // 4. Social Links
  const { data: existingSocial } = await supabase.from('social_links').select('id').limit(1);
  if (!existingSocial || existingSocial.length === 0) {
    console.log('Seeding social links...');
    const rows = initialSocialLinks.map((s, idx) => ({
      platform: s.platform,
      name: s.name,
      url: s.url,
      handle: s.handle,
      enabled: s.enabled,
      display_order: idx,
    }));
    await supabase.from('social_links').insert(rows);
  }

  // 5. Qualifications
  const { data: existingQuals } = await supabase.from('qualifications').select('id').limit(1);
  if (!existingQuals || existingQuals.length === 0) {
    console.log('Seeding qualifications...');
    const rows = initialQualifications.map((q, idx) => ({
      title: q.title,
      description: q.description,
      category: q.category,
      icon: q.icon,
      details: q.details,
      featured: q.featured,
      display_order: idx,
      status: 'published',
    }));
    await supabase.from('qualifications').insert(rows);
  }

  // 6. Awards
  const { data: existingAwards } = await supabase.from('awards').select('id').limit(1);
  if (!existingAwards || existingAwards.length === 0) {
    console.log('Seeding awards...');
    const rows = initialAwards.map((a) => ({
      name: a.name,
      recipient: a.recipient,
      designation: a.designation,
      organization: a.organization,
      date: a.date,
      year: a.year,
      venue: a.venue,
      description: a.description,
      citation_text: a.citationText,
      plaque_image: a.plaqueImage,
      ceremony_image: a.ceremonyImage,
      featured: a.featured,
      status: 'published',
    }));
    await supabase.from('awards').insert(rows);
  }

  // 7. Journey
  const { data: existingJourney } = await supabase.from('journey_milestones').select('id').limit(1);
  if (!existingJourney || existingJourney.length === 0) {
    console.log('Seeding journey milestones...');
    const rows = initialJourney.map((j, idx) => ({
      title: j.title,
      category: j.category,
      period: j.period,
      year: j.year,
      description: j.description,
      organization: j.organization,
      location: j.location,
      featured: j.featured,
      display_order: idx,
      status: 'published',
    }));
    await supabase.from('journey_milestones').insert(rows);
  }

  // 8. Courses
  const { data: existingCourses } = await supabase.from('courses').select('id').limit(1);
  if (!existingCourses || existingCourses.length === 0) {
    console.log('Seeding courses...');
    const rows = initialCourses.map((c) => ({
      title: c.title,
      subtitle: c.subtitle,
      initiative_name: c.initiativeName,
      target_age: c.targetAge,
      student_type: c.studentType,
      learning_mode: c.learningMode,
      teacher: c.teacher,
      description: c.description,
      program_areas: c.programAreas,
      featured: c.featured,
      status: 'published',
    }));
    await supabase.from('courses').insert(rows);
  }

  // 9. Videos
  const { data: existingVideos } = await supabase.from('videos').select('id').limit(1);
  if (!existingVideos || existingVideos.length === 0) {
    console.log('Seeding videos...');
    const rows = initialVideos.map((v) => ({
      title: v.title,
      description: v.description,
      category: v.category,
      youtube_url: v.youtubeUrl,
      video_id: v.videoId,
      thumbnail: v.thumbnail,
      publish_date: v.publishDate ? new Date(v.publishDate) : null,
      featured: v.featured,
      status: 'published',
    }));
    await supabase.from('videos').insert(rows);
  }

  // 10. Gallery
  const { data: existingGallery } = await supabase.from('gallery_items').select('id').limit(1);
  if (!existingGallery || existingGallery.length === 0) {
    console.log('Seeding gallery items...');
    const rows = initialGallery.map((g, idx) => ({
      title: g.title,
      caption: g.caption,
      category: g.category,
      image_url: g.imageUrl,
      alt_text: g.altText,
      featured: g.featured,
      display_order: idx,
      status: 'published',
    }));
    await supabase.from('gallery_items').insert(rows);
  }

  console.log('✅ Supabase database successfully populated with all portfolio data!');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
