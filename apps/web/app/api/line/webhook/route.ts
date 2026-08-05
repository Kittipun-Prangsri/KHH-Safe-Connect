import { NextRequest, NextResponse } from 'next/server';
import { sendLineReplyMessage } from '@/lib/lineMessagingService';
import {
  getLineUserBinding,
  bindLineUserToHn,
  findPatientByHnOrCidInHosxp,
  fetchPatientUpcomingAppointmentsFromHosxp,
  recordIncomingLineMessage,
} from '@/lib/lineUserService';
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
  createDietAdviceFlex,
  createMedicationAdviceFlex,
  createPatientInfoVerificationFlex,
  createRiskAssessmentAndMenuFlex,
  createPharmacistFormPromptFlex,
} from '@/lib/lineFlexTemplates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const events = body.events || [];

    // Fast 200 OK response for LINE Developers "Verify" button test
    if (!events || events.length === 0) {
      return NextResponse.json({ status: 'ok', message: 'LINE Webhook endpoint verified successfully' }, { status: 200 });
    }

    console.log(`📩 LINE Webhook Received ${events.length} event(s)`);

    for (const event of events) {
      const lineUserId = event.source?.userId;
      const replyToken = event.replyToken;

      console.log(`💬 Event type: ${event.type}, userId: ${lineUserId}, text: ${event.message?.text}`);

      if (!replyToken || !lineUserId) continue;

      // Handle Follow event (When user adds LINE OA)
      if (event.type === 'follow') {
        const flexMsg = createRoleSelectionFlexMessage();
        const res = await sendLineReplyMessage(replyToken, [flexMsg]);
        console.log('📤 Reply follow result:', res);
        continue;
      }

      // Handle Message event
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text.trim();

        // Save incoming patient message to conversation log for Reply web portal
        await recordIncomingLineMessage(lineUserId, text);

        // --------------------------------------------------------
        // Rich Menu 6 Tile Interactions
        // --------------------------------------------------------
        // Tile 1: "นัดหมายของฉัน" -> Dynamic HOSxP Lookup by lineUserId
        if (text === 'นัดหมายของฉัน' || text.includes('เช็คนัด') || text.includes('วันนัด')) {
          const binding = await getLineUserBinding(lineUserId);

          if (binding) {
            // Patient already linked -> Fetch real HOSxP/Supabase appointments for their HN
            const appointments = await fetchPatientUpcomingAppointmentsFromHosxp(binding.hn);
            if (appointments && appointments.length > 0) {
              const flex = createMyAppointmentsFlex(binding.patientName, binding.hn, appointments);
              await sendLineReplyMessage(replyToken, [flex]);
            } else {
              await sendLineReplyMessage(replyToken, [
                {
                  type: 'text',
                  text: `🗓️ คุณ${binding.patientName} (${binding.hn})\nท่านยังไม่มีรายการนัดหมายตรวจติดตามถัดไปในระบบโรงพยาบาลคลองหาด ณ ขณะนี้ค่ะ\n\nหากต้องการสอบถาม หรือนัดหมายเพิ่มเติม กรุณากดปุ่ม [ติดต่อเจ้าหน้าที่] ได้เลยค่ะ`,
                },
              ]);
            }
          } else {
            // Unregistered patient -> Prompt registration card
            const promptFlex = createPatientRegistrationPromptFlex();
            await sendLineReplyMessage(replyToken, [
              {
                type: 'text',
                text: '⚠️ ยังไม่พบข้อมูลลงทะเบียนในระบบ กรุณากดลงทะเบียนระบุ HN หรือเลขบัตรประชาชนก่อนเพื่อความปลอดภัย 100% ค่ะ',
              },
              promptFlex,
            ]);
          }
          continue;
        }

        // Tile 2: "ยืนยันนัด"
        if (text === 'ยืนยันนัด' || text.includes('ยืนยันมาตามนัด')) {
          const binding = await getLineUserBinding(lineUserId);
          if (binding) {
            const appointments = await fetchPatientUpcomingAppointmentsFromHosxp(binding.hn);
            if (appointments && appointments.length > 0) {
              const realDate = appointments[0].appointmentDate;
              const flex = createConfirmSuccessFlex(binding.patientName, realDate);
              await sendLineReplyMessage(replyToken, [flex]);
            } else {
              await sendLineReplyMessage(replyToken, [
                {
                  type: 'text',
                  text: `🗓️ คุณ${binding.patientName} (${binding.hn})\nท่านยังไม่มีรายการนัดหมายคงเหลือในระบบให้ยืนยันนัด ณ ขณะนี้ค่ะ`,
                },
              ]);
            }
          } else {
            const promptFlex = createPatientRegistrationPromptFlex();
            await sendLineReplyMessage(replyToken, [
              {
                type: 'text',
                text: '⚠️ ยังไม่พบข้อมูลลงทะเบียนในระบบ กรุณากดลงทะเบียนระบุ HN หรือเลขบัตรประชาชนก่อนค่ะ',
              },
              promptFlex,
            ]);
          }
          continue;
        }

        // Tile 3: "ขอเลื่อนนัด"
        if (text === 'ขอเลื่อนนัด' || text.includes('เลื่อนวันนัด')) {
          const flex = createRescheduleRequestFlex();
          await sendLineReplyMessage(replyToken, [flex]);
          continue;
        }

        // Tile 4: "ติดต่อเจ้าหน้าที่"
        if (
          text === 'ติดต่อเจ้าหน้าที่' ||
          text.includes('คุยกับพยาบาล') ||
          text.includes('พยาบาล') ||
          text.includes('นักโภชนา') ||
          text.includes('โภชนาการ') ||
          text.includes('เภสัช')
        ) {
          const flex = createContactStaffFlex();
          await sendLineReplyMessage(replyToken, [flex]);
          continue;
        }

        // Tile 5: "การเตรียมตัวก่อนพบแพทย์"
        if (text === 'การเตรียมตัวก่อนพบแพทย์' || text.includes('เตรียมตัว') || text.includes('งดน้ำ')) {
          const flex = createPreparationGuideFlex();
          await sendLineReplyMessage(replyToken, [flex]);
          continue;
        }

        // Sub-Tile 6.1: "คำแนะนำการรับประทานอาหาร"
        if (
          text === 'คำแนะนำการรับประทานอาหาร' ||
          text.includes('รับประทานอาหาร')
        ) {
          const flex = createDietAdviceFlex();
          await sendLineReplyMessage(replyToken, [flex]);
          continue;
        }

        // Sub-Tile 6.2: "คำแนะนำการใช้ยา"
        if (
          text === 'คำแนะนำการใช้ยา' ||
          text.includes('การใช้ยา') ||
          text.includes('ข้อควรระวัง') ||
          text.includes('ปรึกษายา')
        ) {
          const flex = createMedicationAdviceFlex();
          await sendLineReplyMessage(replyToken, [flex]);
          continue;
        }

        // Sub-Tile 6.2.1: "แบบฟอร์มข้อมูลคนไข้สำหรับประกอบการปรึกษากับเภสัช"
        if (
          text === 'แบบฟอร์มข้อมูลคนไข้สำหรับประกอบการปรึกษากับเภสัช' ||
          text.includes('แบบฟอร์มข้อมูลคนไข้') ||
          text.includes('ประกอบการปรึกษากับเภสัช') ||
          text.includes('แบบฟอร์มปรึกษาเภสัช')
        ) {
          const flex = createPharmacistFormPromptFlex();
          await sendLineReplyMessage(replyToken, [flex]);
          continue;
        }

        // Tile 6: "คำแนะนำสุขภาพ"
        if (text === 'คำแนะนำสุขภาพ' || text.includes('ความรู้') || text.includes('คำแนะนำ')) {
          const flex = createHealthEducationMenuFlex();
          await sendLineReplyMessage(replyToken, [flex]);
          continue;
        }

        // --------------------------------------------------------
        // Registration Flow & Account Binding
        // --------------------------------------------------------
        if (
          text === 'ลงทะเบียนผู้ป่วย' ||
          text.includes('ผู้ป่วย') ||
          text.includes('ญาติ')
        ) {
          const promptFlex = createPatientRegistrationPromptFlex();
          await sendLineReplyMessage(replyToken, [promptFlex]);
          continue;
        }

        if (
          text === 'ลงทะเบียนเจ้าหน้าที่' ||
          text.includes('เจ้าหน้าที่')
        ) {
          const promptFlex = createStaffRegistrationPromptFlex();
          await sendLineReplyMessage(replyToken, [promptFlex]);
          continue;
        }

        // Patient Registration matching HN format (HN-XXXXX) or 13-digit CID
        if (text.toUpperCase().startsWith('HN-') || text.match(/^[0-9]{13}$/) || text.match(/^[0-9]{4,8}$/)) {
          const patientMatch = await findPatientByHnOrCidInHosxp(text);

          if (patientMatch.found) {
            // Bind LINE User ID to matched HOSxP HN
            await bindLineUserToHn(lineUserId, patientMatch.hn, patientMatch.patientName);

            // Mask 13-digit CID for security (e.g. 1-2345-XXXXX-12-3)
            const rawCid = patientMatch.cid || text;
            const maskedCid = rawCid.length === 13 
              ? `${rawCid.substring(0, 1)}-${rawCid.substring(1, 5)}-XXXXX-${rawCid.substring(10, 12)}-${rawCid.substring(12)}` 
              : rawCid;

            // 1. Patient Info Verification Card (Full Name, HN, CID, Registered Clinic Types)
            const infoFlex = createPatientInfoVerificationFlex(
              patientMatch.patientName,
              patientMatch.hn,
              maskedCid,
              patientMatch.clinics || ['🩺 คลินิกเบาหวาน (DM)', '🩺 คลินิกความดันโลหิตสูง (HT)']
            );

            // 2. Automatic Interactive Risk Menu (Appointment Check, CVD Risk, Advice, Contact Staff)
            const riskMenuFlex = createRiskAssessmentAndMenuFlex();

            await sendLineReplyMessage(replyToken, [infoFlex, riskMenuFlex]);
          } else {
            await sendLineReplyMessage(replyToken, [
              {
                type: 'text',
                text: `⚠️ ไม่พบข้อมูลรหัส "${text}" ในระบบผู้ป่วยโรงพยาบาลคลองหาด กรุณาตรวจสอบ HN หรือเลขบัตรประชาชนอีกครั้งค่ะ`,
              },
            ]);
          }
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
          await sendLineReplyMessage(replyToken, [successFlex]);
          continue;
        }

        // Default fallback to Role Selection / Welcome Card
        const menuFlex = createRoleSelectionFlexMessage();
        const res = await sendLineReplyMessage(replyToken, [menuFlex]);
        console.log('📤 Reply message result:', res);
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
