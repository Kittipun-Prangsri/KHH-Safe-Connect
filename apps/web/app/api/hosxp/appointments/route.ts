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
    waitForConnections: true,
    connectionLimit: 5,
  });
}

export async function GET() {
  try {
    const pool = getHosxpPool();
    const [rows]: any = await pool.execute(
      `SELECT o.oapp_id, o.hn, CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) AS patient_name, 
              COALESCE(p.mobile_phone_number, p.hometel, p.informtel) AS phone,
              o.nextdate, o.nexttime, o.clinic, o.doctor, o.app_cause
       FROM oapp o
       LEFT JOIN patient p ON o.hn = p.hn
       WHERE o.nextdate >= CURDATE()
       ORDER BY o.nextdate ASC
       LIMIT 30`
    );

    const appointments = rows.map((r: any) => {
      const dateStr = r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
      return {
        id: String(r.oapp_id),
        hn: r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : 'HN-0000',
        rawHn: r.hn,
        patientName: r.patient_name || 'ไม่ระบุชื่อ',
        phone: r.phone || '081-000-0000',
        appointmentDate: dateStr,
        appointmentTime: r.nexttime ? `${r.nexttime} น.` : '08:30 น.',
        clinic: `คลินิก ${r.clinic || 'NCDs'}`,
        doctor: `แพทย์รหัส ${r.doctor || '0087'}`,
        status: 'confirmed',
        lineNotificationSent: true,
      };
    });

    return NextResponse.json({ success: true, count: appointments.length, appointments });
  } catch (error: any) {
    console.error('❌ Real HOSxP Appointments API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
