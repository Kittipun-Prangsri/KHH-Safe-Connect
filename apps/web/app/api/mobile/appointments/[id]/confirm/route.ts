import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, verifyMobileSession } from '@/lib/mobileSession';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * Marks an appointment confirmed in the Supabase cache only.
 *
 * IMPORTANT: this does NOT write back into HOSxP — nothing in this
 * codebase does yet (checked: no INSERT/UPDATE against the HOSxP MySQL
 * pool exists anywhere). Confirmation here is a patient-facing signal
 * staff can see in the cache; the next daily sync will NOT overwrite it
 * back to 'upcoming' since the sync only ever inserts rows with
 * nextdate >= today and upserts on id, so an existing 'confirmed' row
 * keeps its status unless HOSxP's own nextdate changes. A real
 * HOSxP write-back requires a follow-up task against apps/api (the
 * only service with HOSxP write access already scoped there).
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = verifyMobileSession(getBearerToken(req));
  if (!session) {
    return NextResponse.json({ status: 'error', message: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: 'error', message: 'ระบบไม่พร้อมใช้งานชั่วคราว' }, { status: 503 });
  }

  const supabase = getSupabaseAdminClient();
  const { data: existing, error: fetchError } = await supabase
    .from('hosxp_appointments_cache')
    .select('id, hn, next_date, next_time, clinic_name, doctor_name')
    .eq('id', params.id)
    .single();

  if (fetchError || !existing || existing.hn !== session.hn) {
    return NextResponse.json({ status: 'error', message: 'ไม่พบนัดหมายนี้' }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from('hosxp_appointments_cache')
    .update({ status: 'confirmed' })
    .eq('id', params.id);

  if (updateError) {
    return NextResponse.json({ status: 'error', message: 'ไม่สามารถยืนยันนัดหมายได้' }, { status: 500 });
  }

  return NextResponse.json({
    status: 'success',
    data: {
      id: existing.id,
      date: existing.next_date,
      time: existing.next_time || '08:30 น.',
      clinic: existing.clinic_name || 'คลินิก NCDs',
      doctor: existing.doctor_name || undefined,
      status: 'confirmed',
      checkinCode: `KHH-CHECKIN:${existing.hn}:${existing.id}`,
    },
  });
}
