import { NextRequest, NextResponse } from 'next/server';
import { verifyPatientBirthYear } from '@/lib/lineUserService';
import { createMobileSession } from '@/lib/mobileSession';

export const dynamic = 'force-dynamic';

/**
 * Step 2 of mobile registration: 4-digit Buddhist-era birth year check.
 *
 * The mobile screen calls this "PDPA PIN" (matching the existing
 * PdpaPinScreen copy/types already shipped in khh-mobile), but the
 * check itself is the same birth-year verification the LINE bot already
 * uses (lineUserService.verifyPatientBirthYear) — same security
 * question asked consistently across both channels, one implementation.
 * A real PIN (hashed, server-set) is intentionally not introduced here;
 * see khh-mobile/README.md's own note that the PIN must be hashed and
 * rate-limited — that's still open and tracked separately, this route
 * only wires up the verification step that already exists.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const hn = String(body.hn || '').trim();
  const pin = String(body.pin || '').replace(/[^0-9]/g, '');

  if (!hn || pin.length < 4) {
    return NextResponse.json({ status: 'error', message: 'กรุณาระบุ HN และรหัส 4 หลัก' }, { status: 400 });
  }

  const result = await verifyPatientBirthYear(hn, pin.slice(0, 4));

  if (!result.valid) {
    return NextResponse.json(
      { status: 'error', message: 'รหัสไม่ถูกต้อง กรุณาตรวจสอบปีเกิด (พ.ศ.) 4 หลักอีกครั้ง' },
      { status: 401 }
    );
  }

  const token = createMobileSession(result.hn, 'patient');

  return NextResponse.json({
    status: 'success',
    token,
    patient: {
      hn: result.hn,
      name: result.patientName,
      role: 'patient',
      pdpaVerified: true,
    },
  });
}
