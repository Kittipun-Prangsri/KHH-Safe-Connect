import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, verifyMobileSession } from '@/lib/mobileSession';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * Only BMI, blood pressure and FBS come back here — those are the only
 * fields hosxpSyncService actually pulls from HOSxP (opdscreen) today.
 * The mobile UI's VitalsScreen also has HbA1c/eGFR gauges, but those
 * need lab-result tables (lab_order/lab_result or similar) that the
 * sync query never touches, so we don't fabricate values for them —
 * the client should just render whatever this returns and leave those
 * two gauges out rather than show fake numbers. Extending the sync to
 * pull real lab history is a separate follow-up.
 */
function statusFor(value: number, good: [number, number], watch: [number, number]): 'good' | 'watch' | 'risk' {
  if (value >= good[0] && value <= good[1]) return 'good';
  if (value >= watch[0] && value <= watch[1]) return 'watch';
  return 'risk';
}

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
    .from('hosxp_patients_cache')
    .select('bmi, bps, bpd, fbs, last_vst_date')
    .eq('hn', session.hn)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ status: 'success', data: [] });
  }

  const recordedAt = data.last_vst_date || new Date().toISOString().slice(0, 10);
  const readings: any[] = [];

  if (data.bmi != null) {
    const value = Number(data.bmi);
    readings.push({
      label: 'BMI',
      value,
      unit: 'kg/m²',
      min: 10,
      max: 40,
      targetMin: 18.5,
      targetMax: 22.9,
      status: statusFor(value, [18.5, 22.9], [17, 27.4]),
      recordedAt,
    });
  }

  if (data.bps != null) {
    const value = Number(data.bps);
    readings.push({
      label: 'BloodPressure',
      value,
      unit: 'mmHg',
      min: 70,
      max: 200,
      targetMin: 90,
      targetMax: 130,
      status: statusFor(value, [90, 130], [0, 139]),
      recordedAt,
    });
  }

  if (data.fbs != null) {
    const value = Number(data.fbs);
    readings.push({
      label: 'FBS',
      value,
      unit: 'mg/dL',
      min: 50,
      max: 300,
      targetMin: 70,
      targetMax: 100,
      status: statusFor(value, [0, 100], [101, 125]),
      recordedAt,
    });
  }

  return NextResponse.json({ status: 'success', data: readings });
}
