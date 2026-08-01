import { createAppointmentFlexMessage, AppointmentNotificationData } from './lineFlexTemplates';

export async function sendLineAppointmentReminder(
  lineUserId: string,
  appointmentData: AppointmentNotificationData,
  channelAccessToken?: string
) {
  const token = channelAccessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN || '76+q7GG6OOaoulsZwBlYWQBzu/cX6ABJdAu4biK+oOi+TyW+TylZSEcKmsVm6uhgRAC+ZuFHnwNHSUM3hcS4rRzaAwAhzfvm7HV9uz5kTGO+6V25TLvpSilwM8Ia0GA6KSRbrHhro7duaPROVE/12gdB04t89/1O/w1cDnyilFU=';

  if (!token) {
    console.warn('⚠️ LINE_CHANNEL_ACCESS_TOKEN is missing. Returning simulated notification response.');
    return {
      success: true,
      simulated: true,
      message: `[Simulated] LINE Flex Message sent to LINE User ID (${lineUserId}) for patient ${appointmentData.patientName}`,
    };
  }

  const flexMessage = createAppointmentFlexMessage(appointmentData);

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [flexMessage],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LINE API returned status ${response.status}: ${errorText}`);
    }

    return {
      success: true,
      simulated: false,
      message: `LINE Flex Message sent successfully to ${appointmentData.patientName}`,
    };
  } catch (err: any) {
    console.error('❌ Failed to send LINE message:', err);
    return {
      success: false,
      error: err.message,
    };
  }
}
