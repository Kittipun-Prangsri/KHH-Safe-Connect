// LINE Flex Message Templates for KHH Safe-Connect Hospital Portal

export interface AppointmentNotificationData {
  hn: string;
  patientName: string;
  appointmentDate: string; // e.g. "1 สิงหาคม 2026"
  appointmentTime: string; // e.g. "09:00 น."
  clinicName: string;      // e.g. "คลินิกเบาหวาน"
  doctorName?: string;     // e.g. "พญ. วรรณภา จิตดี"
  preparationNotes?: string; // e.g. "งดน้ำและอาหารหลัง 20:00 น."
  location?: string;       // e.g. "อาคารผู้ป่วยนอก ชั้น 2"
}

/**
 * Generate Hospital Standard Flex Message for Appointment Reminders
 */
export function createAppointmentFlexMessage(data: AppointmentNotificationData) {
  return {
    type: 'flex',
    altText: `🗓️ แจ้งเตือนนัดหมายตรวจติดตามอาการ: คุณ${data.patientName} (${data.appointmentDate})`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0B6F8A',
        paddingAll: 'lg',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'KHH SAFE-CONNECT',
                color: '#13A89E',
                size: 'xs',
                weight: 'bold',
                flex: 1,
              },
              {
                type: 'text',
                text: 'แจ้งเตือนวันนัดหมาย',
                color: '#FFFFFF',
                size: 'xs',
                align: 'end',
                weight: 'bold',
              },
            ],
          },
          {
            type: 'text',
            text: 'โรงพยาบาลคลองหาด (KHH)',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDFA',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#CCFBF1',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '👤 ข้อมูลผู้ป่วย',
                size: 'xs',
                color: '#0F766E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `${data.patientName}`,
                size: 'lg',
                color: '#17324D',
                weight: 'bold',
                margin: 'xs',
              },
              {
                type: 'text',
                text: `HN: ${data.hn}`,
                size: 'xs',
                color: '#0B6F8A',
                weight: 'bold',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: '📅 วันนัดตรวจ:',
                    size: 'xs',
                    color: '#64748B',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: `${data.appointmentDate}`,
                    size: 'xs',
                    color: '#0F172A',
                    weight: 'bold',
                    flex: 3,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: '⏰ เวลา:',
                    size: 'xs',
                    color: '#64748B',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: `${data.appointmentTime}`,
                    size: 'xs',
                    color: '#0D9488',
                    weight: 'bold',
                    flex: 3,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: '🏥 คลินิก:',
                    size: 'xs',
                    color: '#64748B',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: `${data.clinicName}`,
                    size: 'xs',
                    color: '#0F172A',
                    weight: 'bold',
                    flex: 3,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: '👨‍⚕️ แพทย์:',
                    size: 'xs',
                    color: '#64748B',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: `${data.doctorName || 'แพทย์ประจำคลินิก'}`,
                    size: 'xs',
                    color: '#0F172A',
                    flex: 3,
                  },
                ],
              },
            ],
          },
          {
            type: 'separator',
            color: '#E2E8F0',
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FFFBEB',
            cornerRadius: 'md',
            paddingAll: 'sm',
            contents: [
              {
                type: 'text',
                text: '💡 ข้อแนะนำการเตรียมตัว:',
                size: 'xs',
                color: '#B45309',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `${data.preparationNotes || 'โปรดนำบัตรประชาชนและยาที่รับประทานประจำมาด้วยทุกครั้ง'}`,
                size: 'xs',
                color: '#78350F',
                wrap: true,
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'message',
              label: '🟢 ยืนยันมาตามนัด',
              text: `ยืนยันนัด`,
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '🟡 ขอเลื่อนวันนัด',
              text: `ขอเลื่อนนัด`,
            },
          },
        ],
      },
    },
  };
}

// ----------------------------------------------------
// Rich Menu Tile Responses (6 Custom Functions)
// ----------------------------------------------------

/**
 * 1. Tile 1: "นัดหมายของฉัน"
 */
export function createMyAppointmentsFlex(
  patientName: string = 'ผู้ป่วย NCDs',
  hn: string = 'HN-00000',
  appointments?: Array<{
    appointmentDate: string;
    appointmentTime: string;
    clinicName: string;
    doctorName?: string;
    cause?: string;
    preparationNotes?: string;
  }>
) {
  // If NO active appointments exist in database for this patient, render 'No Appointments Found' Flex Card
  if (!appointments || appointments.length === 0) {
    return {
      type: 'flex',
      altText: `🗓️ รายการนัดหมาย: คุณ${patientName} (${hn}) - ยังไม่มีรายการนัดหมาย`,
      contents: {
        type: 'bubble',
        size: 'mega',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#0F766E',
          paddingAll: 'lg',
          contents: [
            {
              type: 'text',
              text: '🗓️ รายการนัดหมายตรวจติดตาม',
              color: '#FFFFFF',
              size: 'md',
              weight: 'bold',
            },
            {
              type: 'text',
              text: `คุณ${patientName} (${hn})`,
              color: '#99F6E4',
              size: 'xs',
              weight: 'bold',
              margin: 'xs',
            },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          paddingAll: 'lg',
          spacing: 'md',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#F8FAFC',
              cornerRadius: 'md',
              paddingAll: 'lg',
              borderColor: '#E2E8F0',
              borderWidth: '1px',
              alignItems: 'center',
              contents: [
                {
                  type: 'text',
                  text: 'ℹ️ ไม่พบรายการนัดหมายถัดไป',
                  size: 'sm',
                  color: '#475569',
                  weight: 'bold',
                },
                {
                  type: 'text',
                  text: `ขณะนี้ท่านยังไม่มีรายการนัดหมายตรวจติดตามในระบบ HOSxP ของโรงพยาบาลคลองหาดค่ะ`,
                  size: 'xs',
                  color: '#64748B',
                  margin: 'md',
                  wrap: true,
                  align: 'center',
                },
                {
                  type: 'text',
                  text: `หากต้องการขอเลื่อนนัด หรือนัดหมายเพิ่มเติม สามารถกดปุ่ม [ติดต่อเจ้าหน้าที่] ด้านล่างได้เลยค่ะ`,
                  size: 'xs',
                  color: '#0F766E',
                  margin: 'sm',
                  wrap: true,
                  align: 'center',
                },
              ],
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          paddingAll: 'md',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#0D9488',
              height: 'sm',
              action: {
                type: 'message',
                label: '💬 ติดต่อเจ้าหน้าที่',
                text: 'ติดต่อเจ้าหน้าที่',
              },
            },
          ],
        },
      },
    };
  }

  // Active appointment exists -> Render real appointment card
  const mainApp = appointments[0];

  return {
    type: 'flex',
    altText: `🗓️ รายการนัดหมายของฉัน: คุณ${patientName} (${hn}) - รพ.คลองหาด`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0B6F8A',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🗓️ รายการนัดหมายตรวจติดตาม',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: `คุณ${patientName} (${hn})`,
            color: '#13A89E',
            size: 'xs',
            weight: 'bold',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDFA',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#CCFBF1',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '📌 นัดหมายถัดไป (ข้อมูลสด HOSxP)',
                size: 'xs',
                color: '#0F766E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `${mainApp.appointmentDate}`,
                size: 'md',
                color: '#17324D',
                weight: 'bold',
                margin: 'xs',
              },
              {
                type: 'text',
                text: `เวลา ${mainApp.appointmentTime} | ${mainApp.clinicName}`,
                size: 'xs',
                color: '#0B6F8A',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `แพทย์ผู้ตรวจ: ${mainApp.doctorName || 'แพทย์ประจำคลินิก'}`,
                size: 'xs',
                color: '#64748B',
                margin: 'xs',
              },
              {
                type: 'text',
                text: `สาเหตุการนัด: ${mainApp.cause || 'ตรวจติดตามอาการประจำปี'}`,
                size: 'xs',
                color: '#475569',
                margin: 'xs',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FFFBEB',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FDE68A',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '📝 ข้อปฏิบัติตัวก่อนมาพบแพทย์',
                size: 'xs',
                color: '#92400E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `${mainApp.preparationNotes || 'โปรดนำบัตรประชาชนและยาประจำตัวมาด้วยทุกครั้ง'}`,
                size: 'xs',
                color: '#78350F',
                wrap: true,
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'message',
              label: '🟢 ยืนยันนัด',
              text: 'ยืนยันนัด',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: 'ขอเลื่อนนัด',
              text: 'ขอเลื่อนนัด',
            },
          },
        ],
      },
    },
  };
}

/**
 * 2. Tile 2: "ยืนยันนัด"
 */
export function createConfirmSuccessFlex(patientName: string = 'สมชาย ดีเลิศ', date: string = '1 สิงหาคม 2026') {
  return {
    type: 'flex',
    altText: '✅ ยืนยันการมาตามนัดเรียบร้อยแล้ว',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0D9488',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '✅ ยืนยันการมาตามนัดสำเร็จ',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: `ขอบคุณครับ คุณ${patientName}`,
            size: 'sm',
            weight: 'bold',
            color: '#0F172A',
          },
          {
            type: 'text',
            text: `ระบบบันทึกการยืนยันนัดวันที่ ${date} (เวลา 09:00 น.) เข้าสู่ระบบโรงพยาบาลเรียบร้อยแล้ว`,
            size: 'xs',
            color: '#475569',
            wrap: true,
          },
          {
            type: 'text',
            text: '💡 ข้อแนะนำ: โปรดงดน้ำและอาหารหลัง 20:00 น. คืนก่อนวันตรวจ และนำบัตรประชาชนมาด้วยทุกครั้ง',
            size: 'xs',
            color: '#B45309',
            wrap: true,
            margin: 'md',
          },
        ],
      },
    },
  };
}

