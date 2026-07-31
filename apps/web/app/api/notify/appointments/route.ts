import { NextRequest, NextResponse } from 'next/server';
import { sendLineAppointmentReminder } from '@/lib/lineMessagingService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Demo / Custom test data or query parameter
    const patientData = {
      hn: body.hn || 'HN-98302',
      patientName: body.patientName || 'นายสมชาย ดีเลิศ',
      appointmentDate: body.appointmentDate || '1 สิงหาคม 2026',
      appointmentTime: body.appointmentTime || '09:00 น.',
      clinicName: body.clinicName || 'คลินิกเบาหวาน',
      doctorName: body.doctorName || 'พญ. วรรณภา จิตดี',
      preparationNotes: body.preparationNotes || 'งดน้ำและอาหารหลัง 20:00 น. คืนนี้ (เพื่อเจาะเลือดตรวจน้ำตาล)',
    };

    const targetLineUserId = body.lineUserId || process.env.TEST_LINE_USER_ID || 'U1234567890abcdef1234567890abcdef';

    const result = await sendLineAppointmentReminder(targetLineUserId, patientData);

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      recipient: patientData.patientName,
      lineResult: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Can be called by Vercel Cron at 08:00 AM daily
  const testPatient = {
    hn: 'HN-98302',
    patientName: 'นายสมชาย ดีเลิศ',
    appointmentDate: '1 สิงหาคม 2026',
    appointmentTime: '09:00 น.',
    clinicName: 'คลินิกเบาหวาน',
    doctorName: 'พญ. วรรณภา จิตดี',
    preparationNotes: 'งดน้ำและอาหารหลัง 20:00 น. คืนนี้ (เพื่อเจาะเลือดตรวจน้ำตาล)',
  };

  const result = await sendLineAppointmentReminder(
    process.env.TEST_LINE_USER_ID || 'U_DEMO_LINE_USER',
    testPatient
  );

  return NextResponse.json({
    status: 'cron_executed',
    scheduledTime: '08:00 AM',
    itemsProcessed: 1,
    result,
  });
}
