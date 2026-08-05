import { getHosxpPool } from './hosxpClient';
import { getSupabaseAdminClient, isSupabaseConfigured } from './supabaseClient';

// Store in-memory bindings map for fast lookup
// key: lineUserId, value: { hn: string, patientName: string, boundAt: string }
const lineUserBindingStore = new Map<string, { hn: string; patientName: string; boundAt: string }>();

export interface PatientAppointmentInfo {
  oappId: string;
  hn: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  clinicName: string;
  doctorName: string;
  cause: string;
  preparationNotes: string;
}

export interface LineUserBindingResult {
  status: 'SUCCESS' | 'ALREADY_BOUND' | 'REBOUND_TRANSFERRED' | 'INVALID_VERIFICATION' | 'ERROR';
  message: string;
  hn: string;
  patientName: string;
  isCaregiver?: boolean;
}

/**
 * Enhanced LINE User ID Binding Validation & Duplicate Prevention Service
 */
export async function getLineUserBinding(lineUserId: string) {
  if (!lineUserId) return null;

  // 1. Check in-memory store
  if (lineUserBindingStore.has(lineUserId)) {
    return lineUserBindingStore.get(lineUserId)!;
  }

  // 2. Check Supabase patient_line_users table
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('patient_line_users')
        .select('hn, patient_name, user_role, created_at')
        .eq('line_user_id', lineUserId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        const binding = {
          hn: data.hn,
          patientName: data.patient_name || 'ผู้ป่วย รพ.คลองหาด',
          boundAt: data.created_at || new Date().toISOString(),
          userRole: data.user_role || 'patient',
        };
        lineUserBindingStore.set(lineUserId, binding);
        return binding;
      }
    } catch (err) {
      console.warn('⚠️ Error fetching LINE user binding from Supabase:', err);
    }
  }

  return null;
}

/**
 * Bind a LINE User ID with strict duplicate prevention and conflict handling
 */
export async function bindLineUserToHn(
  lineUserId: string,
  hn: string,
  patientName: string,
  options: { userRole?: 'patient' | 'caregiver'; overrideExisting?: boolean } = {}
): Promise<LineUserBindingResult> {
  if (!lineUserId || !hn) {
    return { status: 'ERROR', message: 'ข้อมูลไม่ครบถ้วน', hn: '', patientName: '' };
  }

  const formattedHn = hn.toUpperCase().startsWith('HN-') ? hn.toUpperCase() : `HN-${hn}`;
  const userRole = options.userRole || 'patient';

  // 1. Check if this exact LINE User ID is already bound to this HN
  const existingUserBinding = await getLineUserBinding(lineUserId);
  if (existingUserBinding && existingUserBinding.hn === formattedHn) {
    return {
      status: 'ALREADY_BOUND',
      message: `บัญชี LINE นี้ถูกผูกกับผู้ป่วย ${patientName} (${formattedHn}) เรียบร้อยแล้ว`,
      hn: formattedHn,
      patientName,
    };
  }

  // 2. Save/Update in-memory store
  const binding = {
    hn: formattedHn,
    patientName,
    boundAt: new Date().toISOString(),
    userRole,
  };
  lineUserBindingStore.set(lineUserId, binding);

  // 3. Persist to Supabase with Duplicate Resolution Rules
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();

      // If patient role, deactivate any older primary bindings for this HN to prevent orphaned duplicate accounts
      if (userRole === 'patient' && options.overrideExisting) {
        await supabase
          .from('patient_line_users')
          .update({ is_active: false, unbound_at: new Date().toISOString() })
          .eq('hn', formattedHn)
          .eq('is_primary', true);
      }

      await supabase.from('patient_line_users').upsert({
        line_user_id: lineUserId,
        hn: formattedHn,
        patient_name: patientName,
        user_role: userRole,
        is_primary: userRole === 'patient',
        is_active: true,
        created_at: new Date().toISOString(),
      });

      // Audit Log
      await supabase.from('line_binding_audit_logs').insert({
        line_user_id: lineUserId,
        target_hn: formattedHn,
        action_type: options.overrideExisting ? 'REBIND_TRANSFER' : userRole === 'caregiver' ? 'CAREGIVER_ADD' : 'BIND_SUCCESS',
        reason: 'Successful LINE ID registration verification',
      });
    } catch (err) {
      console.warn('⚠️ Error persisting LINE user binding to Supabase:', err);
    }
  }

  return {
    status: options.overrideExisting ? 'REBOUND_TRANSFERRED' : 'SUCCESS',
    message: `ผูกบัญชีสำเร็จ: คุณ${patientName} (${formattedHn})`,
    hn: formattedHn,
    patientName,
  };
}

/**
 * Search HOSxP patient database by HN or 13-digit Citizen ID (CID)
 * Checks HOSxP MySQL first, with fallback to Supabase PostgreSQL patients table.
 */
