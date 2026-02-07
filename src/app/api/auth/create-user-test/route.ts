import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  // Gracefully handle missing server-side configuration
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceRoleKey || supabaseServiceRoleKey.includes('YOUR_SERVICE_ROLE_KEY')) {
      return NextResponse.json(
          { error: 'Server configuration error: The SUPABASE_SERVICE_ROLE_KEY is missing from your .env file. This is required to create users.' },
          { status: 500 }
      );
  }

  try {
    const { fullName, date_of_birth, email, password_hash, monthly_income, monthly_savings_goal } = await req.json();

    // 1. Create the user
    const { data: createdUsers, error: userError } = await supabase
      .from('users')
      .insert([
        { 
          full_name: fullName,
          date_of_birth: date_of_birth,
          email: email,
          password_hash: password_hash,
          monthly_income: monthly_income || null,
          monthly_savings_goal: monthly_savings_goal || null
        }
      ])
      .select();

    if (userError) throw userError;
    if (!createdUsers || createdUsers.length === 0) {
      throw new Error("User was created but could not be retrieved.");
    }
    const newUser = createdUsers[0];

    // Check for monthly income and add it as the first transaction
    if (newUser.monthly_income && newUser.monthly_income > 0) {
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: newUser.id,
          description: "Initial Monthly Salary",
          amount: newUser.monthly_income,
          type: 'income',
          category: 'Salary',
        });
      
      if (transactionError) {
        // Log this error but don't fail the entire user creation process
        console.error('Failed to add initial salary transaction:', transactionError);
      }
    }

    // 2. Create the companion for the new user
    const { error: companionError } = await supabase
      .from('companions')
      .insert([{ user_id: newUser.id }]); // Uses default values from schema for other fields

    if (companionError) {
      // Log the error but don't fail the request, as the user was still created.
      console.error('Failed to create companion for new user:', companionError);
    }
    
    // In a real app, you would log the user in here and return a session token.
    // For this test, we return the user data so the client can store it.
    return NextResponse.json({ success: true, message: "User and companion created successfully.", data: newUser });

  } catch (error: any) {
    console.error('Error in create-user-test route:', error);
    const errorMessage = error?.message || 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
