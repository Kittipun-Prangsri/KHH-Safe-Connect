import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// Demo seed data for carb wheel logs
const MOCK_CARB_LOGS = [
  {
    id: 'carb-log-1',
    patient_id: 'patient-101',
    patient_name: 'นายสมชาย ใจดี',
    hn: 'HN-67001',
    meal_type: 'breakfast',
    photo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
    carb_score: 4.5,
    portion_211_correct: true,
    evaluator_name: 'พญ. วรางคณา (นักโภชนาการ)',
    nutritionist_notes: 'จัดจาน 2:1:1 ได้สมบูรณ์ คาร์บ 1 ทัพพี เน้นผักใบเขียว',
    alert_status: 'green',
    submitted_at: '2026-09-07T07:30:00Z',
    evaluated_at: '2026-09-07T08:15:00Z'
  },
  {
    id: 'carb-log-2',
    patient_id: 'patient-102',
    patient_name: 'นางสมศรี มีสุข',
    hn: 'HN-67002',
    meal_type: 'lunch',
    photo_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60',
    carb_score: 2.0,
    portion_211_correct: false,
    evaluator_name: 'พยาบาลสมหญิง',
    nutritionist_notes: 'ทานข้าวเกิน 3 ทัพพี และมีน้ำหวานผสมคาร์บแอบแฝง ควรลดยาน้ำหวานและทานผักเพิ่ม',
    alert_status: 'red',
    submitted_at: '2026-09-07T12:30:00Z',
    evaluated_at: '2026-09-07T13:10:00Z'
  },
  {
    id: 'carb-log-3',
    patient_id: 'patient-103',
    patient_name: 'นายประเสริฐ รักดี',
    hn: 'HN-67003',
    meal_type: 'dinner',
    photo_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60',
    carb_score: 3.2,
    portion_211_correct: true,
    evaluator_name: 'นักโภชนาการกิตติ',
    nutritionist_notes: 'ผักครบถ้วน แต่ทานผลไม้ที่มีแป้ง/น้ำตาลสูง (เงาะ 6 ลูก)',
    alert_status: 'yellow',
    submitted_at: '2026-09-07T18:00:00Z',
    evaluated_at: '2026-09-07T19:00:00Z'
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const alertStatus = searchParams.get('alertStatus');

    const supabase = getSupabaseAdminClient();
    let query = supabase.from('carb_wheel_logs').select('*').order('submitted_at', { ascending: false });

    if (patientId) query = query.eq('patient_id', patientId);
    if (alertStatus) query = query.eq('alert_status', alertStatus);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback demo data
      let filtered = MOCK_CARB_LOGS;
      if (patientId) filtered = filtered.filter(l => l.patient_id === patientId);
      if (alertStatus) filtered = filtered.filter(l => l.alert_status === alertStatus);
      return NextResponse.json({ success: true, logs: filtered });
    }

    return NextResponse.json({ success: true, logs: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, patient_id, meal_type, photo_url, carb_score, nutritionist_notes, portion_211_correct } = body;

    const supabase = getSupabaseAdminClient();

    // Calculate Alert Status: >= 4.0 GREEN, 2.5-3.9 YELLOW, < 2.5 RED
    let alertStatus: 'green' | 'yellow' | 'red' = 'green';
    if (carb_score !== undefined) {
      if (carb_score < 2.5) alertStatus = 'red';
      else if (carb_score < 4.0) alertStatus = 'yellow';
    }

    const payload = {
      patient_id: patient_id || 'demo-patient-001',
      meal_type: meal_type || 'lunch',
      photo_url: photo_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
      carb_score: carb_score || 4.5,
      portion_211_correct: portion_211_correct !== undefined ? portion_211_correct : true,
      nutritionist_notes: nutritionist_notes || 'ประเมินแล้ว ตามวงล้อนับคาร์บ 2:1:1',
      alert_status: alertStatus,
      evaluated_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
    };

    if (id) {
      await supabase.from('carb_wheel_logs').update(payload).eq('id', id);
    } else {
      await supabase.from('carb_wheel_logs').insert(payload);
    }

    return NextResponse.json({
      success: true,
      message: alertStatus === 'red' 
        ? '⚠️ เตือนภัยสีแดง! ระบบได้ส่งการแจ้งเตือนไปยังพยาบาล NCDs แล้ว' 
        : 'บันทึกการประเมินวงล้อนับคาร์บเรียบร้อยแล้ว',
      alert_status: alertStatus,
      log: payload
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
