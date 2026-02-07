import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // server-side client

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('app_assets')
      .select('asset_name, asset_url');

    if (error) {
      throw error;
    }

    // Transform the array into a key-value object
    const assetsMap = data.reduce((acc, asset) => {
      acc[asset.asset_name] = asset.asset_url;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(assetsMap);

  } catch (error: any) {
    console.error('Error fetching app assets:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
