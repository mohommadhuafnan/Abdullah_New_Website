-- ==============================================================================
-- DATABASE SCHEMA: AL HAFEEL A. A. M. ABDULLAH PORTFOLIO & CMS
-- Production-ready PostgreSQL schema with Row-Level Security for Supabase
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    professional_title TEXT NOT NULL,
    headline TEXT NOT NULL,
    tagline TEXT NOT NULL,
    short_bio TEXT,
    full_bio TEXT,
    profile_image TEXT,
    hero_image TEXT,
    hero_video_url TEXT,
    hero_video_enabled BOOLEAN DEFAULT FALSE,
    location TEXT,
    languages TEXT[] DEFAULT ARRAY['Tamil', 'Sinhala', 'English', 'Arabic'],
    email TEXT,
    whatsapp TEXT,
    phone TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. About Section Table
CREATE TABLE IF NOT EXISTS public.about_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    who_i_am TEXT NOT NULL,
    where_journey_began TEXT NOT NULL,
    what_i_do TEXT NOT NULL,
    what_i_believe TEXT NOT NULL,
    mission TEXT NOT NULL,
    vision TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Qualifications Table
CREATE TABLE IF NOT EXISTS public.qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    details TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Awards Table
CREATE TABLE IF NOT EXISTS public.awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    recipient TEXT NOT NULL,
    designation TEXT NOT NULL,
    organization TEXT NOT NULL,
    date TEXT NOT NULL,
    year TEXT NOT NULL,
    venue TEXT,
    description TEXT NOT NULL,
    citation_text TEXT,
    plaque_image TEXT,
    ceremony_image TEXT,
    featured BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Journey Milestones Table
CREATE TABLE IF NOT EXISTS public.journey_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    period TEXT,
    year TEXT,
    description TEXT NOT NULL,
    organization TEXT,
    location TEXT,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Courses / Islamic TV Media Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    initiative_name TEXT NOT NULL,
    target_age TEXT,
    student_type TEXT,
    learning_mode TEXT,
    teacher TEXT,
    description TEXT NOT NULL,
    program_areas TEXT[],
    featured BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    video_id TEXT NOT NULL,
    thumbnail TEXT,
    publish_date DATE,
    featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    caption TEXT,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Social Links Table
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    handle TEXT,
    enabled BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0
);

-- 10. Student & Speaking Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('quran_classes', 'speaking_invitation', 'media_inquiry', 'general')),
    name TEXT NOT NULL,
    age TEXT,
    country TEXT,
    preferred_language TEXT,
    course_interest TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'contacted', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Website Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    primary_color TEXT DEFAULT '#0F6B52',
    contact_email TEXT,
    contact_whatsapp TEXT,
    hero_video_url TEXT,
    hero_video_enabled BOOLEAN DEFAULT FALSE,
    footer_text TEXT,
    developer_credit TEXT,
    developer_url TEXT,
    enable_live_announcements BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read About" ON public.about_sections FOR SELECT USING (true);
CREATE POLICY "Public Read Qualifications" ON public.qualifications FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Awards" ON public.awards FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Journey" ON public.journey_milestones FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Videos" ON public.videos FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Gallery" ON public.gallery_items FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Social" ON public.social_links FOR SELECT USING (enabled = true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

-- Public Enquiry Submission Policy
CREATE POLICY "Public Insert Enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies
CREATE POLICY "Admin Full Access Profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access About" ON public.about_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Qualifications" ON public.qualifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Awards" ON public.awards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Journey" ON public.journey_milestones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Courses" ON public.courses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Videos" ON public.videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Gallery" ON public.gallery_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Social" ON public.social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Enquiries" ON public.enquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
