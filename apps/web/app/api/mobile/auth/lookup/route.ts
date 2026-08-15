import { NextRequest, NextResponse } from 'next/server';
import { findPatientByHnOrCidInHosxp } from '@/lib/lineUserService';

export const dynamic = 'force-dynamic';

/**
 * Step 1 of mobile registration: CID or HN -> patient match.
 * Reuses the exact same HOSxP/Supabase lookup the LINE bot uses, so a
 * patient gets the same result whichever channel they register from.
 * Never returns PDPA-sensitive fields (cid, phone) — only enough to
 * confirm a match and drive the birth-year verification step next.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query = String(body.query || body.cidOrHn || '').trim();

  if (!query) {
    return NextResponse.json({ status: 'error', message: 'กรุณาระบุเลขบัตรประชาชนหรือ HN' }, { status: 400 });
  }

  const match = await findPatientByHnOrCidInHosxp(query);

  if (!match.found) {
    return NextResponse.json(
      { status: 'error', message: `ไม่พบข้อมูลหมายเลข "${query}" ในระบบผู้ป่วยโรงพยาบาลคลองหาด` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: 'success',
    patient: {
      hn: match.hn,
      name: match.patientName,
      role: 'patient',
      pdpaVerified: false,
    },
    // Birth-year verification (same as LINE flow) always required before
    // a session is issued — pdpaPinRequired names the step for the
    // mobile client's existing types, the check itself is birth year.
    pdpaPinRequired: true,
  });
}
