import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Ensure server environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey || supabaseServiceRoleKey.includes('YOUR_SERVICE_ROLE_KEY')) {
    return NextResponse.json(
      { error: 'Supabase server credentials are not configured correctly.' },
      { status: 500 }
    );
  }

  try {
    const [
      userResult,
      companionResult,
      transactionsResult,
      budgetsResult,
      challengesResult,
      userChallengesResult
    ] = await Promise.allSettled([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('companions').select('*').eq('user_id', userId).single(),
      supabase.from('transactions').select('*').eq('user_id', userId),
      supabase.from('budgets').select('*').eq('user_id', userId),
      supabase.from('challenges').select('*').eq('is_active', true),
      supabase.from('user_challenges').select('challenge_id').eq('user_id', userId).not('completed_at', 'is', null)
    ]);

    const getResultData = (result: PromiseSettledResult<any>) => {
      if (result.status === 'rejected') {
        console.error("Failed to fetch data:", result.reason);
        // For single() queries, a rejection can mean "no rows found", which isn't a fatal error.
        if (result.reason.code === 'PGRST116') return null; 
        throw new Error(result.reason.message);
      }
      return result.value.data;
    };
    
    const getResultError = (result: PromiseSettledResult<any>) => {
        if (result.status === 'rejected' && result.reason.code !== 'PGRST116') {
            return result.reason;
        }
        return result.status === 'fulfilled' ? result.value.error : null;
    }

    const userError = getResultError(userResult);
    if(userError) throw userError;

    const user = getResultData(userResult);
    const companion = getResultData(companionResult);
    const transactions = getResultData(transactionsResult) || [];
    const budgets = getResultData(budgetsResult) || [];
    const challenges = getResultData(challengesResult) || [];
    const userChallenges = getResultData(userChallengesResult) || [];
    
    return NextResponse.json({
      user,
      companion,
      transactions,
      budgets,
      challenges,
      userChallenges
    });

  } catch (error: any) {
    console.error('Error fetching user data in API route:', error);
    return NextResponse.json({ error: error.message || 'An unknown server error occurred' }, { status: 500 });
  }
}
