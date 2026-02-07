import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { 
      userId, 
      monthly_income, 
      monthly_savings_goal,
      autoDeposit,
      salaryAmount,
      payday
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const updateData: { [key: string]: any } = {
      updated_at: new Date().toISOString(),
    };

    if (monthly_income !== undefined) {
      updateData.monthly_income = monthly_income;
    }
    if (monthly_savings_goal !== undefined) {
      updateData.monthly_savings_goal = monthly_savings_goal;
    }

    if (autoDeposit !== undefined) {
        updateData.auto_deposit_enabled = autoDeposit;
        if(autoDeposit) {
            updateData.auto_deposit_amount = salaryAmount;
            updateData.auto_deposit_day = payday;
        } else {
            updateData.auto_deposit_amount = null;
            updateData.auto_deposit_day = null;
        }
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully.', user: data });

  } catch (error: any) {
    console.error('Error updating user settings:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