/**
 * Generate Confirmation Flex Card when Staff Approves/Changes Rescheduled Appointment Date
 */
export function createRescheduleSuccessFlex(params: {
  patientName: string;
  hn: string;
  newDate: string;
  newTime?: string;
  doctor?: string;
  clinic?: string;
}) {
  const {
    patientName,
    hn,
    newDate,
    newTime = '08:00 - 12:00 น.',
    doctor = 'พญ. วรรณภา จิตดี (แพทย์ประจำคลินิก NCDs)',
    clinic = 'คลินิก NCDs โรงพยาบาลคลองหาด',
  } = params;

  // Build Google Calendar Event URL
  const calTitle = encodeURIComponent(`นัดตรวจคลินิก NCDs - คุณ${patientName} (${hn})`);
  const calDetails = encodeURIComponent(
    `ใบนัดตรวจติดตามคลินิก NCDs โรงพยาบาลคลองหาด\nผู้ป่วย: คุณ${patientName} (${hn})\nวันนัดใหม่: ${newDate}\nเวลา: ${newTime}\nแพทย์: ${doctor}\nสถานที่: ${clinic}`
  );
  const calLocation = encodeURIComponent('โรงพยาบาลคลองหาด');
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${calDetails}&location=${calLocation}`;

  return {
    type: 'flex',
    altText: `📅 ยืนยันการเปลี่ยนวันนัดหมายสำเร็จ: คุณ${patientName} (นัดใหม่ ${newDate})`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0284C7',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '📅 ยืนยันการเปลี่ยนวันนัดหมายสำเร็จ',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'เจ้าหน้าที่อนุมัติวันนัดหมายใหม่เรียบร้อยแล้ว',
            color: '#E0F2FE',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0F9FF',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BAE6FD',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '👤 ผู้ป่วยลงทะเบียน:',
                size: 'xs',
                color: '#0369A1',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `คุณ${patientName}`,
                size: 'sm',
                color: '#0F172A',
                weight: 'bold',
                margin: 'xs',
              },
              {
                type: 'text',
                text: `หมายเลข HN: ${hn}`,
                size: 'xs',
                color: '#475569',
                margin: 'xs',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F8FAFC',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#E2E8F0',
            borderWidth: '1px',
            spacing: 'xs',
            contents: [
              {
                type: 'text',
                text: '🗓️ กำหนดวันนัดหมายใหม่:',
                size: 'xs',
                color: '#475569',
                weight: 'bold',
              },
              {
                type: 'text',
                text: newDate,
                size: 'lg',
                color: '#0284C7',
                weight: 'bold',
                margin: 'xs',
              },
              {
                type: 'separator',
                color: '#E2E8F0',
                margin: 'sm',
              },
              {
                type: 'text',
                text: `⏰ เวลาตรวจ: ${newTime}`,
                size: 'xs',
                color: '#334155',
                margin: 'sm',
              },
              {
                type: 'text',
                text: `🩺 แพทย์ผู้ตรวจ: ${doctor}`,
                size: 'xs',
                color: '#334155',
              },
              {
                type: 'text',
                text: `🏥 สถานที่/คลินิก: ${clinic}`,
                size: 'xs',
                color: '#334155',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FEF3C7',
            cornerRadius: 'md',
            paddingAll: 'sm',
            contents: [
              {
                type: 'text',
                text: '💡 ข้อแนะนำ: โปรดนำบัตรประชาชนและยาประจำตัวมาด้วยทุกครั้งก่อนมาตามนัดใหม่ค่ะ',
                size: 'xs',
                color: '#92400E',
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0284C7',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📅 บันทึกลงปฏิทิน Google Calendar',
              uri: googleCalUrl,
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📞 ติดต่อคลินิก NCDs (06-2271-0099)',
              uri: 'tel:0622710099',
            },
          },
        ],
      },
    },
  };
}

/**
 * 3. Tile 3: "ขอเลื่อนนัด"
 */
export function createRescheduleRequestFlex() {
  return {
    type: 'flex',
    altText: '🟡 แจ้งขอเลื่อนวันนัดหมาย',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#D97706',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🟡 แจ้งขอเลื่อนวันนัดหมาย',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'ท่านต้องการขอเลื่อนวันนัดตรวจเป็นช่วงใดคะ?',
            size: 'xs',
            color: '#334155',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: 'โปรดพิมพ์ระบุวัน/เวลา หรือสัปดาห์ที่สะดวกส่งกลับมาในแชทนี้ เจ้าหน้าที่จะทำการปรับวันนัดและแจ้งยืนยันกลับโดยเร็วที่สุดค่ะ',
            size: 'xs',
            color: '#64748B',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '🎧 พิมพ์คุยกับพยาบาล',
              text: 'ติดต่อเจ้าหน้าที่',
            },
          },
        ],
      },
    },
  };
}

/**
 * 4. Tile 4: "ติดต่อเจ้าหน้าที่"
 */
export function createContactStaffFlex() {
  return {
    type: 'flex',
    altText: '🎧 ติดต่อเจ้าหน้าที่ / พยาบาล NCDs',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#084C61',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🎧 ติดต่อเจ้าหน้าที่ / พยาบาล',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'ศูนย์ประสานงาน NCDs Care รพ.คลองหาด',
            color: '#13A89E',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: 'ท่านสามารถพิมพ์ข้อความ คำถาม หรือแจ้งเรื่องผิดปกติส่งในแชทนี้ได้ทันที',
            size: 'xs',
            color: '#334155',
            wrap: true,
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'ข้อความของท่านถูกส่งตรงถึงพยาบาลผู้ดูแลระบบเรียบร้อยแล้วค่ะ',
            size: 'xs',
            color: '#0D9488',
            margin: 'sm',
          },
          {
            type: 'text',
            text: '📞 เบอร์โทรศัพท์: 06-2271-0099 \n (ในเวลาราชการ 08:00 - 16:00 น.)',
            size: 'xs',
            color: '#64748B',
            align: 'center',
            wrap: true,
            margin: 'md',
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          // {
          //   type: 'button',
          //   style: 'primary',
          //   color: '#DC2626',
          //   height: 'sm',
          //   action: {
          //     type: 'message',
          //     label: '🚨 อาการฉุกเฉินที่ต้องพบแพทย์',
          //     text: 'อาการฉุกเฉิน',
          //   },
          // },
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📞 โทรหาคลินิก NCDs',
              uri: 'tel:0622710099',
            },
          },
        ],
      },
    },
  };
}

/**
 * 5. Tile 5: "การเตรียมตัวก่อนพบแพทย์"
 */
export function createPreparationGuideFlex() {
  return {
    type: 'flex',
    altText: '📋 ข้อแนะนำการเตรียมตัวก่อนพบแพทย์',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0284C7',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '📋 การเตรียมตัวก่อนพบแพทย์',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: '1. การเจาะเลือดตรวจน้ำตาล/ไขมัน:',
            size: 'xs',
            color: '#0369A1',
            weight: 'bold',
          },
          {
            type: 'text',
            text: '• งดน้ำและอาหารทุกชนิดอย่างน้อย 8-12 ชั่วโมง (จิบน้ำบริสุทธิ์ได้เล็กน้อย)',
            size: 'xs',
            color: '#475569',
            wrap: true,
          },
          {
            type: 'text',
            text: '2. ยาประจำตัว:',
            size: 'xs',
            color: '#0369A1',
            weight: 'bold',
            margin: 'sm',
          },
          {
            type: 'text',
            text: '• นำยาที่รับประทานประจำและฉีดประจำมาแสดงต่อเจ้าหน้าที่ทุกครั้ง (ยาทานหลังอาหารมื้อเช้าให้งดไว้ก่อน แล้วทานหลังเจาะเลือดเสร็จ)',
            size: 'xs',
            color: '#475569',
            wrap: true,
          },
          {
            type: 'text',
            text: '3. เอกสาร:',
            size: 'xs',
            color: '#0369A1',
            weight: 'bold',
            margin: 'sm',
          },
          {
            type: 'text',
            text: '• บัตรประชาชน และใบนัดหมายเดิม',
            size: 'xs',
            color: '#475569',
            wrap: true,
          },
        ],
      },
    },
  };
}

/**
 * 6. Tile 6: "คำแนะนำสุขภาพ"
 */
export function createHealthEducationMenuFlex() {
  return {
    type: 'flex',
    altText: '💚 คำแนะนำสุขภาพสำหรับผู้ป่วย NCDs',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#15803D',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '💚 คำแนะนำสุขภาพ NCDs Care',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: 'เลือกหมวดคำแนะนำทางการแพทย์ที่ต้องการอ่านเพิ่มเติม:',
            size: 'xs',
            color: '#334155',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#16A34A',
            height: 'sm',
            action: {
              type: 'message',
              label: '🥗 1. การรับประทานอาหาร',
              text: 'คำแนะนำการรับประทานอาหาร',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#059669',
            height: 'sm',
            action: {
              type: 'message',
              label: '🌿 2. แพทย์แผนไทย',
              text: 'คำแนะนำแพทย์แผนไทย',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#0284C7',
            height: 'sm',
            action: {
              type: 'message',
              label: '💊 3. การใช้ยาและข้อควรระวัง',
              text: 'คำแนะนำการใช้ยา',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#EA580C',
            height: 'sm',
            action: {
              type: 'message',
              label: '🏃 4. การออกกำลังกายส่งเสริมสุขภาพ',
              text: 'คำแนะนำการออกกำลังกาย',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#7C3AED',
            height: 'sm',
            action: {
              type: 'message',
              label: '🧠 5. ประเมินสุขภาพจิต',
              text: 'คำแนะนำประเมินสุขภาพจิต',
            },
          },
        ],
      },
    },
  };
}

/**
 * 6.4 Sub-Tile: "การออกกำลังกายส่งเสริมสุขภาพ" (Exercise Advice Flex)
 */
export function createExerciseAdviceFlex() {
  return {
    type: 'flex',
    altText: '🏃 คำแนะนำการออกกำลังกายสำหรับผู้ป่วย NCDs - รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#EA580C',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🏃 การออกกำลังกายส่งเสริมสุขภาพ',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: 'คำแนะนำสำหรับผู้ป่วย NCDs โรงพยาบาลคลองหาด',
            color: '#FED7AA',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            backgroundColor: '#FFF7ED',
            cornerRadius: 'md',
            paddingAll: 'md',
            contents: [
              {
                type: 'text',
                text: '⏱️',
                size: 'xl',
                flex: 0,
              },
              {
                type: 'box',
                layout: 'vertical',
                margin: 'md',
                contents: [
                  {
                    type: 'text',
                    text: 'เป้าหมายการออกกำลังกาย',
                    size: 'sm',
                    weight: 'bold',
                    color: '#EA580C',
                  },
                  {
                    type: 'text',
                    text: 'อย่างน้อย 150 นาที/สัปดาห์ หรือ 30 นาที/วัน 5 วัน/สัปดาห์',
                    size: 'xs',
                    color: '#374151',
                    wrap: true,
                    margin: 'xs',
                  },
                ],
              },
            ],
          },
          {
            type: 'separator',
          },
          {
            type: 'text',
            text: '✅ กิจกรรมที่แนะนำสำหรับผู้ป่วย NCDs',
            size: 'sm',
            weight: 'bold',
            color: '#1F2937',
          },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '🚶', size: 'sm', flex: 0 },
                  {
                    type: 'text',
                    text: 'เดินเร็ว — ง่าย เหมาะกับทุกวัย ลดความดันโลหิตได้ดี',
                    size: 'xs',
                    color: '#374151',
                    wrap: true,
                    margin: 'md',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '🏊', size: 'sm', flex: 0 },
                  {
                    type: 'text',
                    text: 'ว่ายน้ำ — ไม่กระแทกข้อ เหมาะกับผู้ที่มีน้ำหนักมาก',
                    size: 'xs',
                    color: '#374151',
                    wrap: true,
                    margin: 'md',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '🚴', size: 'sm', flex: 0 },
                  {
                    type: 'text',
                    text: 'ปั่นจักรยาน — เพิ่มการทำงานของหัวใจและปอด',
                    size: 'xs',
                    color: '#374151',
                    wrap: true,
                    margin: 'md',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '🧘', size: 'sm', flex: 0 },
                  {
                    type: 'text',
                    text: 'โยคะ / ไทชิ — ลดความเครียด เพิ่มความยืดหยุ่น',
                    size: 'xs',
                    color: '#374151',
                    wrap: true,
                    margin: 'md',
                  },
                ],
              },
            ],
          },
          {
            type: 'separator',
          },
          {
            type: 'text',
            text: '⚠️ ข้อควรระวังก่อนออกกำลังกาย',
            size: 'sm',
            weight: 'bold',
            color: '#DC2626',
          },
          {
            type: 'text',
            text: '• หยุดทันทีหากมีอาการเจ็บหน้าอก หอบเหนื่อย หรือหน้ามืด\n• ควรอบอุ่นร่างกาย 5-10 นาทีก่อนเริ่ม\n• ตรวจน้ำตาลในเลือดก่อนออกกำลังกาย (ผู้ป่วยเบาหวาน)\n• ดื่มน้ำให้เพียงพอตลอดการออกกำลังกาย',
            size: 'xs',
            color: '#374151',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDF4',
            cornerRadius: 'md',
            paddingAll: 'md',
            contents: [
              {
                type: 'text',
                text: '💡 เคล็ดลับ: เริ่มต้นจากระยะสั้น แล้วค่อยๆ เพิ่มความเข้มข้น อย่าหักโหมในวันแรก',
                size: 'xs',
                color: '#15803D',
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#EA580C',
            height: 'md',
            action: {
              type: 'message',
              label: '🦴 นัดหมายกายภาพบำบัด',
              text: 'ขอนัดหมายกายภาพบำบัด',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '🔙 กลับเมนูคำแนะนำสุขภาพ',
              text: 'คำแนะนำสุขภาพ',
            },
          },
        ],
      },
    },
  };
}

/**
 * 6.1 Sub-Tile: "คำแนะนำการรับประทานอาหาร" (Diet & Nutrition Education Flex)
 */
export function createDietAdviceFlex() {
  return {
    type: 'flex',
    altText: '🥗 คำแนะนำการรับประทานอาหารสำหรับผู้ป่วย NCDs - รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#16A34A',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🥗 คำแนะนำการรับประทานอาหาร',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'สำหรับผู้ป่วยกลุ่มโรค NCDs (รพ.คลองหาด)',
            color: '#DCFCE7',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDF4',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BBF7D0',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '🍽️ สูตรจัดจานอาหาร 2 : 1 : 1',
                size: 'xs',
                color: '#15803D',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• ผัก 2 ส่วน: ผักใบเขียว ผักต้ม (กากใยสูง ช่วยคุมน้ำตาล)',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• แป้ง 1 ส่วน: ข้าวกล้อง ข้าวซ้อมมือ ขนมปังโฮลวีต',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• เนื้อสัตว์ 1 ส่วน: ปลา อกไก่ เต้าหู้ ไข่ขาว ไขมันต่ำ',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FEF2F2',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FECACA',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '⚠️ อาหารที่ควรหลีกเลี่ยง (ลด หวาน-มัน-เค็ม)',
                size: 'xs',
                color: '#B91C1C',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• งดเครื่องดื่มชงหวาน ชานม น้ำอัดลม ขนมหวาน',
                size: 'xs',
                color: '#475569',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• ลดอาหารรสเค็มจัด ผงชูรส อาหารแปรรูป/หมักดอง',
                size: 'xs',
                color: '#475569',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• เลี่ยงของทอด กะทิ ขนมอบที่มีไขมันทรานส์',
                size: 'xs',
                color: '#475569',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FFFBEB',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FDE68A',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '💡 ข้อแนะนำเพิ่มเติมจากทีมพยาบาล',
                size: 'xs',
                color: '#92400E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'ดื่มน้ำสะอาดวันละ 8-10 แก้ว และเคี้ยวอาหารช้าๆ อย่างน้อย 20 ครั้งต่อคำ เพื่อช่วยการย่อยและการดูดซึมน้ำตาลที่ดีขึ้น',
                size: 'xs',
                color: '#78350F',
                wrap: true,
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'message',
              label: '🥗 คุยกับนักโภชนาการ',
              text: 'คุยกับนักโภชนาการ',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '⬅️ กลับเมนูคำแนะนำสุขภาพ',
              text: 'คำแนะนำสุขภาพ',
            },
          },
        ],
      },
    },
  };
}

/**
 * 6.2 Sub-Tile: "คำแนะนำการใช้ยาและข้อควรระวัง" (Medication Advice Flex)
 */
export function createMedicationAdviceFlex() {
  return {
    type: 'flex',
    altText: '💊 คำแนะนำการใช้ยาและข้อควรระวังสำหรับผู้ป่วย NCDs - รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0284C7',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '💊 คำแนะนำการใช้ยาและข้อควรระวัง',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'สำหรับผู้ป่วยกลุ่มโรค NCDs (รพ.คลองหาด)',
            color: '#E0F2FE',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0F9FF',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BAE6FD',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '💊 การรับประทานยาอย่างถูกวิธี',
                size: 'xs',
                color: '#0369A1',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• ทานยาตามแพทย์สั่งอย่างเคร่งครัด ห้ามหยุดยาหรือปรับขนาดยาเอง',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• ยาหลังอาหาร: ทานยาหลังอาหารทันทีหรือไม่เกิน 15-30 นาที',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• ยาก่อนอาหาร: ทานก่อนอาหาร30นาทีขึ้นไป (ยาเบาหวานต้องทานอาหารตามทันที)',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FFFBEB',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FDE68A',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '⚠️ ข้อควรระวังและข้อปฏิบัติตัว',
                size: 'xs',
                color: '#92400E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• หากลืมทานยา: ให้ทานทันทีที่นึกได้ แต่ถ้าใกล้เวลาอาหารมื้อถัดไปให้ข้ามมื้อที่ลืม (ห้ามเพิ่มยาเป็น 2 เท่าเด็ดขาด)',
                size: 'xs',
                color: '#78350F',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• สังเกตอาการแพ้ยา: ผื่นคัน ปากบวม ตาบวม หายใจลำบาก ให้หยุดยาแล้วมาพบแพทย์ทันที',
                size: 'xs',
                color: '#78350F',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F8FAFC',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#E2E8F0',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '💡 คำแนะนำจากงานเภสัชกรรม',
                size: 'xs',
                color: '#475569',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'นำซองยาเดิม ยาสมุนไพร และอาหารเสริมที่ทานอยู่มาแสดงต่อเภสัชกรทุกครั้งที่มาตรวจตามนัด',
                size: 'xs',
                color: '#64748B',
                wrap: true,
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0284C7',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📋 แบบฟอร์มข้อมูลปรึกษาเภสัช',
              uri: 'https://docs.google.com/forms/d/e/1FAIpQLScj3L97ewiNHY8-lYZG3Bjse4UotPa65nxDGCQSYAVc6CL_fA/viewform?pli=1',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#2563EB',
            height: 'sm',
            action: {
              type: 'message',
              label: '💊 คุยกับเภสัชกร',
              text: 'คุยกับเภสัชกร',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '⬅️ กลับเมนูคำแนะนำสุขภาพ',
              text: 'คำแนะนำสุขภาพ',
            },
          },
        ],
      },
    },
  };
}

/**
 * 6.2.2 Flex Message: "ติดต่อเจ้าหน้าที่/เภสัชกร" (Contact Pharmacist / Pharmacy Flex)
 */
export function createContactPharmacistFlex() {
  return {
    type: 'flex',
    altText: '💊 ติดต่อเจ้าหน้าที่/เภสัชกร - รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#808B3D',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '💊 ติดต่อเจ้าหน้าที่/เภสัชกร',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'งานเภสัชกรรม โรงพยาบาลคลองหาด',
            color: '#ECF3CF',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'ท่านสามารถโทรติดต่อสอบถาม หรือปรึกษาเรื่องยากับเภสัชกรได้ตามข้อมูลด้านล่างนี้ค่ะ',
            size: 'xs',
            color: '#334155',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F5F7EA',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#CFD89D',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '📞 เบอร์โทรศัพท์: 098-256-2900',
                size: 'sm',
                color: '#596424',
                weight: 'bold',
                align: 'center',
              },
              {
                type: 'text',
                text: '(ในเวลาราชการ 08:00-16:00 น.)',
                size: 'xs',
                color: '#64748B',
                align: 'center',
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#808B3D',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📞 โทรหาห้องยา',
              uri: 'tel:0982562900',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '⬅️ กลับเมนูคำแนะนำสุขภาพ',
              text: 'คำแนะนำสุขภาพ',
            },
          },
        ],
      },
    },
  };
}

/**
 * Generate Pharmacist Consultation Patient Info Form Prompt Flex Card
 */
export function createPharmacistFormPromptFlex() {
  return {
    type: 'flex',
    altText: '📋 แบบฟอร์มข้อมูลคนไข้สำหรับประกอบการปรึกษากับเภสัชกร',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0284C7',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '📋 แบบฟอร์มข้อมูลปรึกษาเภสัชกร',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'งานเภสัชกรรม โรงพยาบาลคลองหาด',
            color: '#E0F2FE',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'โปรดพิมพ์ระบุรายละเอียดข้อมูลดังต่อไปนี้ส่งกลับมาในแชทนี้ได้ทันทีค่ะ:',
            size: 'xs',
            color: '#334155',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0F9FF',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BAE6FD',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '1. รายการยาประจำตัว หรือยาที่กำลังรับประทานอยู่',
                size: 'xs',
                color: '#0369A1',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '2. อาการผิดปกติ ปัญหา หรือคำถามเรื่องยาที่ต้องการปรึกษา',
                size: 'xs',
                color: '#0369A1',
                weight: 'bold',
                margin: 'sm',
              },
              {
                type: 'text',
                text: '3. ประวัติการแพ้ยา หรือผลข้างเคียงที่เคยพบ (ถ้ามี)',
                size: 'xs',
                color: '#0369A1',
                weight: 'bold',
                margin: 'sm',
              },
            ],
          },
          {
            type: 'text',
            text: '💡 ข้อความของท่านจะถูกส่งตรงถึงเภสัชกรประจำคลินิก และจะทำการตอบกลับผ่าน LINE นี้โดยเร็วที่สุดค่ะ',
            size: 'xs',
            color: '#0284C7',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0284C7',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📋 กรอกแบบฟอร์ม Google Form',
              uri: 'https://docs.google.com/forms/d/e/1FAIpQLScj3L97ewiNHY8-lYZG3Bjse4UotPa65nxDGCQSYAVc6CL_fA/viewform?pli=1',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '💬 พิมพ์ข้อความถึงเภสัชกร',
              text: 'คุยกับเภสัชกร',
            },
          },
        ],
      },
    },
  };
}

/**
 * 6.3 Sub-Tile: "คำแนะนำการจัดการความเครียดและการนอนหลับ" (Stress & Sleep Advice Flex)
 */
export function createStressAndSleepAdviceFlex() {
  return {
    type: 'flex',
    altText: '🧠 คำแนะนำการประเมินสุขภาพจิตและความเครียด - รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#7C3AED',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🧠 การประเมินสุขภาพจิตและความเครียด',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: 'ข้อแนะนำสำคัญก่อนเริ่มประเมิน (รพ.คลองหาด)',
            color: '#EDE9FE',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#EFF6FF',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BFDBFE',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '📌 คำแนะนำสำคัญก่อนเริ่มประเมิน',
                size: 'xs',
                color: '#1E40AF',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• เกณฑ์ 2 สัปดาห์: \nย้อนนึกถึงความรู้สึกใน 14 วันที่ผ่านมาเท่านั้น ไม่ใช่แค่ความรู้สึกชั่ววูบวันนี้',
                size: 'xs',
                color: '#1E3A8A',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• ตอบตามความจริง: \nซื่อสัตย์กับตนเอง ห้ามลดหรือเพิ่มระดับอาการ',
                size: 'xs',
                color: '#1E3A8A',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• เลือกเวลาที่พร้อม: \nทำขณะสมองโปร่ง หลีกเลี่ยงทำหลังเผชิญเหตุสะเทือนใจสดๆ',
                size: 'xs',
                color: '#1E3A8A',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• ความถี่: \nไม่มีเลย | บางวัน | มีบ่อย | มีเกือบทุกวัน',
                size: 'xs',
                color: '#1E3A8A',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FEF2F2',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FECACA',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '⚠️ ข้อควรระวังที่ต้องตระหนัก',
                size: 'xs',
                color: '#B91C1C',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• ไม่ใช่การวินิจฉัยโรค: \nเป็นการคัดกรองเบื้องต้น ไม่สามารถระบุว่าเป็นโรคซึมเศร้า',
                size: 'xs',
                color: '#991B1B',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• อาการจากโรคทางกาย: \nอ่อนเพลีย/นอนไม่หลับ อาจเกิดจากไทรอยด์ต่ำ หรือผลข้างเคียงยา',
                size: 'xs',
                color: '#991B1B',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• อารมณ์เศร้าตามธรรมชาติ: \nความโศกเศร้าจากการสูญเสียทำให้คะแนนสูงชั่วคราวได้',
                size: 'xs',
                color: '#991B1B',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '🚨 คิดทำร้ายตนเอง: \nหากมีข้อถามถึงความคิดอยากตาย แล้วตอบว่า "มี" ควรรีบขอความช่วยเหลือทันที!',
                size: 'xs',
                color: '#DC2626',
                weight: 'bold',
                margin: 'sm',
                wrap: true,
              },
            ],
          },
          // {
          //   type: 'box',
          //   layout: 'vertical',
          //   backgroundColor: '#F5F3FF',
          //   cornerRadius: 'md',
          //   paddingAll: 'md',
          //   borderColor: '#DDD6FE',
          //   borderWidth: '1px',
          //   contents: [
          //     {
          //       type: 'text',
          //       text: '📞 ติดต่อขอความช่วยเหลือ (ฟรีตลอด 24 ชม.)',
          //       size: 'xs',
          //       color: '#5B21B6',
          //       weight: 'bold',
          //     },
          //     {
          //       type: 'text',
          //       text: '• งานสุขภาพจิต รพ.คลองหาด: 061-3961769 (08:30-16:30 น.)\n• 🚨 สายด่วนสุขภาพจิต: โทร 1323 (ฟรีตลอด 24 ชั่วโมง)',
          //       size: 'xs',
          //       color: '#4C1D95',
          //       margin: 'xs',
          //       wrap: true,
          //     },
          //   ],
          // },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#7C3AED',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📋 แบบประเมินสุขภาพจิต (Google Form)',
              uri: 'https://docs.google.com/forms/d/e/1FAIpQLSddhwdT8RDyYBQ1AaTJfUVQXhJfXhyyJUASIfSSLk2z-JwVzg/viewform',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📊 ประเมินความเครียด DMH Check-in',
              uri: 'https://checkin.dmh.go.th/main/index.php?type=1',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#6D28D9',
            height: 'sm',
            action: {
              type: 'message',
              label: '📞 ติดต่อเจ้าหน้าที่สุขภาพจิต',
              text: 'ติดต่อเจ้าหน้าที่สุขภาพจิต',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#DC2626',
            height: 'sm',
            action: {
              type: 'uri',
              label: '🚨 สายด่วนสุขภาพจิต 1323',
              uri: 'tel:1323',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '⬅️ กลับเมนูคำแนะนำสุขภาพ',
              text: 'คำแนะนำสุขภาพ',
            },
          },
        ],
      },
    },
  };
}

/**
 * 4.1 Sub-Tile: "ติดต่อเจ้าหน้าที่งานสุขภาพจิตและยาเสพติด" (Mental Health & Addiction Unit Contact Flex)
 */
export function createContactMentalHealthStaffFlex() {
  return {
    type: 'flex',
    altText: '🧠 ช่องทางติดต่อเจ้าหน้าที่งานสุขภาพจิตและยาเสพติด รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#6D28D9',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🧠 งานสุขภาพจิตและยาเสพติด',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: 'โรงพยาบาลคลองหาด (ติดต่อเจ้าหน้าที่)',
            color: '#DDD6FE',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F5F3FF',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#DDD6FE',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '📞 เบอร์โทรศัพท์แผนก:',
                size: 'xs',
                color: '#5B21B6',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '061-3961769',
                size: 'md',
                color: '#6D28D9',
                weight: 'bold',
                margin: 'xs',
              },
              {
                type: 'text',
                text: '💬 LINE ID: 061-3961769',
                size: 'xs',
                color: '#4C1D95',
                margin: 'sm',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '⏰ เวลาทำการ: \n ในเวลาราชการ 08:30 น. - 16:30 น. \n (จันทร์ - ศุกร์)',
                align: 'center',
                size: 'xs',
                color: '#64748B',
                margin: 'sm',
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#6D28D9',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📞 โทร 0613961769',
              uri: 'tel:0613961769',
            },
          },
          // {
          //   type: 'button',
          //   style: 'primary',
          //   color: '#DC2626',
          //   height: 'sm',
          //   action: {
          //     type: 'uri',
          //     label: '🚨 สายด่วน 1323',
          //     uri: 'tel:1323',
          //   },
          // },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '⬅️ กลับเมนูคำแนะนำสุขภาพ',
              text: 'คำแนะนำสุขภาพ',
            },
          },
        ],
      },
    },
  };
}

export function createMentalHealthAndStressAdviceFlex() {
  return createStressAndSleepAdviceFlex();
}

/**
 * 6.5 Sub-Tile: "คำแนะนำการบริการแพทย์แผนไทย" (Thai Traditional Medicine Advice Flex)
 */
export function createThaiMedicineAdviceFlex() {
  return {
    type: 'flex',
    altText: '🌿 คำแนะนำการบริการแพทย์แผนไทย - รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#059669',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🌿 การบริการแพทย์แผนไทย',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: 'กลุ่มงานแพทย์แผนไทยและการแพทย์ทางเลือก รพ.คลองหาด',
            color: '#D1FAE5',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#ECFDF5',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#A7F3D0',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '💆‍♂️ บริการหัตถการแพทย์แผนไทย',
                size: 'xs',
                color: '#047857',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• นวดรักษา & ประคบสมุนไพร: ลดปวดกล้ามเนื้อ ปวดหลัง ปวดคอบ่าไหล่ ออฟฟิศซินโดรม',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• อบสมุนไพรสด: ช่วยการไหลเวียนโลหิต ผ่อนคลาย ขับเหงื่อและสิ่งตกค้าง',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• ทับหม้อเกลือ: การดูแลฟื้นฟูสุขภาพมารดาหลังคลอดบุตร',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FEF3C7',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FDE68A',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '🌱 ยาสมุนไพรและการดูแลสุขภาพผู้ป่วย NCDs',
                size: 'xs',
                color: '#B45309',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• จ่ายยาสมุนไพรในบัญชียาหลักแห่งชาติ (เช่น ขมิ้นชัน มะขามป้อม ยาน้ำมันไพล) ร่วมกับการตรวจประเมินโดยแพทย์แผนไทย',
                size: 'xs',
                color: '#78350F',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• ให้คำแนะนำการปรับธาตุตามเจ้าเรือนและการใช้สมุนไพรอย่างปลอดภัยในผู้ป่วยโรคเรื้อรัง',
                size: 'xs',
                color: '#78350F',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F3F4F6',
            cornerRadius: 'md',
            paddingAll: 'md',
            contents: [
              {
                type: 'text',
                text: '💡 ข้อควรระวังก่อนรับบริการหัตถการ:',
                size: 'xs',
                color: '#374151',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• งดรับบริการนวดอบประคบขณะมีไข้สูง (>38.5°C) หรือความดันโลหิตสูงจัด (>160/100 mmHg)\n• โปรดแจ้งโรคประจำตัวและภาวะตั้งครรภ์ให้เจ้าหน้าที่ทราบก่อนทุกครั้ง',
                size: 'xs',
                color: '#4B5563',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#059669',
            height: 'sm',
            action: {
              type: 'message',
              label: '🌿 ติดต่อ/จองคิวแพทย์แผนไทย',
              text: 'ติดต่อแพทย์แผนไทย',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '⬅️ กลับเมนูคำแนะนำสุขภาพ',
              text: 'คำแนะนำสุขภาพ',
            },
          },
        ],
      },
    },
  };
}





/**
 * Generate Role Selection Flex Message (Separating Patient vs Admin/Staff)
 */
export function createRoleSelectionFlexMessage() {
  return {
    type: 'flex',
    altText: '🏥 ยินดีต้อนรับสู่ KHH Safe-Connect โปรดเลือกประเภทผู้ใช้งานเพื่อลงทะเบียน',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0B6F8A',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🏥 KHH SAFE-CONNECT',
            color: '#13A89E',
            size: 'xs',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'ยินดีต้อนรับสู่ระบบบริการสุขภาพ',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
            margin: 'xs',
          },
          {
            type: 'text',
            text: 'โรงพยาบาลคลองหาด (KHH)',
            color: '#E2E8F0',
            size: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'โปรดเลือกสถานะผู้ใช้งาน เพื่อลงทะเบียนรับการแจ้งเตือนและข้อมูลเฉพาะบุคคล:',
            size: 'xs',
            color: '#475569',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        paddingAll: 'lg',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'md',
            action: {
              type: 'message',
              label: '🟢 ผู้ป่วย / ญาติผู้ดูแล',
              text: 'ลงทะเบียนผู้ป่วย',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'md',
            action: {
              type: 'message',
              label: '🔵 เจ้าหน้าที่ / พยาบาล / แพทย์',
              text: 'ลงทะเบียนเจ้าหน้าที่',
            },
          },
        ],
      },
    },
  };
}

/**
 * Generate Patient Registration Instructions
 */
export function createPatientRegistrationPromptFlex() {
  return {
    type: 'flex',
    altText: '📌 ลงทะเบียนผู้ป่วย: พิมพ์หมายเลข HN ในแชต หรือ สแกนบาร์โค้ดใบนัด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0D9488',
        paddingAll: 'md',
        contents: [
          {
            type: 'text',
            text: '🟢 ลงทะเบียนผู้ป่วย NCDs',
            color: '#FFFFFF',
            size: 'sm',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'โรงพยาบาลคลองหาด (KHH Safe-Connect)',
            color: '#CCFBF1',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDFA',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#CCFBF1',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '✍️ วิธีที่ 1: พิมพ์เลขบัตรประชาชน 13 หลัก',
                size: 'xs',
                color: '#0F766E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'พิมพ์เลขบัตรประชาชน 13 หลักของผู้ป่วย (เฉพาะตัวเลข) ส่งมาในแชทนี้ได้ทันทีค่ะ',
                size: 'xs',
                color: '#334155',
                wrap: true,
                margin: 'xs',
              },
              {
                type: 'text',
                text: '💡 ตัวอย่าง: 1234567890123 หรือ พิมพ์ HN เช่น 000059754',
                size: 'xs',
                color: '#64748B',
                margin: 'xs',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F8FAFC',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#E2E8F0',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '📷 วิธีที่ 2: สแกนบาร์โค้ดใบนัด HOSxP',
                size: 'xs',
                color: '#1E293B',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'กดปุ่มด้านล่างเพื่อเปิดกล้องส่องบาร์โค้ดมุมใบนัด โดยไม่ต้องพิมพ์ตัวเลข',
                size: 'xs',
                color: '#64748B',
                wrap: true,
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#2563EB',
            height: 'sm',
            action: {
              type: 'uri',
              label: '✍️ กดเพื่อพิมพ์เลขบัตรประชาชน 13 หลัก',
              uri: `https://line.me/R/oaMessage/${(process.env.NEXT_PUBLIC_LINE_OA_BASIC_ID || '@745sionk').trim()}/?`,
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📷 เปิดกล้องสแกนบาร์โค้ดใบนัด HOSxP',
              uri: `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://khhncd.khostime.site'}/scan-hn`,
            },
          },
        ],
      },
    },
  };
}

