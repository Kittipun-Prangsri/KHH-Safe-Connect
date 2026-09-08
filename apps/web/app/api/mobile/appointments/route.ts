import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, verifyMobileSession } from '@/lib/mobileSession';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = verifyMobileSession(getBearerToken(req));
  if (!session) {
    return NextResponse.json({ status: 'error', message: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: 'success', data: [] });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('hosxp_appointments_cache')
    .select('*')
    .eq('hn', session.hn)
    .order('next_date', { ascending: true });

  if (error) {
    console.error('❌ /api/mobile/appointments error:', error);
    return NextResponse.json({ status: 'error', message: 'ไม่สามารถโหลดข้อมูลนัดหมายได้' }, { status: 500 });
  }

  const appointments = (data || []).map((r: any) => ({
    id: String(r.id),
    date: r.next_date,
    time: r.next_time || '08:30 น.',
    clinic: r.clinic_name || 'คลินิก NCDs',
    doctor: r.doctor_name || undefined,
    status: r.status || 'upcoming',
    checkinCode: `KHH-CHECKIN:${r.hn}:${r.id}`,
  }));

  return NextResponse.json({ status: 'success', data: appointments });
}
