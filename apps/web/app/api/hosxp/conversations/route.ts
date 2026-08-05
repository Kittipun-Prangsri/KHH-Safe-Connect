import { NextRequest, NextResponse } from 'next/server';
import { getHosxpPool } from '@/lib/hosxpClient';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getAllIncomingLineMessages } from '@/lib/lineUserService';

export const dynamic = 'force-dynamic';

async function mergeLiveLineMessages(conversations: any[]) {
  let liveMessages = getAllIncomingLineMessages() || [];

  // Also fetch persisted patient_line_messages from Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('patient_line_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (data && !error && data.length > 0) {
        const dbMsgs = data.map((m: any) => ({
          id: m.id,
          lineUserId: m.line_user_id,
          hn: m.hn,
          patientName: m.patient_name || 'ผู้ป่วย (LINE)',
          text: m.message_text,
          timestamp: new Date(m.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          createdAt: m.created_at,
        }));
        // Merge without duplicates
        const existingIds = new Set(liveMessages.map((m) => m.id));
        for (const dbm of dbMsgs) {
          if (!existingIds.has(dbm.id)) {
            liveMessages.push(dbm);
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ Error querying patient_line_messages in conversations API:', err);
    }
  }

  if (!liveMessages || liveMessages.length === 0) return conversations;

  const convMap = new Map<string, any>();
  for (const c of conversations) {
    convMap.set(c.hn, c);
  }

  for (const liveMsg of liveMessages) {
    let target = convMap.get(liveMsg.hn);

    if (!target) {
      target = {
        id: `conv-live-${liveMsg.hn}`,
        hn: liveMsg.hn,
        lineUserId: liveMsg.lineUserId,
        patientName: liveMsg.patientName,
        phone: '-',
        cid: '-',
        subject: `[LINE Message] ${liveMsg.text}`,
        category: liveMsg.text.includes('โภชนา')
          ? 'ปรึกษาโภชนาการ'
          : liveMsg.text.includes('ยา') || liveMsg.text.includes('เภสัช')
          ? 'สอบถามการใช้ยา'
          : liveMsg.text.includes('เครียด') || liveMsg.text.includes('นอน')
          ? 'ปรึกษาสุขภาพจิต'
          : 'ติดต่อเจ้าหน้าที่',
        priority: 'high',
        unreadCount: 1,
        lastMessageTime: liveMsg.timestamp,
        messages: [],
      };
      convMap.set(liveMsg.hn, target);
    } else {
      target.lineUserId = target.lineUserId || liveMsg.lineUserId;
      target.unreadCount += 1;
      target.lastMessageTime = liveMsg.timestamp;
      if (liveMsg.text.includes('โภชนา')) {
        target.category = 'ปรึกษาโภชนาการ';
        target.subject = `[LINE Message] ${liveMsg.text}`;
      } else if (liveMsg.text.includes('ยา') || liveMsg.text.includes('เภสัช')) {
        target.category = 'สอบถามการใช้ยา';
        target.subject = `[LINE Message] ${liveMsg.text}`;
      } else if (liveMsg.text.includes('เครียด') || liveMsg.text.includes('นอน')) {
        target.category = 'ปรึกษาสุขภาพจิต';
        target.subject = `[LINE Message] ${liveMsg.text}`;
      }
    }

    const exists = target.messages.some((m: any) => m.id === liveMsg.id);
    if (!exists) {
      target.messages.push({
        id: liveMsg.id,
        sender: 'patient',
        senderName: liveMsg.patientName,
        text: liveMsg.text,
        time: liveMsg.timestamp,
      });
    }
  }

  return Array.from(convMap.values());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';

    let conversations: any[] = [];

    // 1. Try querying HOSxP MySQL first
    try {
      const pool = getHosxpPool();

      let sql = `
        SELECT o.oapp_id, o.hn, 
               CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) AS patient_name,
               COALESCE(p.mobile_phone_number, p.hometel, p.informtel) AS phone,
               p.cid,
               o.nextdate, o.nexttime, o.clinic, 
               CONVERT(c.name USING utf8mb4) AS clinic_name, 
               CONVERT(o.app_cause USING utf8mb4) AS app_cause
        FROM oapp o
        LEFT JOIN patient p ON o.hn = p.hn
        LEFT JOIN clinic c ON o.clinic = c.clinic
      `;

      const params: any[] = [];

      if (search) {
        const cleanQuery = search.replace(/^HN-/i, '');
        sql += ` WHERE (p.fname LIKE ? OR p.lname LIKE ? OR o.hn LIKE ? OR o.hn = ? OR p.cid LIKE ? OR p.mobile_phone_number LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${cleanQuery}%`, cleanQuery, `%${search}%`, `%${search}%`);
      } else {
        sql += ` WHERE o.nextdate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
      }

      sql += ` ORDER BY o.nextdate DESC LIMIT 50`;

      const [rows]: any = await pool.execute(sql, params);

      if (rows && rows.length > 0) {
        conversations = rows.map((r: any, idx: number) => {
          const hnFormatted = r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : `HN-00${idx}`;
          const clinicName = r.clinic_name || 'คลินิก NCDs';
          const cause = r.app_cause || 'ตรวจติดตามอาการ';
          const nextDateStr = r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }) : 'วันนี้';

          return {
            id: `conv-${r.oapp_id || idx}`,
            hn: hnFormatted,
            patientName: r.patient_name || 'ไม่ระบุชื่อ',
            phone: r.phone || '-',
            cid: r.cid || '-',
            subject: `[HOSxP] นัดตรวจ ${clinicName} (${nextDateStr}) - ${cause}`,
            category: clinicName.includes('เบาหวาน') ? 'ขอเลื่อนนัด' : clinicName.includes('ความดัน') ? 'สอบถามการใช้ยา' : 'ติดตามอาการ NCDs',
            priority: idx < 3 ? 'urgent' : idx < 8 ? 'high' : 'normal',
            unreadCount: idx < 4 ? 1 : 0,
            lastMessageTime: `${10 - (idx % 5)}:${15 + ((idx * 3) % 40)} น.`,
            messages: [
              {
                id: `msg-${r.oapp_id || idx}-1`,
                sender: 'patient',
                senderName: r.patient_name || 'ผู้ป่วย',
                text: `สวัสดีค่ะ/ครับ รบกวนสอบถามเกี่ยวกับวันนัด ${clinicName} วันที่ ${nextDateStr} (${cause})`,
                time: '10:00 น.',
              },
            ],
          };
        });

        conversations = await mergeLiveLineMessages(conversations);
        return NextResponse.json({ success: true, count: conversations.length, source: 'hosxp', conversations });
      }
    } catch (hosxpError) {
      console.warn('⚠️ HOSxP MySQL unavailable for conversations API, falling back to Supabase:', (hosxpError as Error).message);
    }

    // 2. Fallback to Supabase PostgreSQL patients & appointments tables
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdminClient();
        let query = supabase.from('patients').select('*');

        if (search) {
          const cleanQuery = search.replace(/^HN-/i, '');
          query = query.or(`patient_name.ilike.%${search}%,hn.ilike.%${search}%,raw_hn.eq.${cleanQuery},cid.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data, error } = await query.order('last_vst_date', { ascending: false }).limit(50);

        if (data && !error && data.length > 0) {
          conversations = data.map((r: any, idx: number) => {
            const hnFormatted = r.hn || (r.raw_hn ? `HN-${r.raw_hn}` : `HN-00${idx}`);
            const clinicName = r.clinic_name || r.disease_type || 'คลินิก NCDs';
            const nextDateStr = r.next_date ? new Date(r.next_date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }) : 'วันนี้';

            return {
              id: `conv-sb-${r.id || idx}`,
              hn: hnFormatted,
              patientName: r.patient_name || 'ไม่ระบุชื่อ',
              phone: r.phone || '-',
              cid: r.cid || '-',
              subject: `[Supabase Registry] นัดตรวจ ${clinicName} (${nextDateStr}) - ${r.control_status_text || 'ตรวจติดตามอาการ'}`,
              category: clinicName.includes('เบาหวาน') ? 'ขอเลื่อนนัด' : clinicName.includes('ความดัน') ? 'สอบถามการใช้ยา' : 'ติดตามอาการ NCDs',
              priority: r.is_controlled === false ? 'urgent' : 'normal',
              unreadCount: 0,
              lastMessageTime: 'วันนี้',
              messages: [
                {
                  id: `msg-sb-${r.id}-1`,
                  sender: 'patient',
                  senderName: r.patient_name || 'ผู้ป่วย',
                  text: `สวัสดีค่ะ/ครับ รบกวนสอบถามเกี่ยวกับวันนัด ${clinicName} (${nextDateStr})`,
                  time: '10:00 น.',
                },
              ],
            };
          });

          conversations = await mergeLiveLineMessages(conversations);
          return NextResponse.json({ success: true, count: conversations.length, source: 'supabase', conversations });
        }
      } catch (sbError) {
        console.warn('⚠️ Error fetching conversations from Supabase:', sbError);
      }
    }

    conversations = await mergeLiveLineMessages([]);
    return NextResponse.json({ success: true, count: conversations.length, conversations });
  } catch (error: any) {
    console.error('❌ Conversations API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