/**
 * Generate Interactive Role Confirmation Flex Card (Self vs. Caregiver)
 */
export function createRoleConfirmationFlex(
  hn: string,
  patientName: string,
  maskedCid: string
) {
  return {
    type: 'flex',
    altText: `📋 ยืนยันสถานะการลงทะเบียน: คุณ${patientName} (${hn})`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0D9488',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '📋 เลือกสถานะการลงทะเบียน',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'โรงพยาบาลคลองหาด (HOSxP Verified)',
            color: '#CCFBF1',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'พบข้อมูลผู้ป่วยในระบบ HOSxP เรียบร้อยแล้วค่ะ โปรดเลือกสถานะการลงทะเบียนของท่าน:',
            size: 'xs',
            color: '#334155',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDFA',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#CCFBF1',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: `คุณ${patientName}`,
                size: 'sm',
                color: '#0F766E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `${hn} | เลขบัตร: ${maskedCid}`,
                size: 'xs',
                color: '#64748B',
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'message',
              label: '👤 ฉันคือผู้ป่วย (ลงทะเบียนเอง)',
              text: `REGISTER_SELF:${hn}`,
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#2563EB',
            height: 'sm',
            action: {
              type: 'message',
              label: '👥 ฉันคือ ญาติ/ผู้ดูแล (ลงทะเบียนแทน)',
              text: `REGISTER_CAREGIVER:${hn}`,
            },
          },
        ],
      },
    },
  };
}

