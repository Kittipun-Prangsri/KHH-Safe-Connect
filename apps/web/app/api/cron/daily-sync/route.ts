import { NextResponse } from 'next/server';
import { getSyncConfig, syncHosxpToSupabase } from '@/lib/hosxpSyncService';

export const dynamic = 'force-dynamic';

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  // No secret configured -> leave the endpoint open (matches prior
  // behavior) rather than lock out an operator who hasn't set it yet.
  if (!secret) return true;
  const url = new URL(request.url);
  const provided = request.headers.get('x-cron-secret') || url.searchParams.get('secret');
  return provided === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await getSyncConfig();

    if (!config.auto_sync_enabled) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: '⏸️ ข้ามการรัน Daily Sync เนื่องจาก Superadmin ปิดใช้งาน Auto-Sync',
        config,
      });
    }

    console.log('⏰ Automated Cron Trigger: Executing Daily Sync HOSxP -> Supabase...');
    const result = await syncHosxpToSupabase();

    return NextResponse.json({
      success: result.success,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error: any) {
    console.error('❌ Daily Cron Sync Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
