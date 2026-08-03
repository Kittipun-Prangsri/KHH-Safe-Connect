import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const MOCK_TRIAGE_DATA = {
  summary: {
    total_active_patients: 128,
    green_count: 84,
    yellow_count: 32,
    red_count: 12,
    weekly_avg_nutrition_score: 4.12
  },
  red_patients: [
    {
      id: 'patient-102',
      hn: 'HN-67002',
      name: 'นางสมศรี มีสุข',
      age: 58,
      disease: 'DM Type 2 + HT',
      phone: '081-234-5678',
      village: 'หมู่ 3 ต.คลองหาด',
      weekly_nutrition_score: 1.8,
      carb_miss_streak: 3,
      last_meal_photo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60',
      reason: 'ทานคาร์บเกินเกณฑ์บ่อยครั้ง (หลุดเกณฑ์ 3 มื้อติดต่อกัน)',
      last_active: '10 นาทีที่แล้ว',
      action_needed: 'ด่วน: พยาบาล/อสม. วิดีโอคอล หรือลงเยี่ยมบ้าน'
    },
    {
      id: 'patient-105',
      hn: 'HN-67005',
      name: 'นายบุญมี เพียรชอบ',
      age: 62,
      disease: 'DM Type 2',
      phone: '089-987-6543',
      village: 'หมู่ 1 ต.ไทยเจริญ',
      weekly_nutrition_score: 2.1,
      carb_miss_streak: 2,
      last_meal_photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
      reason: 'ระดับคาร์บแอบแฝงสูงต่อเนื่อง + งดทานผัก 2:1:1',
      last_active: '1 ชั่วโมงที่แล้ว',
      action_needed: 'แนะนำปรับสัดส่วนอาหารวงล้อนับคาร์บ'
    }
  ],
  yellow_patients: [
    {
      id: 'patient-103',
      hn: 'HN-67003',
      name: 'นายประเสริฐ รักดี',
      age: 51,
      disease: 'DM Type 2',
      phone: '084-555-1234',
      village: 'หมู่ 4 ต.คลองหาด',
      weekly_nutrition_score: 3.2,
      reason: 'ทานผลไม้ที่มีคาร์บสูงเกินกำหนด 2 วันติด',
      last_active: '3 ชั่วโมงที่แล้ว',
      action_needed: 'ส่งข้อความความรู้ผลไม้คาร์บสูงทาง LINE'
    }
  ],
  green_patients: [
    {
      id: 'patient-101',
      hn: 'HN-67001',
      name: 'นายสมชาย ใจดี',
      age: 45,
      disease: 'DM Remission Candidate',
      phone: '082-111-2233',
      village: 'หมู่ 2 ต.คลองหาด',
      weekly_nutrition_score: 4.8,
      streak_days: 14,
      last_active: '5 นาทีที่แล้ว',
      action_needed: 'คุมคาร์บได้ดีเยี่ยม - ส่งความชมเชย + 50 Bonus XP'
    }
  ]
};

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Attempt querying database
    const { data: logs } = await supabase.from('carb_wheel_logs').select('*');

    if (!logs || logs.length === 0) {
      return NextResponse.json({ success: true, triage: MOCK_TRIAGE_DATA });
    }

    return NextResponse.json({ success: true, triage: MOCK_TRIAGE_DATA });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