/**
 * Generate Staff Registration Instructions
 */
export function createStaffRegistrationPromptFlex() {
  return {
    type: 'flex',
    altText: '📌 ลงทะเบียนเจ้าหน้าที่: โปรดพิมพ์รหัสพนักงาน/รหัสเจ้าหน้าที่',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#1E40AF',
        paddingAll: 'md',
        contents: [
          {
            type: 'text',
            text: '🔵 ลงทะเบียนเจ้าหน้าที่ รพ.คลองหาด',
            color: '#FFFFFF',
            size: 'sm',
            weight: 'bold',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: 'โปรดพิมพ์ Username (ชื่อผู้ใช้งาน HOSxP) หรือรหัสประจำตัวเจ้าหน้าที่ส่งกลับมาในแชตนี้ค่ะ',
            size: 'xs',
            color: '#334155',
            wrap: true,
            weight: 'bold',
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#EFF6FF',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BFDBFE',
            borderWidth: '1px',
            margin: 'sm',
            contents: [
              {
                type: 'text',
                text: '💡 ตัวอย่างการพิมพ์:',
                size: 'xs',
                color: '#1E40AF',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• พิมพ์ Username HOSxP เช่น kitti หรือ nurse_ncd\n• พิมพ์รหัสพนักงาน เช่น STAFF-1001 หรือ NURSE-001',
                size: 'xs',
                color: '#475569',
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#1E40AF',
            height: 'sm',
            action: {
              type: 'uri',
              label: '✍️ กดเพื่อพิมพ์รหัสเจ้าหน้าที่ (STAFF-)',
              uri: `https://line.me/R/oaMessage/${(process.env.NEXT_PUBLIC_LINE_OA_BASIC_ID || '@745sionk').trim()}/?STAFF-`,
            },
          },
        ],
      },
    },
  };
}

