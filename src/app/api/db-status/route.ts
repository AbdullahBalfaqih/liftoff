import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Check for client-side (anon) key first, as it's a basic requirement.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey.includes('YOUR_ANON_KEY')) {
      return NextResponse.json(
        { status: 'disconnected', error: 'Supabase URL or Anonymous Key is not set correctly in .env file.' },
        { status: 500 }
      );
  }

  // Then check for server-side (service) key which is needed for this server-side check.
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
      return NextResponse.json(
        { status: 'disconnected', error: 'Supabase Service Role Key is not set in .env file. This is required for server-side validation.' },
        { status: 500 }
      );
  }
  
  try {
    // A simple query to check the connection and API validity
    // It requests the count of users, which is a lightweight operation.
    const { error } = await supabase.from('users').select('*', { count: 'exact', head: true });

    if (error) {
      // This will catch issues like incorrect keys, RLS problems, or if the table doesn't exist.
      throw error;
    }
    
    return NextResponse.json({ status: 'connected' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Supabase connection error in db-status:', error);
    return NextResponse.json({ status: 'disconnected', error: errorMessage }, { status: 500 });
  }
}
