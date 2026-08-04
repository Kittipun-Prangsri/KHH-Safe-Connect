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

/**
 * Get patient HN binding for a given LINE User ID (Checking In-Memory & Supabase)
 */
export async function getLineUserBinding(lineUserId: string) {
  if (!lineUserId) return null;

  // 1. Check in-memory store
  if (lineUserBindingStore.has(lineUserId)) {
    return lineUserBindingStore.get(lineUserId)!;
  }

  // 2. Check Supabase patient_line_users table if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('patient_line_users')
        .select('hn, patient_name, created_at')
        .eq('line_user_id', lineUserId)
        .maybeSingle();

      if (data && !error) {
        const binding = {
          hn: data.hn,
          patientName: data.patient_name || 'ผู้ป่วย รพ.คลองหาด',
          boundAt: data.created_at || new Date().toISOString(),
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
 * Bind a LINE User ID to a specific HOSxP HN (Saving to In-Memory & Supabase)
 */
export async function bindLineUserToHn(lineUserId: string, hn: string, patientName: string) {
  if (!lineUserId || !hn) return false;

  const formattedHn = hn.toUpperCase().startsWith('HN-') ? hn.toUpperCase() : `HN-${hn}`;
  const binding = {
    hn: formattedHn,
    patientName,
    boundAt: new Date().toISOString(),
  };

  lineUserBindingStore.set(lineUserId, binding);

  // Persist to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      await supabase.from('patient_line_users').upsert({
        line_user_id: lineUserId,
        hn: formattedHn,
        patient_name: patientName,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('⚠️ Error persisting LINE user binding to Supabase:', err);
    }
  }

  return true;
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