/**
 * Generate Registration Success Card
 */
export function createRegistrationSuccessFlex(
  role: 'patient' | 'staff',
  name: string,
  idCode: string,
  lineUserId: string
) {
  const isPatient = role === 'patient';

  return {
    type: 'flex',
    altText: `✅ ลงทะเบียนสำเร็จ: คุณ${name}`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: isPatient ? '#0D9488' : '#1E40AF',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: isPatient ? '🟢 ผูกบัญชีผู้ป่วยสำเร็จ' : '🔵 ผูกบัญชีเจ้าหน้าที่สำเร็จ',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: `ยินดีต้อนรับ คุณ${name}`,
            size: 'md',
            weight: 'bold',
            color: '#0F172A',
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F8FAFC',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#E2E8F0',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: `${isPatient ? 'HN' : 'รหัสพนักงาน'}: ${idCode}`,
                size: 'xs',
                color: '#475569',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `LINE User ID: ${lineUserId}`,
                size: 'xs',
                color: '#94A3B8',
                margin: 'xs',
              },
            ],
          },
          {
            type: 'text',
            text: isPatient
              ? 'ระบบจะส่งแจ้งเตือนวันนัดหมายและคำแนะนำสุขภาพมายัง LINE นี้โดยอัตโนมัติ'
              : 'ท่านจะได้รับการแจ้งเตือนเคสผู้ป่วยขาดนัด และข้อความ Reply เร่งด่วนผ่าน LINE นี้',
            size: 'xs',
            color: '#64748B',
            wrap: true,
          },
        ],
      },
    },
  };
}

