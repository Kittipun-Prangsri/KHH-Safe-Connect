import { NextResponse } from 'next/server';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: 'success', data: [] });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('health_articles')
    .select('id, category, title_th, summary_th, read_minutes')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ /api/mobile/health-articles error:', error);
    return NextResponse.json({ status: 'success', data: [] });
  }

  const articles = (data || []).map((a: any) => ({
    id: a.id,
    category: a.category,
    titleTh: a.title_th,
    summaryTh: a.summary_th,
  }));

  return NextResponse.json({ status: 'success', data: articles });
}
