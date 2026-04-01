-- Seed Data for Technicians and Spare Parts
INSERT INTO technicians (name, phone, rating, jobs_completed, experience_years, status) VALUES
('Arjun Mehta', '+91 98765 43210', 4.9, 124, 8, 'available'),
('Priya Sharma', '+91 98222 11111', 4.8, 89, 5, 'busy'),
('Suresh Kumar', '+91 97777 66666', 4.7, 56, 4, 'available');

INSERT INTO spare_parts (name, description, price, stock, category) VALUES
('Premium Dust Filters', 'Replaces old filters with HEPA-grade materials for cleaner air.', 299, 50, 'filter'),
('Gas Top-up Assessment', 'Comprehensive diagnostic for refrigerant leaks and minor refill.', 1199, 100, 'gas'),
('Capacitor Replacement', '35/45 MFD high-quality capacitor for compressor starting.', 450, 30, 'electrical'),
('Copper Pipe (per meter)', 'High-grade insulated copper piping for installation.', 850, 200, 'piping');
