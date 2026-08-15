import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, verifyMobileSession } from '@/lib/mobileSession';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * Badges are derived on the fly from real synced signals — no stored
 * badge table, no fabricated streak data. hosxp_patients_cache only
 * carries a single latest snapshot (no visit history), so anything
 * that would need a streak — "3 on-time visits in a row" from the
 * original khh-mobile mock data — genuinely can't be computed yet and
 * is left out rather than faked. Only what the current snapshot
 * actually supports is returned.
 */
export async function GET(req: NextRequest) {
  const session = verifyMobileSession(getBearerToken(req));
  if (!session) {
    return NextResponse.json({ status: 'error', message: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: 'success', data: [] });
  }

  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from('hosxp_patients_cache')
    .select('clinic_code, is_controlled, control_status_text, last_vst_date, reg_date')
    .eq('hn', session.hn)
    .maybeSingle();

  const badges: any[] = [];

  if (data) {
    if (data.is_controlled) {
      const isDm = data.clinic_code === '001';
      badges.push({
        id: 'control-good',
        titleTh: isDm ? 'ควบคุมน้ำตาลได้ดี' : 'ควบคุมความดันได้ดี',
        emoji: isDm ? '🩸' : '❤️',
        earnedAt: data.last_vst_date || new Date().toISOString().slice(0, 10),
        criteria: data.control_status_text || 'ผลตรวจล่าสุดอยู่ในเกณฑ์ควบคุมได้ดี',
      });
    }

    if (data.reg_date) {
      badges.push({
        id: 'registered',
        titleTh: 'ลงทะเบียนคลินิก NCDs',
        emoji: '📋',
        earnedAt: data.reg_date,
        criteria: 'ลงทะเบียนเข้ารับการดูแลต่อเนื่องกับคลินิกโรคเรื้อรัง',
      });
    }
  }

  return NextResponse.json({ status: 'success', data: badges });
}
