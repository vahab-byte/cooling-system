-- Migration: Create Admin Settings and Site Stats tables
-- Description: Adds missing tables required by the adminController APIs

-- 1. Create admin_settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add some default settings
INSERT INTO public.admin_settings (key, value) VALUES
    ('site_maintenance', 'false'),
    ('tax_rate', '18'),
    ('currency', '"INR"'),
    ('contact_email', '"support@arcticfresh.in"')
ON CONFLICT (key) DO NOTHING;

-- 2. Create site_stats table (for public-facing metrics)
CREATE TABLE IF NOT EXISTS public.site_stats (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL
);

-- Insert default site stats
INSERT INTO public.site_stats (key, label, value) VALUES
    ('happy_customers', 'Happy Customers', '10,000+'),
    ('expert_technicians', 'Expert Technicians', '50+'),
    ('cities_covered', 'Cities Covered', '5'),
    ('years_experience', 'Years Experience', '15+')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Only authenticated users (preferably admins) can read/write admin_settings
CREATE POLICY "Allow admins to read settings" 
    ON public.admin_settings FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to update settings" 
    ON public.admin_settings FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Anyone can read site stats (it's a public API)
CREATE POLICY "Allow public to read site stats" 
    ON public.site_stats FOR SELECT 
    USING (true);
