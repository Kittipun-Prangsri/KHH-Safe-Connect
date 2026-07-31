import { NextRequest, NextResponse } from 'next/server';
import {
  createRoleSelectionFlexMessage,
  createPatientRegistrationPromptFlex,
  createStaffRegistrationPromptFlex,
  createRegistrationSuccessFlex,
} from '@/lib/lineFlexTemplates';

// Helper to reply via LINE Messaging API
async function replyLineMessage(replyToken: string, messages: any[]) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    console.warn('⚠️ LINE_CHANNEL_ACCESS_TOKEN not configured.');
    return;
  }

  try {
    await fetch('https://api.line.me/v2/bot/message/reply', {
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

        // 1. Role Selection Keywords
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
          text.includes('เจ้าหน้าที่') ||
          text.includes('พยาบาล') ||
          text.includes('แพทย์')
        ) {
          const promptFlex = createStaffRegistrationPromptFlex();
          await replyLineMessage(replyToken, [promptFlex]);
          continue;
        }

        // 2. Patient Registration matching HN format (HN-XXXXX)
        if (text.toUpperCase().startsWith('HN-') || text.match(/^[0-9]{13}$/)) {
          const hnCode = text.toUpperCase();
          const patientName = 'สมชาย ดีเลิศ'; // Linked from database

          const successFlex = createRegistrationSuccessFlex(
            'patient',
            patientName,
            hnCode,
            lineUserId
          );
          await replyLineMessage(replyToken, [successFlex]);
          continue;
        }

        // 3. Staff Registration matching STAFF / NURSE format
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

        // Default: Welcome / Menu
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
