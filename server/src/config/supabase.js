import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Server-side: prefer non-VITE_ prefixed vars, fallback to VITE_ for backward compat
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'your_anon_key_here';

export const supabase = createClient(supabaseUrl, supabaseKey);
