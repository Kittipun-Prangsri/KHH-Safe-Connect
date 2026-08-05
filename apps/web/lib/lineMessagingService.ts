import { createAppointmentFlexMessage, AppointmentNotificationData } from './lineFlexTemplates';
import { getSupabaseAdminClient, isSupabaseConfigured } from './supabaseClient';

/**
 * Log LINE Push / Reply notifications to Supabase line_push_logs table
 */
export async function logLineNotificationToSupabase(logData: {
  lineUserId: string;
  hn?: string;
  messageType: 'push_flex' | 'push_text' | 'reply_flex' | 'reply_text';
  status: 'SUCCESS' | 'FAILED' | 'SIMULATED';
  httpStatus?: number;
  errorMessage?: string;
  latencyMs?: number;
}) {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseAdminClient();
    await supabase.from('line_push_logs').insert({
      line_user_id: logData.lineUserId,
      hn: logData.hn || null,
      message_type: logData.messageType,
      status: logData.status,
      http_status: logData.httpStatus || null,
      error_message: logData.errorMessage || null,
      latency_ms: logData.latencyMs || 0,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('⚠️ Failed to log LINE push notification to Supabase:', err);
  }
}

export async function sendLineAppointmentReminder(
  lineUserId: string,
  appointmentData: AppointmentNotificationData,
  channelAccessToken?: string
) {
  const token = (channelAccessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN || '').trim();
  const startTime = Date.now();

  if (!token) {
    console.warn('⚠️ LINE_CHANNEL_ACCESS_TOKEN is missing. Returning simulated notification response.');
    await logLineNotificationToSupabase({
      lineUserId,
      hn: appointmentData.hn,
      messageType: 'push_flex',
      status: 'SIMULATED',
      errorMessage: 'LINE_CHANNEL_ACCESS_TOKEN missing',
    });

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

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      const isQuotaExceeded = response.status === 429 || errorText.includes('monthly limit');

      await logLineNotificationToSupabase({
        lineUserId,
        hn: appointmentData.hn,
        messageType: 'push_flex',
        status: 'FAILED',
        httpStatus: response.status,
        errorMessage: isQuotaExceeded ? 'Monthly LINE Push quota limit reached (HTTP 429)' : errorText,
        latencyMs,
      });

      if (isQuotaExceeded) {
        console.warn(`⚠️ LINE Push quota exceeded (HTTP 429) for ${appointmentData.patientName} (${lineUserId})`);
        return {
          success: false,
          quotaExceeded: true,
          error: 'LINE Push Message monthly limit reached (HTTP 429). Use LINE Reply API or upgrade package.',
        };
      }

      throw new Error(`LINE API returned status ${response.status}: ${errorText}`);
    }

    await logLineNotificationToSupabase({
      lineUserId,
      hn: appointmentData.hn,
      messageType: 'push_flex',
      status: 'SUCCESS',
      httpStatus: 200,
      latencyMs,
    });

    return {
      success: true,
      simulated: false,
      message: `LINE Flex Message sent successfully to ${appointmentData.patientName}`,
    };
  } catch (err: any) {
    console.error('❌ Failed to send LINE Push message:', err);
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Send LINE Reply Message (Free API quota response using replyToken)
 */
export async function sendLineReplyMessage(
  replyToken: string,
  messages: any[],
  channelAccessToken?: string
) {
  if (
    !replyToken ||
    replyToken === '00000000000000000000000000000000' ||
    replyToken === '11111111111111111111111111111111'
  ) {
    return { success: true, simulated: true, message: '[Simulated] Dummy LINE replyToken ignored' };
  }

  const token = (
    channelAccessToken ||
    process.env.LINE_CHANNEL_ACCESS_TOKEN ||
    '76+q7GG6OOaoulsZwBlYWQBzu/cX6ABJdAu4biK+oOi+TyW+TylZSEcKmsVm6uhgRAC+ZuFHnwNHSUM3hcS4rRzaAwAhzfvm7HV9uz5kTGO+6V25TLvpSilwM8Ia0GA6KSRbrHhro7duaPROVE/12gdB04t89/1O/w1cDnyilFU='
  ).trim();

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/reply', {
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LINE Reply API returned status ${response.status}: ${errorText}`);
    }

    return {
      success: true,
      simulated: false,
      message: 'LINE Reply Message sent successfully',
    };
  } catch (err: any) {
    console.error('❌ Failed to send LINE Reply message:', err);
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Reply Appointment Notification via LINE Reply API using replyToken
 */
export async function replyLineAppointmentReminder(
  replyToken: string,
  appointmentData: AppointmentNotificationData,
  channelAccessToken?: string
) {
  const flexMessage = createAppointmentFlexMessage(appointmentData);
  return sendLineReplyMessage(replyToken, [flexMessage], channelAccessToken);
}

/**
 * Send LINE Push Text Message directly to patient LINE User ID
 */
export async function sendLinePushTextMessage(
  lineUserId: string,
  text: string,
  channelAccessToken?: string
) {
  const token = (
    channelAccessToken ||
    process.env.LINE_CHANNEL_ACCESS_TOKEN ||
    '76+q7GG6OOaoulsZwBlYWQBzu/cX6ABJdAu4biK+oOi+TyW+TylZSEcKmsVm6uhgRAC+ZuFHnwNHSUM3hcS4rRzaAwAhzfvm7HV9uz5kTGO+6V25TLvpSilwM8Ia0GA6KSRbrHhro7duaPROVE/12gdB04t89/1O/w1cDnyilFU='
  ).trim();
  const startTime = Date.now();

  if (!token || !lineUserId) {
    await logLineNotificationToSupabase({
      lineUserId: lineUserId || 'unknown',
      messageType: 'push_text',
      status: 'SIMULATED',
      errorMessage: 'LINE_CHANNEL_ACCESS_TOKEN or lineUserId missing',
    });
    return { success: true, simulated: true, message: '[Simulated] LINE Push text message simulated' };
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [
          {
            type: 'text',
            text,
          },
        ],
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      const isQuotaExceeded = response.status === 429 || errorText.includes('monthly limit');

      await logLineNotificationToSupabase({
        lineUserId,
        messageType: 'push_text',
        status: 'FAILED',
        httpStatus: response.status,
        errorMessage: isQuotaExceeded ? 'Monthly LINE Push quota limit reached (HTTP 429)' : errorText,
        latencyMs,
      });

      if (isQuotaExceeded) {
        console.warn(`⚠️ LINE Push text quota exceeded (HTTP 429) for UID: ${lineUserId}`);
        return {
          success: false,
          quotaExceeded: true,
          error: 'LINE Push Message monthly limit reached (HTTP 429). Use LINE Reply API or upgrade package.',
        };
      }

      throw new Error(`LINE Push API status ${response.status}: ${errorText}`);
    }

    await logLineNotificationToSupabase({
      lineUserId,
      messageType: 'push_text',
      status: 'SUCCESS',
      httpStatus: 200,
      latencyMs,
    });

    return {
      success: true,
      simulated: false,
      message: 'LINE Push Message sent successfully',
    };
  } catch (err: any) {
    console.error('❌ Failed to send LINE Push text message:', err);
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Send LINE Reply Text Message using replyToken (Free API — no quota cost)
 */
export async function sendLineReplyTextMessage(
  replyToken: string,
  text: string,
  channelAccessToken?: string
) {
  return sendLineReplyMessage(replyToken, [{ type: 'text', text }], channelAccessToken);
}

/**
 * Smart staff reply strategy:
 *   1. Try LINE Reply API first using the stored replyToken (FREE — no quota)
 *   2. Fall back to LINE Push Message if token is expired/missing
 *
 * replyToken is only valid ~30 seconds after patient's webhook event.
 * For web dashboard replies (delayed response), Push will be used as fallback.
 */
export async function sendStaffReplyToPatient(params: {
  lineUserId: string;
  replyToken?: string | null;
  replyTokenExpiresAt?: string | null;
  text: string;
  hn?: string;
  channelAccessToken?: string;
}): Promise<{
  success: boolean;
  method: 'reply' | 'push' | 'simulated' | 'failed';
  quotaExceeded?: boolean;
  error?: string;
}> {
  const { lineUserId, replyToken, replyTokenExpiresAt, text, hn } = params;

  // Check if replyToken is still valid (within 25 seconds of expiry buffer)
  const canUseReply =
    replyToken &&
    replyToken.length > 10 &&
    replyToken !== '00000000000000000000000000000000' &&
    replyToken !== '11111111111111111111111111111111' &&
    (!replyTokenExpiresAt || new Date(replyTokenExpiresAt) > new Date());

  if (canUseReply) {
    console.log(`💬 Attempting LINE Reply API (free quota) for HN: ${hn || 'unknown'}`);
    const replyResult = await sendLineReplyTextMessage(replyToken!, text, params.channelAccessToken);

    if (replyResult.success && !replyResult.simulated) {
      await logLineNotificationToSupabase({
        lineUserId,
        hn,
        messageType: 'reply_text',
        status: 'SUCCESS',
      });
      console.log(`✅ LINE Reply sent successfully (free quota) for HN: ${hn}`);
      return { success: true, method: 'reply' };
    }
    // Token expired — fall through to Push
    console.warn(`⚠️ LINE Reply failed (token expired), falling back to Push for HN: ${hn}`);
  }

  // Fallback: LINE Push Message
  if (!lineUserId || lineUserId.startsWith('SIMULATED')) {
    console.warn(`⚠️ No valid LINE User ID — simulating for HN: ${hn}`);
    return { success: true, method: 'simulated' };
  }

  console.log(`📤 LINE Push Message (fallback) for staff reply to HN: ${hn}`);
  const pushResult = await sendLinePushTextMessage(lineUserId, text, params.channelAccessToken);

  if (pushResult.success) {
    return { success: true, method: 'push' };
  }
  if ((pushResult as any).quotaExceeded) {
    return { success: false, method: 'failed', quotaExceeded: true, error: 'LINE Push quota exceeded' };
  }
  return { success: false, method: 'failed', error: (pushResult as any).error };
}
