import { NextRequest, NextResponse } from 'next/server';
import {
  createRoleSelectionFlexMessage,
  createPatientRegistrationPromptFlex,
  createStaffRegistrationPromptFlex,
  createRegistrationSuccessFlex,
  createMyAppointmentsFlex,
  createConfirmSuccessFlex,
  createRescheduleRequestFlex,
  createContactStaffFlex,
  createPreparationGuideFlex,
  createHealthEducationMenuFlex,
} from '@/lib/lineFlexTemplates';

// Helper to reply via LINE Messaging API
async function replyLineMessage(replyToken: string, messages: any[]) {
  // Ignore LINE dummy verification tokens
  if (
    !replyToken ||
    replyToken === '00000000000000000000000000000000' ||
    replyToken === '11111111111111111111111111111111'
  ) {
    return;
  }

  // Token with fallback to guarantee Vercel Production replies
  const token = (
    process.env.LINE_CHANNEL_ACCESS_TOKEN ||
    'jXwSqFzYZPjCp/a9QC6zaAK9MDCaWBlKsGMIcKlUVxhYHJ7ISuu8n74IbiHb0IuNRAC+ZuFHnwNHSUM3hcS4rRzaAwAhzfvm7HV9uz5kTGPcSfQG9Xh5njwsrtDN3uu5s44HrbrSCxJm8+EzL5lDqgdB04t89/1O/w1cDnyilFU='
  ).trim();

  try {
    const res = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        replyToken,
        messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('❌ LINE Reply API status:', res.status, errText);
    }
  } catch (err) {
    console.error('❌ LINE Reply error:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const events = body.events || [];

    for (const event of events) {
      const lineUserId = event.source?.userId;
      const replyToken = event.replyToken;

      if (!replyToken || !lineUserId) continue;

      // Handle Follow event (When user adds LINE OA)
      if (event.type === 'follow') {
        const flexMsg = createRoleSelectionFlexMessage();
        await replyLineMessage(replyToken, [flexMsg]);
        continue;
      }

      // Handle Message event
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text.trim();

        // --------------------------------------------------------
        // Rich Menu 6 Tile Interactions
        // --------------------------------------------------------
        // Tile 1: "นัดหมายของฉัน"
        if (text === 'นัดหมายของฉัน' || text.includes('เช็คนัด') || text.includes('วันนัด')) {
          const flex = createMyAppointmentsFlex('กิตติพงษ์ แก้วมณี', 'HN-98302');
          await replyLineMessage(replyToken, [flex]);
          continue;
        }

        // Tile 2: "ยืนยันนัด"
        if (text === 'ยืนยันนัด' || text.includes('ยืนยันมาตามนัด')) {
          const flex = createConfirmSuccessFlex('กิตติพงษ์ แก้วมณี', '1 สิงหาคม 2026');
          await replyLineMessage(replyToken, [flex]);
          continue;
        }

        // Tile 3: "ขอเลื่อนนัด"
        if (text === 'ขอเลื่อนนัด' || text.includes('เลื่อนวันนัด')) {
          const flex = createRescheduleRequestFlex();
          await replyLineMessage(replyToken, [flex]);
          continue;
        }

        // Tile 4: "ติดต่อเจ้าหน้าที่"
        if (text === 'ติดต่อเจ้าหน้าที่' || text.includes('คุยกับพยาบาล') || text.includes('พยาบาล')) {
          const flex = createContactStaffFlex();
          await replyLineMessage(replyToken, [flex]);
          continue;
        }

        // Tile 5: "การเตรียมตัวก่อนพบแพทย์"
        if (text === 'การเตรียมตัวก่อนพบแพทย์' || text.includes('เตรียมตัว') || text.includes('งดน้ำ')) {
          const flex = createPreparationGuideFlex();
          await replyLineMessage(replyToken, [flex]);
          continue;
        }

        // Tile 6: "คำแนะนำสุขภาพ"
        if (text === 'คำแนะนำสุขภาพ' || text.includes('ความรู้') || text.includes('คำแนะนำ')) {
          const flex = createHealthEducationMenuFlex();
          await replyLineMessage(replyToken, [flex]);
          continue;
        }

        // --------------------------------------------------------
        // Registration Flow
        // --------------------------------------------------------
        if (
          text === 'ลงทะเบียนผู้ป่วย' ||
          text.includes('ผู้ป่วย') ||
          text.includes('ญาติ')
        ) {
          const promptFlex = createPatientRegistrationPromptFlex();
          await replyLineMessage(replyToken, [promptFlex]);
          continue;
        }

        if (
          text === 'ลงทะเบียนเจ้าหน้าที่' ||
          text.includes('เจ้าหน้าที่')
        ) {
          const promptFlex = createStaffRegistrationPromptFlex();
          await replyLineMessage(replyToken, [promptFlex]);
          continue;
        }

        // Patient Registration matching HN format (HN-XXXXX)
        if (text.toUpperCase().startsWith('HN-') || text.match(/^[0-9]{13}$/)) {
          const hnCode = text.toUpperCase();
          const patientName = 'กิตติพงษ์ แก้วมณี';

          const successFlex = createRegistrationSuccessFlex(
            'patient',
            patientName,
            hnCode,
            lineUserId
          );
          await replyLineMessage(replyToken, [successFlex]);
          continue;
        }

        // Staff Registration matching STAFF / NURSE format
        if (
          text.toUpperCase().startsWith('STAFF-') ||
          text.toUpperCase().startsWith('NURSE-') ||
          text.toUpperCase().startsWith('DOC-')
        ) {
          const staffCode = text.toUpperCase();
          const staffName = 'กิตติพงษ์ แก้วมณี (พยาบาลวิชาชีพ)';

          const successFlex = createRegistrationSuccessFlex(
            'staff',
            staffName,
            staffCode,
            lineUserId
          );
          await replyLineMessage(replyToken, [successFlex]);
          continue;
        }

        // Default fallback to Role Selection / Welcome Card
        const menuFlex = createRoleSelectionFlexMessage();
        await replyLineMessage(replyToken, [menuFlex]);
      }
    }

    return NextResponse.json({ status: 'ok', processed: events.length });
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'KHH Safe-Connect LINE Webhook',
    timestamp: new Date().toISOString(),
  });
}
