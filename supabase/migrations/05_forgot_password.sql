-- Add reset_otp columns to profiles table for forgot password flow
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS reset_otp TEXT,
  ADD COLUMN IF NOT EXISTS reset_otp_expires TIMESTAMPTZ;
