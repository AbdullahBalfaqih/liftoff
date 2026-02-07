import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // This will prevent the app from building if the keys are missing.
    // It's a good practice for client-side code that depends on these vars.
    throw new Error('Supabase URL or Anonymous Key is not set in client-side environment variables.');
}

// Create a single, client-side, Supabase client with the anon key.
// This is safe to use in browsers.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