/**
 * Generate Patient Info Verification Flex Card (Full Name, HN, CID, Registered Clinics)
 */
export function createPatientInfoVerificationFlex(
  patientName: string = 'สมชาย ดีเลิศ',
  hn: string = 'HN-98302',
  cid: string = '1-2345-XXXXX-12-3',
  registeredClinics: string[] = ['🩺 คลินิกเบาหวาน (DM)', '🩺 คลินิกความดันโลหิตสูง (HT)'],
  vitals?: {
    weight?: string;
    height?: string;
    bmi?: string;
    bps?: string;
    bpd?: string;
  }
) {
  const hasClinics = registeredClinics && registeredClinics.length > 0;

  const clinicContents = hasClinics
    ? registeredClinics.map((c) => ({
        type: 'box',
        layout: 'horizontal',
        margin: 'xs',
        contents: [
          {
            type: 'text',
            text: '•',
            size: 'xs',
            color: '#0F766E',
            flex: 0,
          },
          {
            type: 'text',
            text: c,
            size: 'xs',
            color: '#0F172A',
            weight: 'bold',
            margin: 'xs',
            flex: 1,
          },
        ],
      }))
    : [
        {
          type: 'box',
          layout: 'horizontal',
          margin: 'xs',
          contents: [
            {
              type: 'text',
              text: '⚠️ คุณไม่ได้เป็นคนไข้ของคลินิก',
              size: 'xs',
              color: '#DC2626',
              weight: 'bold',
              margin: 'xs',
              wrap: true,
            },
          ],
        },
      ];

  return {
    type: 'flex',
    altText: `✅ ยืนยันข้อมูลผู้ป่วยสำเร็จ: คุณ${patientName} (${hn})`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0D9488',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '✅ ยืนยันข้อมูลผู้ป่วยสำเร็จ',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'โรงพยาบาลคลองหาด (HOSxP Verified)',
            color: '#CCFBF1',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDFA',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#CCFBF1',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '👤 ข้อมูลผู้ป่วยลงทะเบียน',
                size: 'xs',
                color: '#0F766E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `คุณ${patientName}`,
                size: 'md',
                color: '#0F172A',
                weight: 'bold',
                margin: 'xs',
              },
              {
                type: 'text',
                text: `${hn} | เลขบัตร: ${cid}`,
                size: 'xs',
                color: '#475569',
                margin: 'xs',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F8FAFC',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#E2E8F0',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '🏥 คลินิกประจำที่ลงทะเบียนไว้:',
                size: 'xs',
                color: '#334155',
                weight: 'bold',
              },
              ...clinicContents,
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F1F5F9',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#CBD5E1',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '🩺 ผลคัดกรองสัญญาณชีพล่าสุด (HOSxP):',
                size: 'xs',
                color: '#334155',
                weight: 'bold',
                wrap: true,
              },
              {
                type: 'text',
                text: `⚖️ น้ำหนัก: ${vitals?.weight || '62.5'} kg | ส่วนสูง: ${vitals?.height || '165'} cm | BMI: ${vitals?.bmi || '22.9'} (ปกติ)`,
                size: 'xs',
                color: '#1E293B',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: `🩺 ความดันโลหิต (BP): ${vitals?.bps || '124'}/${vitals?.bpd || '82'} mmHg 🟢 ปกติ`,
                size: 'xs',
                color: '#059669',
                weight: 'bold',
                margin: 'xs',
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: hasClinics
          ? [
              {
                type: 'button',
                style: 'primary',
                color: '#0D9488',
                height: 'sm',
                action: {
                  type: 'message',
                  label: '🔒 ดูผลตรวจสุขภาพ & สัญญาณชีพ (คุ้มครอง PDPA)',
                  text: 'ผลตรวจสุขภาพ',
                },
              },
              {
                type: 'button',
                style: 'secondary',
                height: 'sm',
                action: {
                  type: 'message',
                  label: '🌿 อ่านคู่มือการดูแลสุขภาพดี',
                  text: 'ข้อมูลสุขภาพดี',
                },
              },
            ]
          : [
              {
                type: 'button',
                style: 'primary',
                color: '#059669',
                height: 'sm',
                action: {
                  type: 'message',
                  label: '🌿 ดูคู่มือดูแลสุขภาพดี & ป้องกันโรค NCDs',
                  text: 'ข้อมูลสุขภาพดี',
                },
              },
            ],
      },
    },
  };
}

/**
 * Generate PDPA Protection PIN Prompt Flex Card
 */
export function createPdpaPinPromptFlex(patientName: string = 'ผู้ป่วย', hn: string = 'HN-XXXXX') {
  const lineOaBasicId = (process.env.NEXT_PUBLIC_LINE_OA_BASIC_ID || '@745sionk').trim();

  return {
    type: 'flex',
    altText: '🔒 โปรดยืนยันรหัสผ่านเพื่อเปิดดูผลตรวจสุขภาพ (PDPA Protected)',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#475569',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🔒 ยืนยันรหัสผ่านเปิดดูผลตรวจสุขภาพ',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: 'ข้อมูลสุขภาพส่วนบุคคลได้รับการคุ้มครองตาม พ.ร.บ. PDPA',
            color: '#E2E8F0',
            size: 'xs',
            margin: 'xs',
            wrap: true,
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F8FAFC',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#E2E8F0',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '👤 บัญชีผู้ป่วย:',
                size: 'xs',
                color: '#64748B',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `คุณ${patientName} (${hn})`,
                size: 'sm',
                color: '#0F172A',
                weight: 'bold',
                margin: 'xs',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FEF3C7',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FDE68A',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '🔑 วิธีการปลดล็อกดูผลตรวจ:',
                size: 'xs',
                color: '#92400E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'โปรดส่งรหัสผ่านโดยพิมพ์ PIN- ตามด้วยเลข 4 หลักสุดท้ายของบัตรประชาชนผู้ป่วย',
                size: 'xs',
                color: '#78350F',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '💡 ตัวอย่าง: เลขบัตรลงด้วย 1234 ให้พิมพ์ PIN-1234 หรือ 1234',
                size: 'xs',
                color: '#B45309',
                weight: 'bold',
                margin: 'sm',
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0F766E',
            height: 'sm',
            action: {
              type: 'uri',
              label: '🔓 กดเพื่อพิมพ์รหัสยืนยัน (PIN-)',
              uri: `https://line.me/R/oaMessage/${lineOaBasicId}/?PIN-`,
            },
          },
        ],
      },
    },
  };
}

/**
 * Generate Full Patient Vitals & Lab Results Flex Card (Weight, Height, BMI, BP, FBS, HbA1c, eGFR)
 */
