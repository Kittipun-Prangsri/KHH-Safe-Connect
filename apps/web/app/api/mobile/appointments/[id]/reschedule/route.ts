import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, verifyMobileSession } from '@/lib/mobileSession';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabaseClient';
import { notifyStaffOnIncomingPatientMessage } from '@/lib/staffNotificationService';

export const dynamic = 'force-dynamic';

/**
 * Records a reschedule request in the Supabase cache and pings staff on
 * the same instant-alert channel the LINE bot uses. Same HOSxP
 * write-back limitation as the confirm route — this does not move the
 * appointment in HOSxP itself, staff still action the actual reschedule
 * there and the next sync will pick up the corrected nextdate.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = verifyMobileSession(getBearerToken(req));
  if (!session) {
    return NextResponse.json({ status: 'error', message: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: 'error', message: 'ระบบไม่พร้อมใช้งานชั่วคราว' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const reason = String(body.reason || '').trim().slice(0, 500);

  const supabase = getSupabaseAdminClient();
  const { data: existing, error: fetchError } = await supabase
    .from('hosxp_appointments_cache')
    .select('id, hn, patient_name, next_date, next_time, clinic_name, doctor_name')
    .eq('id', params.id)
    .single();

  if (fetchError || !existing || existing.hn !== session.hn) {
    return NextResponse.json({ status: 'error', message: 'ไม่พบนัดหมายนี้' }, { status: 404 });
  }

  const noteText = reason
    ? `[ขอเลื่อนนัดจากแอปมือถือ] ${reason}`
    : '[ขอเลื่อนนัดจากแอปมือถือ] ไม่ได้ระบุเหตุผล';

  const { error: updateError } = await supabase
    .from('hosxp_appointments_cache')
    .update({ status: 'rescheduled', note: noteText })
    .eq('id', params.id);

  if (updateError) {
    return NextResponse.json({ status: 'error', message: 'ไม่สามารถส่งคำขอเลื่อนนัดได้' }, { status: 500 });
  }

  await notifyStaffOnIncomingPatientMessage({
    lineUserId: 'MOBILE-APP',
    hn: existing.hn,
    patientName: existing.patient_name || 'ผู้ป่วย',
    text: `ขอเลื่อนนัด ${existing.next_date} (${existing.clinic_name || 'คลินิก NCDs'})${reason ? ` — เหตุผล: ${reason}` : ''}`,
    category: '🗓️ ขอนัดหมาย/เลื่อนนัด',
  }).catch((err) => console.warn('⚠️ Staff alert failed (mobile reschedule):', err));

  return NextResponse.json({
    status: 'success',
    data: {
      id: existing.id,
      date: existing.next_date,
      time: existing.next_time || '08:30 น.',
      clinic: existing.clinic_name || 'คลินิก NCDs',
      doctor: existing.doctor_name || undefined,
      status: 'rescheduled',
      checkinCode: `KHH-CHECKIN:${existing.hn}:${existing.id}`,
    },
  });
}
