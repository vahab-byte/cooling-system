-- Seed Data for ArcticFresh Supabase Database

-- Initial Services
INSERT INTO services (category, title, description, price, original_price, features, icon, tag) VALUES
('service', 'Standard Jet Service', 'High-pressure water cleaning for optimal airflow and cooling efficiency.', 599, 899, ARRAY['Filter cleaning', 'Drain pipe check', 'Cooling coil wash'], 'Wind', 'SAVE 30%'),
('service', 'Foam Deep Clean', 'Antibacterial foam wash to remove embedded dust and allergens.', 999, 1299, ARRAY['Antibacterial treatment', 'Fins straightening', 'Blower cleaning'], 'Snowflake', 'POPULAR'),
('repair', 'Full Gas Refilling', 'Complete refrigerant recharge with leak detection and repair.', 2499, 3499, ARRAY['Leak identification', 'Gas pressure test', 'Performance check'], 'ShieldCheck', 'BEST VALUE'),
('install', 'Split AC Installation', 'Professional wall mounting and piping connectivity with warranty.', 1499, 2199, ARRAY['Wall bracket mount', 'Gas pressure check', 'Final test run'], 'Wrench', NULL);

-- Initial Testimonials
INSERT INTO testimonials (name, role, comment, rating) VALUES
('Rajesh Patel', 'Home Owner', 'The deep cleaning service was amazing. My AC feels like new and the technician was very professional.', 5),
('Sneha Sharma', 'Office Manager', 'We use their AMC for our entire office. Best response time in Ahmedabad!', 5),
('Amit Mehta', 'Architect', 'Transparent pricing and genuine spare parts. Highly recommend ArcticFresh.', 4);
