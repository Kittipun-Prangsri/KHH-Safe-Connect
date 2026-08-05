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
          // {
          //   type: 'button',
          //   style: 'primary',
          //   color: '#0D9488',
          //   height: 'sm',
          //   action: {
          //     type: 'uri',
          //     label: '📞 โทรหาคลินิก NCDs (06-2271-0099)',
          //     uri: 'tel:0622710099',
          //   },
          // },
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
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'message',
              label: '🧘 2. ความเครียดและการนอน',
              text: 'คำแนะนำความเครียดและการนอน',
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
            color: '#7C3AED',
            height: 'sm',
            action: {
              type: 'uri',
              label: '🧠 4. ประเมินสุขภาพจิต',
              uri: 'https://docs.google.com/forms/d/e/1FAIpQLSddhwdT8RDyYBQ1AaTJfUVQXhJfXhyyJUASIfSSLk2z-JwVzg/viewform',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#EA580C',
            height: 'sm',
            action: {
              type: 'message',
              label: '🏃 5. การออกกำลังกายส่งเสริมสุขภาพ',
              text: 'คำแนะนำการออกกำลังกาย',
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
    altText: '🧘 คำแนะนำการจัดการความเครียดและการนอนหลับ - รพ.คลองหาด',
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
            text: '🧘 คำแนะนำความเครียดและการนอน',
            color: '#FFFFFF',
            size: 'md',
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'สำหรับผู้ป่วยกลุ่มโรค NCDs (รพ.คลองหาด)',
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
                text: '😴 ข้อปฏิบัติตัวเพื่อการนอนหลับที่ดี (Sleep Hygiene)',
                size: 'xs',
                color: '#0F766E',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• เข้านอนและตื่นนอนให้เป็นเวลาเดียวกันทุกวัน (ควรก่อน 22:00 น.)',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• งดใช้อุปกรณ์สมาร์ทโฟน/แท็บเล็ต/จอคอมก่อนนอนอย่างน้อย 30 นาที',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• หลีกเลี่ยงกาแฟ ชา น้ำอัดลม เครื่องดื่มชูกำลัง หลังเวลา 14:00 น.',
                size: 'xs',
                color: '#334155',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• จัดห้องนอนให้มืด เงียบสบาย และอากาศถ่ายเทได้ดี',
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
            backgroundColor: '#F3E8FF',
            cornerRadius: 'md',
            paddingAll: 'md',
            borderColor: '#E9D5FF',
            borderWidth: '1px',
            contents: [
              {
                type: 'text',
                text: '🧘 การผ่อนคลายและจัดการความเครียดสะสม',
                size: 'xs',
                color: '#6B21A8',
                weight: 'bold',
              },
              {
                type: 'text',
                text: '• ความเครียดกระตุ้นฮอร์โมน คอร์ติซอล (Cortisol) ทำให้ระดับน้ำตาลในเลือดและความดันสูงขึ้นอย่างรวดเร็ว',
                size: 'xs',
                color: '#581C87',
                margin: 'xs',
                wrap: true,
              },
              {
                type: 'text',
                text: '• ฝึกการหายใจลึก: สูดลมหายใจเข้าลึก 4 วินาที กลั้นไว้ 4 วินาที และผ่อนลมหายใจออกช้าๆ 6 วินาที (ทำซ้ำ 5-10 ครั้ง)',
                size: 'xs',
                color: '#581C87',
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
            color: '#0D9488',
            height: 'sm',
            action: {
              type: 'uri',
              label: '🧠 ประเมินความเครียด DMH Check-in',
              uri: 'https://checkin.dmh.go.th/main/index.php?type=1',
            },
          },
          {
            type: 'button',
            style: 'primary',
            color: '#7C3AED',
            height: 'sm',
            action: {
              type: 'message',
              label: '🎧 ปรึกษาสุขภาพจิต / พยาบาล',
              text: 'ปรึกษาสุขภาพจิต',
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
    altText: '📌 ลงทะเบียนผู้ป่วย: โปรดพิมพ์หมายเลข HN ของท่าน',
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
            text: 'โปรดพิมพ์หมายเลข HN หรือเลขบัตรประชาชนส่งกลับมาในแชทนี้',
            size: 'xs',
            color: '#334155',
            wrap: true,
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'ตัวอย่าง: HN-98302 หรือ 1234567890123',
            size: 'xs',
            color: '#64748B',
            margin: 'xs',
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
            text: 'โปรดพิมพ์รหัสพนักงาน หรือรหัสบุคลากรทางการแพทย์ส่งกลับมาในแชทนี้',
            size: 'xs',
            color: '#334155',
            wrap: true,
            weight: 'bold',
          },
          {
            type: 'text',
            text: 'ตัวอย่าง: STAFF-1001 หรือ NURSE-889',
            size: 'xs',
            color: '#64748B',
            margin: 'xs',
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
  registeredClinics: string[] = [
    '🩺 คลินิก 001: คลินิกเบาหวาน (DM)',
    '🩺 คลินิก 002: คลินิกความดันโลหิตสูง (HT)',
  ]
) {
  const clinicContents = registeredClinics.map((c) => ({
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
  }));

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
                text: '🧠 โรคหลอดเลือดสมอง / สโตรก (STROKE)',
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
                text: '1. Balance - เดินเซ ทรงตัวไม่ได้\n2. Eyes - ตามัวเฉียบพลัน\n3. Face - ปากเบี้ยว หน้าเบี้ยว ข้างเดียว\n4. Arm - แขน ขา อ่อนแรง ข้างเดียว\n5. Speech - พูดไม่ชัด พูดลำบาก\n6. Time - รีบติดต่อ รพ. ทันที (ไม่เกิน 4.5 ชั่วโมง)',
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
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '🎧 แจ้งอาการให้เจ้าหน้าที่รับทราบ',
              text: 'ติดต่อเจ้าหน้าที่',
            },
          },
        ],
      },
    },
  };
}
