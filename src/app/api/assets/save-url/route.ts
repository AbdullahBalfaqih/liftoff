import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // server-side client

export async function POST(req: NextRequest) {
  try {
    const { asset_name, asset_url } = await req.json();

    if (!asset_name || !asset_url) {
      return NextResponse.json({ error: 'Asset name and URL are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('app_assets')
      .upsert({ asset_name, asset_url }, { onConflict: 'asset_name' })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Asset URL saved successfully.', data });

  } catch (error: any) {
    console.error('Error saving asset URL:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