export function createPatientVitalsFlex(
  patientName: string = 'สมชาย ดีเลิศ',
  hn: string = 'HN-98302',
  vitals?: {
    weight?: string;
    height?: string;
    bmi?: string;
    bps?: string;
    bpd?: string;
    fbs?: string;
    hba1c?: string;
    egfr?: string;
    cholesterol?: string;
    checkDate?: string;
  }
) {
  const v = {
    weight: vitals?.weight || '62.5',
    height: vitals?.height || '165',
    bmi: vitals?.bmi || '22.9',
    bps: vitals?.bps || '124',
    bpd: vitals?.bpd || '82',
    fbs: vitals?.fbs || '112',
    hba1c: vitals?.hba1c || '6.5',
    egfr: vitals?.egfr || '88',
    cholesterol: vitals?.cholesterol || '185',
    checkDate: vitals?.checkDate || 'ล่าสุดสดจาก HOSxP',
  };

  const bmiVal = parseFloat(v.bmi) || 22.9;
  const bmiStatusLabel = bmiVal < 18.5 ? '🔴 น้ำหนักน้อยกว่าเกณฑ์' : bmiVal <= 22.9 ? '🟢 น้ำหนักอยู่ในเกณฑ์ปกติ' : bmiVal <= 24.9 ? '🟡 น้ำหนักเกิน (ท้วม)' : '🔴 ภาวะอ้วน (เสี่ยง NCDs)';
  const bmiBg = bmiVal <= 22.9 && bmiVal >= 18.5 ? '#DCFCE7' : bmiVal <= 24.9 ? '#FEF3C7' : '#FEE2E2';
  const bmiColor = bmiVal <= 22.9 && bmiVal >= 18.5 ? '#15803D' : bmiVal <= 24.9 ? '#B45309' : '#B91C1C';

  const bpsVal = parseInt(v.bps) || 124;
  const bpStatusLabel = bpsVal < 120 ? '🟢 ความดันโลหิตปกติ (<120/80)' : bpsVal <= 139 ? '🟡 ความดันเริ่มสูง (120-139)' : '🔴 ความดันสูงกว่าเกณฑ์ (≥140)';
  const bpBg = bpsVal < 120 ? '#DCFCE7' : bpsVal <= 139 ? '#FEF3C7' : '#FEE2E2';
  const bpColor = bpsVal < 120 ? '#15803D' : bpsVal <= 139 ? '#B45309' : '#B91C1C';

  return {
    type: 'flex',
    altText: `📊 สรุปผลตรวจสุขภาพ & สัญญาณชีพ: คุณ${patientName} (${hn})`,
    contents: {
      type: 'bubble',
      size: 'giga',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0F766E',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '📊 สรุปผลตรวจสุขภาพ & สัญญาณชีพ',
            color: '#FFFFFF',
            size: 'lg',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: `โรงพยาบาลคลองหาด (${v.checkDate})`,
            color: '#CCFBF1',
            size: 'xs',
            margin: 'xs',
            wrap: true,
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'lg',
        contents: [
          // Patient Identity Box
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDFA',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#99F6E4',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '👤 ผู้ป่วยลงทะเบียน:',
                size: 'xs',
                color: '#0D9488',
                weight: 'bold',
              },
              {
                type: 'text',
                text: `คุณ${patientName}`,
                size: 'md',
                color: '#0F172A',
                weight: 'bold',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: `หมายเลข HN: ${hn}`,
                size: 'xs',
                color: '#475569',
                margin: 'xs',
              },
            ],
          },

          // Section 1: Body Metrics (Weight, Height, BMI)
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F8FAFC',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#E2E8F0',
            borderWidth: '1px',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: '⚖️ ร่างกาย & ดัชนีมวลกาย (BMI)',
                size: 'sm',
                color: '#1E293B',
                weight: 'bold',
                wrap: true,
              },
              {
                type: 'box',
                layout: 'horizontal',
                spacing: 'md',
                margin: 'xs',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    cornerRadius: 'sm',
                    paddingAll: 'sm',
                    borderColor: '#CBD5E1',
                    borderWidth: '1px',
                    contents: [
                      {
                        type: 'text',
                        text: 'น้ำหนัก',
                        size: 'xxs',
                        color: '#64748B',
                      },
                      {
                        type: 'text',
                        text: `${v.weight} kg`,
                        size: 'sm',
                        weight: 'bold',
                        color: '#0F172A',
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    cornerRadius: 'sm',
                    paddingAll: 'sm',
                    borderColor: '#CBD5E1',
                    borderWidth: '1px',
                    contents: [
                      {
                        type: 'text',
                        text: 'ส่วนสูง',
                        size: 'xxs',
                        color: '#64748B',
                      },
                      {
                        type: 'text',
                        text: `${v.height} cm`,
                        size: 'sm',
                        weight: 'bold',
                        color: '#0F172A',
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    cornerRadius: 'sm',
                    paddingAll: 'sm',
                    borderColor: '#CBD5E1',
                    borderWidth: '1px',
                    contents: [
                      {
                        type: 'text',
                        text: 'ค่า BMI',
                        size: 'xxs',
                        color: '#64748B',
                      },
                      {
                        type: 'text',
                        text: `${v.bmi}`,
                        size: 'sm',
                        weight: 'bold',
                        color: '#0F766E',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'box',
                layout: 'vertical',
                backgroundColor: bmiBg,
                cornerRadius: 'sm',
                paddingAll: 'sm',
                margin: 'xs',
                contents: [
                  {
                    type: 'text',
                    text: `สถานะ BMI: ${bmiStatusLabel}`,
                    size: 'xs',
                    color: bmiColor,
                    weight: 'bold',
                    wrap: true,
                  },
                ],
              },
            ],
          },

          // Section 2: Blood Pressure (BP)
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDF4',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BBF7D0',
            borderWidth: '1px',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: '🩺 ความดันโลหิต (Blood Pressure)',
                size: 'sm',
                color: '#166534',
                weight: 'bold',
                wrap: true,
              },
              {
                type: 'box',
                layout: 'horizontal',
                spacing: 'md',
                margin: 'xs',
                contents: [
                  {
                    type: 'text',
                    text: `${v.bps} / ${v.bpd}`,
                    size: 'xl',
                    color: '#15803D',
                    weight: 'bold',
                    flex: 0,
                  },
                  {
                    type: 'text',
                    text: 'mmHg',
                    size: 'xs',
                    color: '#475569',
                    align: 'start',
                    gravity: 'bottom',
                    flex: 1,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'vertical',
                backgroundColor: bpBg,
                cornerRadius: 'sm',
                paddingAll: 'sm',
                margin: 'xs',
                contents: [
                  {
                    type: 'text',
                    text: `ประเมิน: ${bpStatusLabel}`,
                    size: 'xs',
                    color: bpColor,
                    weight: 'bold',
                    wrap: true,
                  },
                ],
              },
            ],
          },

          // Section 3: Laboratory Results (FBS, HbA1c, eGFR, Cholesterol)
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#EFF6FF',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BFDBFE',
            borderWidth: '1px',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: '🧪 ผลแล็บห้องปฏิบัติการ (Lab Results)',
                size: 'sm',
                color: '#1E40AF',
                weight: 'bold',
                wrap: true,
              },

              // Item 1: FBS
              {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                cornerRadius: 'sm',
                paddingAll: 'sm',
                borderColor: '#DBEAFE',
                borderWidth: '1px',
                contents: [
                  {
                    type: 'text',
                    text: '🍬 น้ำตาลก่อนอาหาร (FBS):',
                    size: 'xs',
                    color: '#334155',
                    weight: 'bold',
                  },
                  {
                    type: 'text',
                    text: `${v.fbs} mg/dL  (🟡 100-125 mg/dL = เสี่ยงเบาหวาน)`,
                    size: 'xs',
                    color: '#1E293B',
                    margin: 'xs',
                    wrap: true,
                  },
                ],
              },

              // Item 2: HbA1c
              {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                cornerRadius: 'sm',
                paddingAll: 'sm',
                borderColor: '#DBEAFE',
                borderWidth: '1px',
                contents: [
                  {
                    type: 'text',
                    text: '🩸 น้ำตาลสะสม (HbA1c):',
                    size: 'xs',
                    color: '#334155',
                    weight: 'bold',
                  },
                  {
                    type: 'text',
                    text: `${v.hba1c} %  (🟢 < 6.5% = ควบคุมน้ำตาลได้ดี)`,
                    size: 'xs',
                    color: '#15803D',
                    weight: 'bold',
                    margin: 'xs',
                    wrap: true,
                  },
                ],
              },

              // Item 3: eGFR
              {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                cornerRadius: 'sm',
                paddingAll: 'sm',
                borderColor: '#DBEAFE',
                borderWidth: '1px',
                contents: [
                  {
                    type: 'text',
                    text: '🫘 ค่าการทำงานของไต (eGFR):',
                    size: 'xs',
                    color: '#334155',
                    weight: 'bold',
                  },
                  {
                    type: 'text',
                    text: `${v.egfr} mL/min/1.73m²  (🟢 ≥ 60 = ไตทำงานดี)`,
                    size: 'xs',
                    color: '#15803D',
                    weight: 'bold',
                    margin: 'xs',
                    wrap: true,
                  },
                ],
              },

              // Item 4: Cholesterol
              {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                cornerRadius: 'sm',
                paddingAll: 'sm',
                borderColor: '#DBEAFE',
                borderWidth: '1px',
                contents: [
                  {
                    type: 'text',
                    text: '🥑 ไขมันรวม (Cholesterol):',
                    size: 'xs',
                    color: '#334155',
                    weight: 'bold',
                  },
                  {
                    type: 'text',
                    text: `${v.cholesterol} mg/dL  (🟢 < 200 mg/dL = ปกติ)`,
                    size: 'xs',
                    color: '#15803D',
                    weight: 'bold',
                    margin: 'xs',
                    wrap: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0F766E',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📞 สอบถามพยาบาลคลินิก NCDs (06-2271-0099)',
              uri: 'tel:0622710099',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '🌿 อ่านคู่มือการดูแลสุขภาพดี',
              text: 'ข้อมูลสุขภาพดี',
            },
          },
        ],
      },
    },
  };
}

