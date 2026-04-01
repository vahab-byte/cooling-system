-- ArcticFresh Professional Dashboard Schema
-- Engineering Protocol for Database Integrity

-- 1. EXTENSIONS & FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. MASTER SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('standard', 'premium', 'commercial', 'emergency')),
    description TEXT,
    price_base DECIMAL(10, 2) NOT NULL,
    duration_est_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TECHNICIANS TABLE
CREATE TABLE IF NOT EXISTS public.technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT UNIQUE,
    avatar_url TEXT,
    rating DECIMAL(2, 1) DEFAULT 4.9,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'on_leave')),
    experience_years INTEGER DEFAULT 5,
    specialization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE (THE CORE TRANSACTION)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    service_id UUID REFERENCES public.services(id),
    technician_id UUID REFERENCES public.technicians(id),
    booking_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'assigned', 'en_route', 'in_progress', 'completed', 'cancelled')),
    address TEXT NOT NULL,
    pincode TEXT,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    amount_final DECIMAL(10, 2),
    technical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTACT ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    building_type TEXT CHECK (building_type IN ('residential', 'commercial', 'industrial')),
    urgency TEXT CHECK (urgency IN ('standard', 'urgent', 'emergency')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'contacted', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DASHBOARD ANALYTICS CACHE / SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    active_squads INTEGER DEFAULT 14,
    max_squads INTEGER DEFAULT 25,
    last_reset TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRIGGERS
CREATE TRIGGER set_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_technicians_updated_at BEFORE UPDATE ON public.technicians FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 8. INITIAL DATA (PROTOCOLS)
INSERT INTO public.services (title, category, price_base) VALUES 
('Split AC Service (Deep Bio-Clean)', 'premium', 1299.00),
('Cassette AC Precision Reset', 'commercial', 2499.00),
('Window AC Thermal Recovery', 'standard', 899.00),
('Critical Cooling SOS', 'emergency', 1999.00)
ON CONFLICT DO NOTHING;

INSERT INTO public.technicians (name, phone, rating, status) VALUES
('Rajesh Kumar', '+91 98XXX XXXXX', 4.9, 'available'),
('Amit Shah', '+91 97XXX XXXXX', 4.8, 'available'),
('Suresh Mehta', '+91 96XXX XXXXX', 5.0, 'available')
ON CONFLICT DO NOTHING;

INSERT INTO public.site_stats (total_bookings, active_squads, max_squads) VALUES (1250, 14, 25) ON CONFLICT DO NOTHING;