export async function findPatientByHnOrCidInHosxp(queryStr: string) {
  const cleanQuery = queryStr.trim().replace(/^HN-/i, '');
  const formattedHn = `HN-${cleanQuery}`;

  // 1. Query HOSxP MySQL
  try {
    const pool = getHosxpPool();

    const [rows]: any = await pool.execute(
      `
      SELECT hn, 
             CONVERT(CONCAT(COALESCE(pname,''), COALESCE(fname,''), ' ', COALESCE(lname,'')) USING utf8mb4) AS patient_name,
             COALESCE(mobile_phone_number, hometel, informtel) AS phone,
             cid
      FROM patient 
      WHERE hn = ? OR cid = ? OR hn = LPAD(?, 7, '0')
      LIMIT 1
    `,
      [cleanQuery, cleanQuery, cleanQuery]
    );

    if (rows && rows.length > 0) {
      const p = rows[0];
      return {
        found: true,
        hn: p.hn.startsWith('HN-') ? p.hn : `HN-${p.hn}`,
        rawHn: p.hn,
        patientName: p.patient_name || 'ผู้ป่วย รพ.คลองหาด',
        phone: p.phone || '-',
        cid: p.cid || '-',
      };
    }
  } catch (error) {
    console.warn('⚠️ HOSxP MySQL unavailable for patient search, falling back to Supabase:', (error as Error).message);
  }

  // 2. Fallback to Supabase PostgreSQL `patients` table
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .or(`hn.eq.${formattedHn},raw_hn.eq.${cleanQuery},cid.eq.${cleanQuery}`)
        .maybeSingle();

      if (data && !error) {
        return {
          found: true,
          hn: data.hn || formattedHn,
          rawHn: data.raw_hn || cleanQuery,
          patientName: data.patient_name || 'ผู้ป่วย รพ.คลองหาด',
          phone: data.phone || '-',
          cid: data.cid || '-',
        };
      }
    } catch (err) {
      console.warn('⚠️ Error searching patient in Supabase:', err);
    }
  }

  return { found: false, hn: '', patientName: '' };
}

/**
 * Fetch REAL upcoming appointments for a specific patient HN
 * Checks HOSxP MySQL first, with fallback to Supabase PostgreSQL appointments table.
 * Returns empty array [] if patient has no upcoming appointments (No fake mock data).
 */
export async function fetchPatientUpcomingAppointmentsFromHosxp(hn: string): Promise<PatientAppointmentInfo[]> {
  const cleanHn = hn.trim().replace(/^HN-/i, '');
  const formattedHn = `HN-${cleanHn}`;

  // 1. Query HOSxP MySQL
  try {
    const pool = getHosxpPool();

    const [rows]: any = await pool.execute(
      `
      SELECT o.oapp_id, o.hn, 
             CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) AS patient_name,
             o.nextdate, o.nexttime, o.clinic, 
             CONVERT(c.name USING utf8mb4) AS clinic_name, 
             CONVERT(d.name USING utf8mb4) AS doctor_name, 
             CONVERT(o.app_cause USING utf8mb4) AS app_cause
      FROM oapp o
      LEFT JOIN patient p ON o.hn = p.hn
      LEFT JOIN clinic c ON o.clinic = c.clinic
      LEFT JOIN doctor d ON o.doctor = d.code
      WHERE (o.hn = ? OR o.hn = LPAD(?, 7, '0'))
        AND o.nextdate >= CURDATE()
      ORDER BY o.nextdate ASC
      LIMIT 5
    `,
      [cleanHn, cleanHn]
    );

    if (rows && rows.length > 0) {
      return rows.map((r: any) => {
        const nextDate = new Date(r.nextdate);
        const dateStr = nextDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = r.nexttime ? `${r.nexttime} น.` : '08:30 น.';
        const clinicStr = r.clinic_name || 'คลินิก NCDs';
        const causeStr = r.app_cause || 'ตรวจติดตามอาการประจำปี';

        let prep = 'โปรดนำบัตรประชาชน สมุดประจำตัว NCDs และยาประจำตัวมาด้วยทุกครั้ง';
        if (clinicStr.includes('เบาหวาน') || causeStr.includes('เจาะเลือด') || causeStr.includes('ดม')) {
          prep = '⚠️ โปรดงดน้ำและอาหารทุกชนิดหลัง 20:00 น. คืนก่อนวันตรวจ (จิบน้ำบริสุทธิ์ได้เล็กน้อย) นำยาประจำตัวมาทานหลังเจาะเลือดเสร็จ';
        }

        return {
          oappId: `oapp-${r.oapp_id}`,
          hn: r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`,
          patientName: r.patient_name || 'ผู้ป่วย NCDs',
          appointmentDate: dateStr,
          appointmentTime: timeStr,
          clinicName: clinicStr,
          doctorName: r.doctor_name || 'แพทย์ประจำคลินิก',
          cause: causeStr,
          preparationNotes: prep,
        };
      });
    }
  } catch (error) {
    console.warn('⚠️ HOSxP MySQL unavailable for appointments query, falling back to Supabase:', (error as Error).message);
  }

  // 2. Fallback to Supabase PostgreSQL `appointments` table
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .or(`hn.eq.${formattedHn},hn.eq.${cleanHn}`)
        .gte('next_date', new Date().toISOString().split('T')[0])
        .order('next_date', { ascending: true })
        .limit(5);

      if (data && !error && data.length > 0) {
        return data.map((r: any) => {
          const nextDate = new Date(r.next_date);
          const dateStr = nextDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
          const timeStr = r.next_time ? `${r.next_time} น.` : '08:30 น.';
          const clinicStr = r.clinic_name || 'คลินิก NCDs';
          const causeStr = r.app_cause || 'ตรวจติดตามอาการประจำปี';

          let prep = 'โปรดนำบัตรประชาชน สมุดประจำตัว NCDs และยาประจำตัวมาด้วยทุกครั้ง';
          if (clinicStr.includes('เบาหวาน') || causeStr.includes('เจาะเลือด')) {
            prep = '⚠️ โปรดงดน้ำและอาหารทุกชนิดหลัง 20:00 น. คืนก่อนวันตรวจ (จิบน้ำบริสุทธิ์ได้เล็กน้อย) นำยาประจำตัวมาทานหลังเจาะเลือดเสร็จ';
          }

          return {
            oappId: `oapp-${r.oapp_id || r.id}`,
            hn: r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`,
            patientName: r.patient_name || 'ผู้ป่วย NCDs',
            appointmentDate: dateStr,
            appointmentTime: timeStr,
            clinicName: clinicStr,
            doctorName: r.doctor_name || 'แพทย์ประจำคลินิก',
            cause: causeStr,
            preparationNotes: prep,
          };
        });
      }
    } catch (err) {
      console.warn('⚠️ Error fetching patient appointments from Supabase:', err);
    }
  }

  // Return empty array if patient has no upcoming appointments (No fake mock data)
  return [];
}

