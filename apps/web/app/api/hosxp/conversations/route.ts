import { NextRequest, NextResponse } from 'next/server';
import { getHosxpPool } from '@/lib/hosxpClient';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const pool = getHosxpPool();

    // Query real HOSxP patients with upcoming/missed appointments in NCDs clinics
    const [rows]: any = await pool.execute(`
      SELECT o.oapp_id, o.hn, 
             CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) AS patient_name,
             COALESCE(p.mobile_phone_number, p.hometel, p.informtel) AS phone,
             o.nextdate, o.nexttime, o.clinic, 
             CONVERT(c.name USING utf8mb4) AS clinic_name, 
             CONVERT(o.app_cause USING utf8mb4) AS app_cause
      FROM oapp o
      LEFT JOIN patient p ON o.hn = p.hn
      LEFT JOIN clinic c ON o.clinic = c.clinic
      WHERE o.nextdate >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
        AND (
          o.clinic IN ('001', '002', '030', '011', '012', '026', '018', '003')
          OR CONVERT(c.name USING utf8mb4) LIKE '%เบาหวาน%'
          OR CONVERT(c.name USING utf8mb4) LIKE '%ความดัน%'
          OR CONVERT(c.name USING utf8mb4) LIKE '%CKD%'
        )
      ORDER BY o.nextdate DESC
      LIMIT 20
    `);

    const conversations = rows.map((r: any, idx: number) => {
      const hnFormatted = r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : `HN-00${idx}`;
      const clinicName = r.clinic_name || 'คลินิก NCDs';
      const cause = r.app_cause || 'ตรวจติดตามอาการ';
      const nextDateStr = r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }) : 'วันนี้';

      return {
        id: `conv-${r.oapp_id}`,
        hn: hnFormatted,
        patientName: r.patient_name || 'ไม่ระบุชื่อ',
        phone: r.phone || '-',
        subject: `[HOSxP] นัดตรวจ ${clinicName} (${nextDateStr}) - ${cause}`,
        category: clinicName.includes('เบาหวาน') ? 'ขอเลื่อนนัด' : clinicName.includes('ความดัน') ? 'สอบถามการใช้ยา' : 'ติดตามอาการ NCDs',
        priority: idx < 3 ? 'urgent' : idx < 8 ? 'high' : 'normal',
        unreadCount: idx < 4 ? 1 : 0,
        lastMessageTime: `${10 - (idx % 5)}:${15 + (idx * 3 % 40)} น.`,
        messages: [
          {
            id: `msg-${r.oapp_id}-1`,
            sender: 'patient',
            senderName: r.patient_name || 'ผู้ป่วย',
            text: `สวัสดีค่ะ/ครับ รบกวนสอบถามเกี่ยวกับวันนัด ${clinicName} วันที่ ${nextDateStr} (${cause})`,
            time: '10:00 น.',
          },
        ],
      };
    });

    return NextResponse.json({ success: true, count: conversations.length, conversations });
  } catch (error: any) {
    console.error('❌ Real HOSxP Conversations API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
