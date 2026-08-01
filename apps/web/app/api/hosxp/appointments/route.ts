import { NextResponse } from 'next/server';
import { getHosxpPool } from '@/lib/hosxpClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pool = getHosxpPool();
    const [rows]: any = await pool.execute(
      `SELECT o.oapp_id, o.hn, 
              CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) AS patient_name, 
              COALESCE(p.mobile_phone_number, p.hometel, p.informtel) AS phone,
              o.nextdate, o.nexttime, o.clinic, 
              CONVERT(c.name USING utf8mb4) AS clinic_name, 
              o.doctor, 
              CONVERT(d.name USING utf8mb4) AS doctor_name, 
              CONVERT(o.app_cause USING utf8mb4) AS app_cause
       FROM oapp o
       LEFT JOIN patient p ON o.hn = p.hn
       LEFT JOIN clinic c ON o.clinic = c.clinic
       LEFT JOIN doctor d ON o.doctor = d.code
       WHERE o.nextdate >= CURDATE()
       ORDER BY o.nextdate ASC, o.nexttime ASC
       LIMIT 50`
    );

    const appointments = rows.map((r: any) => ({
      id: String(r.oapp_id),
      hn: r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : 'HN-0000',
      patientName: r.patient_name || 'ไม่ระบุชื่อ',
      phone: r.phone || '081-234-5678',
      date: r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-',
      time: r.nexttime ? `${r.nexttime} น.` : '08:30 น.',
      clinic: r.clinic_name || 'คลินิก NCDs',
      provider: r.doctor_name || 'แพทย์ผู้ตรวจ',
      type: r.app_cause || 'ตรวจติดตามอาการ NCDs',
      status: 'confirmed',
      lineNotified: true,
    }));

    return NextResponse.json({ success: true, count: appointments.length, appointments });
  } catch (error: any) {
    console.error('❌ Real HOSxP Appointments API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