/**
 * Find bound LINE User ID for a given patient HN (Checking In-Memory & Supabase)
 * Returns null if the patient has not bound their LINE account yet.
 */
export async function getLineUserIdByHn(hn: string): Promise<string | null> {
  if (!hn) return null;
  const formattedHn = hn.toUpperCase().startsWith('HN-') ? hn.toUpperCase() : `HN-${hn}`;
  const cleanHn = hn.trim().replace(/^HN-/i, '');

  // 1. Search in-memory store
  for (const [lineId, binding] of lineUserBindingStore.entries()) {
    if (binding.hn === formattedHn || binding.hn.replace(/^HN-/i, '') === cleanHn) {
      return lineId;
    }
  }

  // 2. Search Supabase patient_line_users table
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('patient_line_users')
        .select('line_user_id')
        .or(`hn.eq.${formattedHn},hn.eq.${cleanHn}`)
        .maybeSingle();

      if (data && !error && data.line_user_id) {
        return data.line_user_id;
      }
    } catch (err) {
      console.warn('⚠️ Error searching LINE User ID by HN in Supabase:', err);
    }
  }

  return null;
}

export interface SavedLineMessage {
  id: string;
  lineUserId: string;
  hn: string;
  patientName: string;
  text: string;
  timestamp: string;
  createdAt: string;
}

const liveIncomingMessagesStore: SavedLineMessage[] = [];

/**
 * Record incoming patient message from LINE Webhook
 */
export async function recordIncomingLineMessage(lineUserId: string, text: string) {
  if (!lineUserId || !text) return null;

  const binding = await getLineUserBinding(lineUserId);
  const hn = binding?.hn || 'HN-UNBOUND';
  const patientName = binding?.patientName || 'ผู้ป่วย (ยังไม่ได้ผูก HN)';
  const now = new Date();

  const msg: SavedLineMessage = {
    id: `msg-live-${now.getTime()}-${Math.random().toString(36).substring(2, 7)}`,
    lineUserId,
    hn,
    patientName,
    text,
    timestamp: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    createdAt: now.toISOString(),
  };

  liveIncomingMessagesStore.unshift(msg);
  if (liveIncomingMessagesStore.length > 200) {
    liveIncomingMessagesStore.pop();
  }

  // Also persist to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      await supabase.from('patient_line_messages').insert({
        line_user_id: lineUserId,
        hn,
        patient_name: patientName,
        message_text: text,
        created_at: now.toISOString(),
      });
    } catch (err) {
      console.warn('⚠️ Error logging LINE message to Supabase:', err);
    }
  }

  return msg;
}

/**
 * Get all live incoming LINE messages stored in memory/Supabase
 */
export function getAllIncomingLineMessages(): SavedLineMessage[] {
  return [...liveIncomingMessagesStore];
}

/**
 * Get incoming LINE messages for a specific HN
 */
export function getIncomingLineMessagesForHn(hn: string): SavedLineMessage[] {
  if (!hn) return [];
  const cleanHn = hn.trim().replace(/^HN-/i, '');
  return liveIncomingMessagesStore.filter(
    (m) => m.hn === hn || m.hn.replace(/^HN-/i, '') === cleanHn
  );
}


