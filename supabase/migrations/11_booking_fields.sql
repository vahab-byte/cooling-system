-- Migration 11: Booking Fields
-- Assures all necessary fields exist on the bookings table for the new booking flow

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='customer_name') THEN
        ALTER TABLE bookings ADD COLUMN customer_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='customer_phone') THEN
        ALTER TABLE bookings ADD COLUMN customer_phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='preferred_time') THEN
        ALTER TABLE bookings ADD COLUMN preferred_time TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='notes') THEN
        ALTER TABLE bookings ADD COLUMN notes TEXT;
    END IF;
END $$;
