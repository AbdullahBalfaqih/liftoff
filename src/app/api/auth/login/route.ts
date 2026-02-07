import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find the user by email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // SECURITY WARNING:
    // This is a direct string comparison, which is VERY INSECURE.
    // In a real application, you would use a library like bcrypt to compare
    // the provided password with the stored hash.
    // e.g., const isValid = await bcrypt.compare(password, user.password_hash);
    const isPasswordValid = (password === user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Exclude password hash from the returned user object
    const { password_hash, ...userData } = user;

    // For now, just return success. In a real app, you would generate a JWT session token here.
    return NextResponse.json({ success: true, message: 'Login successful', user: userData });

  } catch (error: any)
  {
    console.error('Error in login route:', error);
    // The error from Supabase client is more detailed, pass it along.
    const errorMessage = error?.message || 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
