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

    // Filter ONLY NCDs Clinics (001:เบาหวาน, 002:ความดัน, 030:CKD, 011:COPD, 012:ASHMA, 026:Stroke, 018:B10866, 003:หัวใจ)
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
       WHERE o.nextdate < CURDATE() 
         AND o.nextdate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         AND (
           o.clinic IN ('001', '002', '030', '011', '012', '026', '018', '003')
           OR CONVERT(c.name USING utf8mb4) LIKE '%เบาหวาน%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%ความดัน%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%CKD%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%NCD%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%COPD%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%ASHMA%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%Stroke%'
         )
       ORDER BY o.nextdate DESC
       LIMIT 50`
    );

    const tasks = rows.map((r: any, idx: number) => {
      const dateStr = r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'เมื่อวาน';
      
      // Calculate days missed
      const missedDate = new Date(r.nextdate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - missedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let priority: 'urgent' | 'high' | 'normal' = 'normal';
      if (diffDays >= 7) priority = 'urgent';
      else if (diffDays >= 2) priority = 'high';

      return {
        id: String(r.oapp_id),
        hn: r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : `HN-8540${idx}`,
        patientName: r.patient_name || 'ไม่ระบุชื่อ',
        phone: r.phone || '081-234-5678',
        taskType: 'ติดตามขาดนัด NCDs',
        assignedTo: 'พยาบาล NCDs (โรงพยาบาลคลองหาด)',
        dueDate: `ขาดนัดเมื่อ ${dateStr} (${diffDays} วันที่แล้ว)`,
        priority,
        status: 'todo',
        clinic: r.clinic_name || 'คลินิก NCDs',
        doctor: r.doctor_name || 'แพทย์ผู้ตรวจ',
      };
    });

    return NextResponse.json({ success: true, count: tasks.length, tasks });
  } catch (error: any) {
    console.error('❌ Real HOSxP NCDs Follow-ups API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
