import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  console.log('Testing Supabase client with:')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey)
  
  try {
    const { data, error } = await supabase.from('services').select('*').limit(1)
    if (error) {
      console.error('Supabase client error:', error.message)
    } else {
      console.log('Supabase client success! Data:', data)
    }
  } catch (err) {
    console.error('Supabase client exception:', err.message)
  }
}

test()
