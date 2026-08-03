import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const MOCK_ENGAGEMENT_ANALYTICS = {
  rich_menu_ctr: [
    { category: 'หมวด 1: วงล้อนับคาร์บ (อาหาร)', click_count: 1420, ctr_percentage: 42.5 },
    { category: 'หมวด 2: ความเครียดและการนอน', click_count: 480, ctr_percentage: 14.3 },
    { category: 'หมวด 3: การใช้ยา & แจ้งเตือน', click_count: 910, ctr_percentage: 27.2 },
    { category: 'หมวด 4: นัดหมายแพทย์อัตโนมัติ', click_count: 360, ctr_percentage: 10.8 },
    { category: 'หมวด 5: แบบประเมินสุขภาพจิต (2Q/9Q)', click_count: 170, ctr_percentage: 5.2 }
  ],
  submission_metrics: {
    total_meal_photos_this_month: 856,
    avg_photos_per_patient_per_week: 4.8,
    mental_health_quiz_completion_rate: 78.4,
    appointment_response_rate: 91.2, // automated confirm/reschedule vs old manual phone call (62%)
    manual_call_old_baseline: 62.0
  },
  clinical_outbound_correlation: [
    {
      group: 'กลุ่มผู้ใช้งานคุมคาร์บสม่ำเสมอ (🟢)',
      patient_count: 84,
      avg_weekly_score: 4.6,
      hba1c_reduction: -1.4, // HbA1c ลดลง 1.4%
      weight_loss_kg: -3.2,
      remission_rate_percent: 34.5
    },
    {
      group: 'กลุ่มผู้ใช้งานปานกลาง (🟡)',
      patient_count: 32,
      avg_weekly_score: 3.2,
      hba1c_reduction: -0.6,
      weight_loss_kg: -1.1,
      remission_rate_percent: 12.5
    },
    {
      group: 'กลุ่มหลุดเกณฑ์บ่อย (🔴)',
      patient_count: 12,
      avg_weekly_score: 1.9,
      hba1c_reduction: +0.2,
      weight_loss_kg: +0.4,
      remission_rate_percent: 0.0
    }
  ]
};

export async function GET(request: Request) {
  try {
    return NextResponse.json({ success: true, analytics: MOCK_ENGAGEMENT_ANALYTICS });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, lineUserId, eventType, richMenuCategory, metadata } = body;

    const supabase = getSupabaseAdminClient();
    await supabase.from('platform_engagement_logs').insert({
      patient_id: patientId || null,
      line_user_id: lineUserId || null,
      event_type: eventType || 'rich_menu_click',
      rich_menu_category: richMenuCategory || 'carb_wheel',
      metadata: metadata || {}
    });

    return NextResponse.json({ success: true, message: 'Engagement log recorded' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
