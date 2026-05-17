-- Blog System Migration for ArcticFresh
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author_name TEXT NOT NULL,
    author_role TEXT,
    author_avatar TEXT,
    read_time_minutes INTEGER DEFAULT 5,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_featured ON public.blog_posts(is_featured);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_blog_search ON public.blog_posts 
  USING GIN(to_tsvector('english', title || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));

-- Trigger for auto-updating updated_at
CREATE TRIGGER set_blog_updated_at 
  BEFORE UPDATE ON public.blog_posts 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================
-- SEED DATA (migrated from static data.js)
-- ============================================

INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image, category, author_name, author_role, read_time_minutes, is_featured, is_published) VALUES 
(
  'Optimizing Glacier-Tech: The Industrial Advantage',
  'optimizing-glacier-tech-industrial-advantage',
  'A deep dive into how high-capacity cooling systems are transforming data center efficiency and reducing overhead by 30%.',
  E'## The Industrial Cooling Revolution\n\nHigh-capacity cooling systems are no longer a luxury — they''re a critical infrastructure component. In data centers, where equipment generates tremendous heat, efficient cooling directly impacts operational costs and equipment longevity.\n\n### Key Benefits\n\n1. **30% Reduction in Overhead** — Modern VRF systems dynamically adjust cooling output\n2. **Precision Temperature Control** — ±0.5°C accuracy across multi-zone environments\n3. **Predictive Maintenance** — IoT sensors flag issues before failures occur\n\n### The ArcticFresh Approach\n\nOur commercial-grade solutions combine chillers, AHUs, and intelligent controls into a unified platform. Each installation includes:\n\n- Thermal load analysis\n- Energy audit certification\n- 24/7 remote monitoring setup\n- Quarterly performance optimization\n\n> \"The transition to glacier-tech cooling reduced our annual energy bill by ₹18 lakhs.\" — CTO, TechPark Ahmedabad\n\n### Looking Forward\n\nAs AI workloads increase, so does the heat profile of modern data centers. Our 2026 roadmap includes liquid immersion cooling pilots and carbon-neutral refrigerant transitions.',
  'https://images.unsplash.com/photo-1558389186-438424b00a32?auto=format&fit=crop&q=80&w=1200',
  'Commercial',
  'Dr. Aris Thorne',
  'Chief Technology Advisor',
  12,
  true,
  true
),
(
  'Surgical Precision: The 12-Point Service Protocol',
  'surgical-precision-12-point-service-protocol',
  'Why standard cleaning isn''t enough. Our proprietary foam-jet system targets microscopic dust clusters for pure airflow.',
  E'## Beyond Standard Cleaning\n\nMost AC service providers offer a basic wash. At ArcticFresh, we''ve developed a 12-point protocol that addresses every component of your cooling system.\n\n### The 12-Point Protocol\n\n1. **External Panel Inspection** — Visual and structural integrity check\n2. **Filter Deep Clean** — Ultrasonic wash for embedded particulates\n3. **Evaporator Coil Foam Treatment** — Proprietary bio-foam breaks down biofilm\n4. **Condenser Coil Power Jet** — High-pressure wash at 120 bar\n5. **Drain Line Flush** — Prevents water leakage and mold\n6. **Blower Wheel Extraction** — Manual disassembly for deep clean\n7. **Refrigerant Pressure Test** — Digital gauge verification\n8. **Electrical Connection Audit** — Thermal imaging for hotspots\n9. **Compressor Health Check** — Amperage and vibration analysis\n10. **Thermostat Calibration** — ±1°C accuracy verification\n11. **Air Quality Test** — PM2.5 and humidity readings\n12. **Digital Health Report** — Complete documentation with photos\n\n### Why It Matters\n\nA well-serviced AC runs 20-30% more efficiently. This translates to:\n- Lower electricity bills\n- Longer equipment life (12-15 years vs 8-10)\n- Healthier indoor air quality',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
  'Maintenance',
  'Master Tech V. Ray',
  'Lead Service Engineer',
  8,
  false,
  true
),
(
  'The Zero-Loss Initiative: Eco-Logic Cooling',
  'zero-loss-initiative-eco-logic-cooling',
  'Transitioning to R-32 refrigerants and variable speed compressors for a greener, colder future. The roadmap to carbon neutral cooling.',
  E'## The Green Cooling Imperative\n\nThe HVAC industry accounts for nearly 10% of global electricity consumption. At ArcticFresh, we''re committed to reducing this footprint through technology and innovation.\n\n### R-32: The Future Refrigerant\n\nR-32 has a Global Warming Potential (GWP) of 675 — 68% lower than the commonly used R-410A. Benefits include:\n\n- **Higher energy efficiency** — Up to 10% better COP\n- **Lower charge requirement** — Uses 30% less refrigerant by volume\n- **Non-ozone depleting** — Zero ODP rating\n\n### Variable Speed Compressors\n\nInverter technology allows compressors to modulate speed rather than cycling on/off. This results in:\n\n- 40% energy savings compared to fixed-speed units\n- More consistent temperature maintenance\n- Reduced mechanical wear\n\n### Our 2026 Eco Pledges\n\n1. All new installations use R-32 refrigerant\n2. Carbon-offset program for every service call\n3. Recycling program for old refrigerants\n4. Partnership with solar providers for hybrid cooling',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
  'Energy',
  'S. Kapoor',
  'Lead Engineer',
  10,
  false,
  true
),
(
  'Smart Air: Integrating AI with Home HVAC',
  'smart-air-integrating-ai-home-hvac',
  'How predictive cooling algorithms are learning your lifestyle to deliver 100% comfort with 40% less energy waste.',
  E'## The Smart Home Revolution Meets HVAC\n\nArtificial intelligence is transforming how we cool our homes. Modern smart thermostats don''t just follow a schedule — they learn your patterns and optimize automatically.\n\n### How AI Cooling Works\n\n1. **Pattern Recognition** — The system learns when you''re home, sleeping, or away\n2. **Weather Integration** — Pre-cools based on forecast data\n3. **Occupancy Detection** — Adjusts zone cooling based on room usage\n4. **Energy Optimization** — Runs during off-peak electricity hours\n\n### Real Results\n\nOur pilot program with 50 Ahmedabad homes showed:\n- **42% reduction** in cooling energy costs\n- **100% comfort rating** from participants\n- **3.2 month payback** on smart thermostat investment\n\n### Getting Started\n\nArcticFresh offers smart thermostat installation as part of our Premium and Corporate AMC plans. Each installation includes:\n- Wi-Fi enabled smart thermostat\n- Mobile app setup and training\n- 30-day optimization period with remote support',
  'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
  'Residential',
  'N. Tesla Jr.',
  'Innovation Lab Director',
  7,
  false,
  true
),
(
  'Future Forecast: The Next Decade of HVAC',
  'future-forecast-next-decade-hvac',
  'Magnetic refrigeration and solid-state cooling are on the horizon. What to expect in the 2030 ArcticFresh product line.',
  E'## The Cooling Technology Horizon\n\nThe HVAC industry is on the cusp of its biggest transformation since the invention of vapor-compression cooling. Here''s what''s coming.\n\n### Magnetic Refrigeration\n\nUsing the magnetocaloric effect — where certain materials heat up in a magnetic field and cool down when removed — this technology eliminates the need for chemical refrigerants entirely.\n\n**Timeline:** Commercial availability by 2030\n**Impact:** Zero GWP, 30% more efficient than current systems\n\n### Solid-State Cooling\n\nThermoelectric coolers using the Peltier effect are becoming viable for residential use. Benefits:\n- No moving parts = zero noise\n- Incredibly compact form factor\n- Precise zone-level temperature control\n\n### ArcticFresh 2030 Roadmap\n\n1. **2026-2027:** Complete R-32 transition for all installations\n2. **2027-2028:** IoT-enabled predictive maintenance for all AMC clients\n3. **2028-2029:** Pilot magnetic refrigeration units\n4. **2030:** Launch next-gen product line with solid-state options',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
  'Industry',
  'Chief Strategy Officer',
  'Executive Leadership',
  15,
  false,
  true
),
(
  'Safe-Breath Protocols for Public Spaces',
  'safe-breath-protocols-public-spaces',
  'Implementing HEPA-grade filtration in commercial AC units to ensure microbial-free air in high-traffic urban environments.',
  E'## Air Quality in Commercial Spaces\n\nIn the post-pandemic world, air quality has become a top priority for commercial spaces. HEPA-grade filtration is no longer optional — it''s expected.\n\n### The ArcticFresh Safe-Breath System\n\nOur commercial filtration upgrade includes:\n\n1. **HEPA H13 Filters** — Capture 99.97% of particles ≥ 0.3 microns\n2. **UV-C Germicidal Irradiation** — Neutralizes airborne pathogens\n3. **Activated Carbon Layer** — Removes VOCs and odors\n4. **Real-time AQI Monitoring** — Dashboard with PM2.5, CO2, and humidity readings\n\n### Who Needs This?\n\n- **Hospitals and clinics** — Mandatory for infection control\n- **Schools and universities** — Protecting students and staff\n- **Corporate offices** — Productivity improvement of 8-11%\n- **Restaurants and hotels** — Guest confidence and compliance\n\n### Cost-Benefit Analysis\n\n| Metric | Without Safe-Breath | With Safe-Breath |\n|---|---|---|\n| Employee sick days | 8.2/year | 3.1/year |\n| Energy overhead | Baseline | +12% |\n| Filter replacement | N/A | Quarterly |\n| Air quality score | 45/100 | 94/100 |',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  'Commercial',
  'Biosafety Division',
  'Environmental Health Team',
  9,
  false,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REVIEWS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    booking_id UUID REFERENCES public.bookings(id),
    service_id UUID REFERENCES public.services(id),
    technician_id UUID REFERENCES public.technicians(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_service ON public.reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_technician ON public.reviews(technician_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'booking_update', 'payment', 'promo')),
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);
