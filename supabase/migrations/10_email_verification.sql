-- Email Verification columns for profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_otp TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_otp_expires TIMESTAMP WITH TIME ZONE;
