import { NextRequest, NextResponse } from 'next/server';
import { sendLineAppointmentReminder, sendLinePushTextMessage } from '@/lib/lineMessagingService';
import { getHosxpPool } from '@/lib/hosxpClient';
import { getLineUserIdByHn } from '@/lib/lineUserService';

export const dynamic = 'force-dynamic';

/**
 * Helper to process and send LINE Flex Message Reminders for upcoming NCDs appointments
 */
async function processUpcomingNcdReminders() {
  const pool = getHosxpPool();

  // Query real HOSxP upcoming NCDs appointments (3 days & 1 day ahead)
  const [rows]: any = await pool.execute(`
    SELECT o.oapp_id, o.hn, 
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
    WHERE (o.nextdate = DATE_ADD(CURDATE(), INTERVAL 3 DAY) OR o.nextdate = DATE_ADD(CURDATE(), INTERVAL 1 DAY))
      AND (
        o.clinic IN ('001', '002', '030', '011', '012', '026', '018', '003')
        OR CONVERT(c.name USING utf8mb4) LIKE '%เบาหวาน%'
        OR CONVERT(c.name USING utf8mb4) LIKE '%ความดัน%'
        OR CONVERT(c.name USING utf8mb4) LIKE '%CKD%'
      )
    ORDER BY o.nextdate ASC
  `);

  let count3Days = 0;
  let count1Day = 0;
  let sentCount = 0;
  let unlinkedCount = 0;
  const processedRecipients: any[] = [];

  const today = new Date();

  for (const r of rows) {
    const nextDate = new Date(r.nextdate);
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const is3DaysAhead = diffDays === 3 || diffDays === 2;
    if (is3DaysAhead) count3Days++;
    else count1Day++;

    const dateStr = nextDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = r.nexttime ? `${r.nexttime} น.` : '08:30 น.';

    let prepNotes = 'โปรดนำบัตรประชาชน สมุดประจำตัว NCDs และยาที่รับประทานประจำมาด้วยทุกครั้ง';
    const causeStr = (r.app_cause || '').toLowerCase();
    const clinicStr = (r.clinic_name || '').toLowerCase();

    if (causeStr.includes('เจาะเลือด') || causeStr.includes('ดม') || clinicStr.includes('เบาหวาน') || clinicStr.includes('ckd')) {
      prepNotes = '⚠️ โปรดงดน้ำและอาหารทุกชนิดหลัง 20:00 น. คืนก่อนวันตรวจ (จิบน้ำบริสุทธิ์ได้เล็กน้อย) นำยาประจำตัวมาทานหลังเจาะเลือดเสร็จ';
    }

    const hnFormatted = r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : 'HN-0000';
    const patientData = {
      hn: hnFormatted,
      patientName: r.patient_name || 'ผู้ป่วย NCDs',
      appointmentDate: `${dateStr} (${is3DaysAhead ? 'เตือนล่วงหน้า 3 วัน' : 'เตือนล่วงหน้า 1 วัน'})`,
      appointmentTime: timeStr,
      clinicName: r.clinic_name || 'คลินิก NCDs',
      doctorName: r.doctor_name || 'แพทย์ประจำคลินิก',
      preparationNotes: prepNotes,
    };

    // Strict Filter: Find real LINE User ID bound to this patient's HN
    const targetLineUserId = await getLineUserIdByHn(hnFormatted);

    let lineStatus = 'unlinked_skipped';
    if (targetLineUserId) {
      const lineResult = await sendLineAppointmentReminder(targetLineUserId, patientData);
      if (lineResult?.success) {
        lineStatus = 'sent';
        sentCount++;
      } else {
        lineStatus = 'failed';
      }
    } else {
      unlinkedCount++;
    }

    processedRecipients.push({
      hn: patientData.hn,
      name: patientData.patientName,
      clinic: patientData.clinicName,
      appointmentDate: dateStr,
      noticeType: is3DaysAhead ? 'เตือน 3 วันก่อนนัด' : 'เตือน 1 วันก่อนนัด',
      phone: r.phone || '-',
      lineStatus,
      targetLineUserId: targetLineUserId || 'ยังไม่ผูก LINE',
    });
  }

  return {
    totalProcessed: rows.length,
    sentCount,
    unlinkedCount,
    sent3DaysCount: count3Days,
    sent1DayCount: count1Day,
    recipients: processedRecipients,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // If messageText is provided, send direct staff reply to LINE user
    if (body.messageText) {
      const hnFormatted = body.hn || '';
      const patientName = body.patientName || 'ผู้ป่วย';
      const staffRole = body.staffRole || 'เจ้าหน้าที่สุขภาพ';
      const staffName = body.staffName || 'เจ้าหน้าที่';

      // Find real LINE User ID bound to patient's HN
      const targetLineUserId = (await getLineUserIdByHn(hnFormatted)) || body.lineUserId;

      if (!targetLineUserId) {
        return NextResponse.json({
          status: 'error',
          message: `⚠️ ผู้ป่วย คุณ${patientName} (${hnFormatted}) ยังไม่ได้ผูกบัญชี LINE ไม่สามารถส่งข้อความได้`,
        }, { status: 400 });
      }

      const formattedMessage = `💬 [คำตอบจาก ${staffRole}]\nเรียน คุณ${patientName}\n\n${body.messageText}\n\n---\n✍️ ${staffName}\n🏥 คลินิก NCDs โรงพยาบาลคลองหาด`;

      const result = await sendLinePushTextMessage(targetLineUserId, formattedMessage);

      return NextResponse.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        message: `💬 ส่งข้อความจาก [${staffRole}] หาคุณ ${patientName} (${hnFormatted}) สำเร็จ`,
        result,
      });
    }

    const result = await processUpcomingNcdReminders();

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      message: `⚡ ส่ง LINE แจ้งเตือนนัดหมายล่วงหน้า NCDs สำเร็จ ทั้งหมด ${result.totalProcessed} ราย`,
      ...result,
    });
  } catch (error: any) {
    console.error('❌ Notification Trigger Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Vercel Cron Trigger (08:00 AM Daily)
    const result = await processUpcomingNcdReminders();

    return NextResponse.json({
      status: 'cron_executed',
      scheduledTime: '08:00 AM (Daily Cron Job)',
      timestamp: new Date().toISOString(),
      message: `⚡ ระบบ Cron อัตโนมัติประมวลผลเตือนนัด HOSxP สำเร็จ ${result.totalProcessed} ราย`,
      ...result,
    });
  } catch (error: any) {
    console.error('❌ Cron Execution Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