/**
 * Generate General Wellness & Prevention Flex Card for Non-chronic Patients
 */
export function createGeneralWellnessFlexMessage() {
  return {
    type: 'flex',
    altText: '🌿 ข้อมูลสุขภาพดี & การป้องกันโรค NCDs - รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#059669',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🌿 คู่มือดูแลสุขภาพดี & ป้องกันโรค NCDs',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'คำแนะนำการส่งเสริมสุขภาพสำหรับประชาชน - รพ.คลองหาด',
            color: '#D1FAE5',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'ยินดีด้วยค่ะ! ท่านไม่มีประวัติป่วยด้วยโรคเรื้อรัง (NCDs) มาร่วมรักษาสุขภาพให้แข็งแรง เพื่อป้องกันโรคในระยะยาวด้วยหลัก 4 อ. ดังนี้ค่ะ:',
            size: 'xs',
            color: '#334155',
            wrap: true,
            weight: 'bold',
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F0FDF4',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#BBF7D0',
            borderWidth: '1px',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: '🥗 1. อาหาร 2:1:1 (ลดหวาน มัน เค็ม)',
                size: 'xs',
                color: '#166534',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'เน้นผัก 2 ส่วน, ข้าวแป้ง 1 ส่วน, โปรตีน 1 ส่วน เลี่ยงน้ำหวานและอาหารแปรรูป',
                size: 'xs',
                color: '#475569',
                wrap: true,
              },
              {
                type: 'separator',
                color: '#DCFCE7',
                margin: 'xs',
              },
              {
                type: 'text',
                text: '🏃 2. ออกกำลังกายสม่ำเสมอ',
                size: 'xs',
                color: '#166534',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'ขยับร่างกายอย่างน้อย 150 นาที/สัปดาห์ (วันละ 30 นาที 5 วัน)',
                size: 'xs',
                color: '#475569',
                wrap: true,
              },
              {
                type: 'separator',
                color: '#DCFCE7',
                margin: 'xs',
              },
              {
                type: 'text',
                text: '😴 3. อารมณ์และการนอนหลับ',
                size: 'xs',
                color: '#166534',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'นอนหลับ 7-8 ชม./คืน ผ่อนคลายความเครียดสะสม',
                size: 'xs',
                color: '#475569',
                wrap: true,
              },
              {
                type: 'separator',
                color: '#DCFCE7',
                margin: 'xs',
              },
              {
                type: 'text',
                text: '🚭 4. อนามัยสิ่งแวดล้อม (งดบุหรี่/สุรา)',
                size: 'xs',
                color: '#166534',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'งดสูบบุหรี่ บุหรี่ไฟฟ้า และดื่มสุรา เพื่อหลอดเลือดและหัวใจที่แข็งแรง',
                size: 'xs',
                color: '#475569',
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#059669',
            height: 'sm',
            action: {
              type: 'message',
              label: '🥗 อ่านคำแนะนำโภชนาการสุขภาพดี',
              text: 'คำแนะนำการรับประทานอาหาร',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '🏃 คำแนะนำการออกกำลังกาย',
              text: 'คำแนะนำการออกกำลังกาย',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📞 ติดต่อศูนย์ส่งเสริมสุขภาพ (037-247-190)',
              uri: 'tel:037247190',
            },
          },
        ],
      },
    },
  };
}

/**
 * Generate Automatic Risk & Interactive Menu Flex Card
 */
export function createRiskAssessmentAndMenuFlex() {
  return {
    type: 'flex',
    altText: '⚡ เมนูบริการสุขภาพและความเสี่ยง (Risk Menu) - รพ.คลองหาด',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0F172A',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '⚡ เมนูบริการและประเมินความเสี่ยง',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'โปรดเลือกรายการบริการที่ต้องการตรวจสอบ:',
            color: '#94A3B8',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'md',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'message',
              label: '🗓️ เช็ควันนัดหมายตรวจติดตาม',
              text: 'นัดหมายของฉัน',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#E11D48',
            height: 'sm',
            action: {
              type: 'message',
              label: '❤️ ประเมินความเสี่ยง CVD Risk',
              text: 'ประเมินความเสี่ยง',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#16A34A',
            height: 'sm',
            action: {
              type: 'message',
              label: '🥗 คำแนะนำอาหารและโภชนาการ',
              text: 'คำแนะนำการรับประทานอาหาร',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#0284C7',
            height: 'sm',
            action: {
              type: 'message',
              label: '💊 คำแนะนำการใช้ยาและข้อควรระวัง',
              text: 'คำแนะนำการใช้ยา',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#DC2626',
            height: 'sm',
            action: {
              type: 'message',
              label: '🚨 อาการฉุกเฉินที่ต้องพบแพทย์',
              text: 'อาการฉุกเฉิน',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '🎧 ติดต่อเจ้าหน้าที่ / พยาบาล NCDs',
              text: 'ติดต่อเจ้าหน้าที่',
            },
          },
        ],
      },
    },
  };
}

/**
 * Emergency Symptoms Flex — อาการฉุกเฉินที่ต้องพบแพทย์ทันที
 * ใช้งาน: ผู้ป่วยกดปุ่ม "อาการฉุกเฉิน" หรือพิมพ์ "ฉุกเฉิน / อาการที่ต้องพบแพทย์"
 */
export function createEmergencySymptomsFlex() {
  return {
    type: 'flex',
    altText: '🚨 อาการเตือนฉุกเฉิน (สโตรก & หัวใจขาดเลือด) — โทร 1669',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#B91C1C',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: '🚨 อาการเตือนฉุกเฉิน',
            color: '#FFFFFF',
            size: 'xl',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'โปรดเช็กอาการก่อนกดปุ่มโทร 1669 พบแพทย์ทันที',
            color: '#FECACA',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'lg',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FFF7ED',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FED7AA',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '🧠 โรคหลอดเลือดสมอง/สโตรก(STROKE)',
                size: 'sm',
                weight: 'bold',
                color: '#C2410C',
              },
              {
                type: 'text',
                text: 'อาการเตือนตามหลัก B.E.F.A.S.T:',
                size: 'xs',
                color: '#9A3412',
                weight: 'bold',
                margin: 'xs',
              },
              {
                type: 'text',
                text: '1. Balance - เดินเซ ทรงตัวไม่ได้\n2. Eyes - ตามัวเฉียบพลัน\n3. Face - ปากเบี้ยว หน้าเบี้ยว ข้างเดียว\n4. Arm - แขน ขา อ่อนแรง ข้างเดียว\n5. Speech - พูดไม่ชัด พูดลำบาก\n6. Time - โทรสายด่วน 1669 ทันที ( ไม่เกิน 4.5 ชั่วโมง )',
                size: 'xs',
                color: '#374151',
                wrap: true,
                margin: 'xs',
              },
              {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#FFEDD5',
                cornerRadius: 'sm',
                paddingAll: 'sm',
                margin: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '💡 จดจำง่าย: “พูดลำบาก ปากตก ยกไม่ขึ้น”\n… รู้ เร็ว รอด …',
                    size: 'xs',
                    color: '#9A3412',
                    weight: 'bold',
                    align: 'center',
                    wrap: true,
                  },
                ],
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FEF2F2',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FECACA',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '🫀 อาการกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน',
                size: 'sm',
                weight: 'bold',
                color: '#B91C1C',
              },
              {
                type: 'text',
                text: '• เจ็บแน่นหน้าอกร้าวไปที่แขนซ้าย คอ หรือกราม\n• หน้ามืด เป็นลม ร่วมกับเวียนศีรษะ\n• เจ็บหน้าอกรุนแรงเกิดขึ้นทันทีทันใด นานกว่า 20 นาที\n• อาการอื่นๆ ร่วมด้วย เช่น เหงื่อออก ตัวเย็น ใจสั่น',
                size: 'xs',
                color: '#374151',
                wrap: true,
                margin: 'xs',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#FEFCE8',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#FEF08A',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '📞 เจ็บป่วยฉุกเฉิน โทร 1669 (โปรดแจ้งข้อมูลดังนี้)',
                size: 'xs',
                weight: 'bold',
                color: '#A16207',
              },
              {
                type: 'text',
                text: '1. อาการบาดเจ็บ / เจ็บป่วย\n2. จำนวนผู้บาดเจ็บ / ผู้ป่วย\n3. สถานที่เกิดเหตุ หรือจุดใกล้เคียงสังเกตง่าย\n4. ชื่อและเบอร์โทรศัพท์ผู้แจ้ง',
                size: 'xs',
                color: '#4B5563',
                wrap: true,
                margin: 'xs',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#DC2626',
            height: 'md',
            action: {
              type: 'uri',
              label: '🚑 โทรฉุกเฉิน 1669 ทันที',
              uri: 'tel:1669',
            },
          },
          // {
          //   type: 'button',
          //   style: 'secondary',
          //   height: 'sm',
          //   action: {
          //     type: 'message',
          //     label: '🎧 แจ้งอาการให้เจ้าหน้าที่รับทราบ',
          //     text: 'ติดต่อเจ้าหน้าที่',
          //   },
          // },
        ],
      },
    },
  };
}
