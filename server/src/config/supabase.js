import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
// We should eventually use the SERVICE_ROLE_KEY for the backend admin tasks
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your_anon_key_here';

export const supabase = createClient(supabaseUrl, supabaseKey);
