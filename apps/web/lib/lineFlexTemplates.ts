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
            alignment: 'center',
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
              text: `ยืนยันมาตามนัด HN ${data.hn} วันที่ ${data.appointmentDate}`,
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '🟡 ขอเลื่อนวันนัด',
              text: `ขอเลื่อนนัด HN ${data.hn} วันที่ ${data.appointmentDate}`,
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
