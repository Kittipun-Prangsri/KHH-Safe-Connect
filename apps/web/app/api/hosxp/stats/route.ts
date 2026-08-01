import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

function getHosxpPool() {
  return mysql.createPool({
    host: process.env.HOSXP_DB_HOST || '192.168.1.4',
    port: Number(process.env.HOSXP_DB_PORT) || 3306,
    user: process.env.HOSXP_DB_USER || 'Khos',
    password: process.env.HOSXP_DB_PASSWORD || 'KHzjkowfh',
    database: process.env.HOSXP_DB_NAME || 'hos',
    charset: 'tis620',
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export async function GET() {
  try {
    const pool = getHosxpPool();

    // 1. Total Patients in HOSxP
    const [patientCount]: any = await pool.execute('SELECT COUNT(*) as total FROM patient');

    // 2. Appointments Today
    const [todayCount]: any = await pool.execute('SELECT COUNT(*) as total FROM oapp WHERE nextdate = CURDATE()');

    // 3. Upcoming Appointments
    const [upcomingCount]: any = await pool.execute('SELECT COUNT(*) as total FROM oapp WHERE nextdate > CURDATE()');

    // 4. Missed Appointments (Follow-ups needed in past 30 days)
    const [missedCount]: any = await pool.execute('SELECT COUNT(*) as total FROM oapp WHERE nextdate < CURDATE() AND nextdate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)');

    // 5. Recent Appointments List
    const [recentApps]: any = await pool.execute(`
      SELECT o.oapp_id, o.hn, CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) AS patient_name,
             o.nextdate, o.nexttime, c.name AS clinic_name, d.name AS doctor_name, o.app_cause
      FROM oapp o
      LEFT JOIN patient p ON o.hn = p.hn
      LEFT JOIN clinic c ON o.clinic = c.clinic
      LEFT JOIN doctor d ON o.doctor = d.code
      WHERE o.nextdate >= CURDATE()
      ORDER BY o.nextdate ASC, o.nexttime ASC
      LIMIT 6
    `);

    const formattedRecent = recentApps.map((r: any) => ({
      id: String(r.oapp_id),
      hn: r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : 'HN-0000',
      patientName: r.patient_name || 'ไม่ระบุชื่อ',
      date: r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-',
      time: r.nexttime ? `${r.nexttime} น.` : '08:30 น.',
      clinic: r.clinic_name || 'คลินิก NCDs',
      doctor: r.doctor_name || 'พญ. วรรณภา จิตดี',
      status: 'confirmed',
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalPatients: patientCount[0].total,
        appointmentsToday: todayCount[0].total,
        upcomingAppointments: upcomingCount[0].total,
        missedFollowUps: missedCount[0].total,
      },
      recentAppointments: formattedRecent,
    });
  } catch (error: any) {
    console.error('❌ Real HOSxP Stats API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
