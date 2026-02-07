import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create a single, server-side-only, Supabase client with the service role key.
// This client has admin privileges and should ONLY be used in server-side code (API routes, Server Actions).
// The API routes are responsible for checking if the required environment variables are present.
export const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    // This is a server-side client, so we don't want to store session data in cookies.
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  }
})
