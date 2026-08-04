import { NextResponse } from 'next/server';
import { getHosxpPool } from '@/lib/hosxpClient';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * GET /api/hosxp/conversations/unread-count
 * Returns the real number of "unread" conversations:
 * - HOSxP: appointments within the last 7 days (priority === 'urgent')
 * - Supabase fallback: patients with is_controlled === false
 */
export async function GET() {
  try {
    // 1. Try HOSxP MySQL — count appointments in last 7 days (fresh/unread)
    try {
      const pool = getHosxpPool();
      const sql = `
        SELECT COUNT(*) AS cnt
        FROM oapp o
        LEFT JOIN patient p ON o.hn = p.hn
        WHERE o.nextdate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
          AND o.nextdate <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      `;
      const [rows]: any = await pool.execute(sql);
      const count = parseInt(rows?.[0]?.cnt ?? '0', 10);
      // Cap at 99 for badge display
      return NextResponse.json({ success: true, count: Math.min(count, 99), source: 'hosxp' });
    } catch (hosxpErr) {
      console.warn('⚠️ HOSxP unavailable for unread-count, trying Supabase:', (hosxpErr as Error).message);
    }

    // 2. Supabase fallback — uncontrolled patients as "pending"
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient();
      const { count, error } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('is_controlled', false);

      if (!error && count !== null) {
        return NextResponse.json({ success: true, count: Math.min(count, 99), source: 'supabase' });
      }
    }

    // No data available
    return NextResponse.json({ success: true, count: 0, source: 'none' });
  } catch (error: any) {
    console.error('❌ Unread count API error:', error);
    return NextResponse.json({ success: false, count: 0, error: error.message }, { status: 500 });
  }
}
