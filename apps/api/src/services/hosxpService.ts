import mysql from 'mysql2/promise';

/**
 * HOSxP Database Connection Pool Configuration
 */
export function getHosxpPool() {
  const host = process.env.HOSXP_DB_HOST || '192.168.1.4';
  const port = Number(process.env.HOSXP_DB_PORT) || 3306;
  const user = process.env.HOSXP_DB_USER || 'Khos';
  const password = process.env.HOSXP_DB_PASSWORD || 'KHzjkowfh';
  const database = process.env.HOSXP_DB_NAME || 'hos';

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    charset: 'tis620',
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 3000,
    queueLimit: 0,
  });
}

/**
 * Get paginated patient list directly from HOSxP `patient` table with Thai TIS-620 search support
 */
export async function getHosxpPatientList(search = '', page = 1, limit = 50) {
  try {
    const pool = getHosxpPool();
    const offset = (page - 1) * limit;

    let sql = `SELECT DISTINCT p.hn, p.pname, p.fname, p.lname, p.birthday, p.sex, p.cid, p.mobile_phone_number, p.hometel, p.informtel 
               FROM patient p
               INNER JOIN clinicmember cm ON p.hn = cm.hn
               WHERE cm.clinic IN ('001', '002')`;
    let countSql = `SELECT COUNT(DISTINCT p.hn) as total 
                    FROM patient p
                    INNER JOIN clinicmember cm ON p.hn = cm.hn
                    WHERE cm.clinic IN ('001', '002')`;
    const params: any[] = [];

    if (search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      const cleanHn = `%${search.trim().replace(/^HN-?/i, '')}%`;
      const whereClause = ` AND (p.hn LIKE ? 
                             OR p.cid LIKE ? 
                             OR CONVERT(p.fname USING utf8mb4) LIKE ? 
                             OR CONVERT(p.lname USING utf8mb4) LIKE ? 
                             OR CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) LIKE ?)`;
      sql += whereClause;
      countSql += whereClause;
      params.push(cleanHn, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += ` ORDER BY p.hn DESC LIMIT ? OFFSET ?`;

    const [rows]: any = await pool.execute(sql, [...params, limit, offset]);
    const [countRows]: any = await pool.execute(countSql, params);

    const patients = rows.map((p: any) => ({
      id: p.hn,
      hn: p.hn.startsWith('HN-') ? p.hn : `HN-${p.hn}`,
      rawHn: p.hn,
      name: `${p.pname || ''}${p.fname || ''} ${p.lname || ''}`.trim(),
      cid: p.cid || '-',
      birthday: p.birthday,
      sex: p.sex === '1' ? 'ชาย' : 'หญิง',
      phone: p.mobile_phone_number || p.hometel || p.informtel || '081-000-0000',
    }));

    return {
      patients,
      total: countRows[0].total,
      page,
      limit,
    };
  } catch (error) {
    console.error('❌ HOSxP Patient List Error:', error);
    throw error;
  }
}

/**
 * Query single patient details by HN or CID
 */
export async function getHosxpPatientByHnOrCid(query: string) {
  try {
    const pool = getHosxpPool();
    const cleanQuery = query.replace(/^HN-?/i, '');
    const [rows]: any = await pool.execute(
      `SELECT hn, pname, fname, lname, birthday, sex, cid, mobile_phone_number, hometel, informtel 
       FROM patient 
       WHERE hn = ? OR cid = ? 
       LIMIT 1`,
      [cleanQuery, cleanQuery]
    );

    if (!rows || rows.length === 0) return null;

    const p = rows[0];
    return {
      hn: p.hn,
      fullName: `${p.pname || ''}${p.fname || ''} ${p.lname || ''}`.trim(),
      cid: p.cid,
      birthday: p.birthday,
      sex: p.sex === '1' ? 'ชาย' : 'หญิง',
      phone: p.mobile_phone_number || p.hometel || p.informtel || '',
    };
  } catch (error) {
    console.error('❌ HOSxP Patient Query Error:', error);
    throw error;
  }
}

/**
 * Query patient medical treatment history from HOSxP (`ovst` + `opdscreen` + `vn_stat`)
 */
export async function getHosxpPatientMedicalHistory(hn: string, limit = 10) {
  try {
    const pool = getHosxpPool();
    const cleanHn = hn.replace(/^HN-?/i, '');
    const [rows]: any = await pool.execute(
      `SELECT o.vn, o.vstdate, o.vsttime, s.bps, s.bpd, s.fbs, s.bw, s.height, s.bmi, s.pulse, v.pdx, v.dx0, v.dx1
       FROM ovst o
       LEFT JOIN opdscreen s ON o.vn = s.vn
       LEFT JOIN vn_stat v ON o.vn = v.vn
       WHERE o.hn = ?
       ORDER BY o.vstdate DESC, o.vsttime DESC
       LIMIT ?`,
      [cleanHn, limit]
    );

    return rows.map((r: any) => ({
      vn: r.vn,
      visitDate: r.vstdate,
      visitTime: r.vsttime,
      bp: r.bps && r.bpd ? `${r.bps}/${r.bpd} mmHg` : 'ไม่พบข้อมูล',
      fbs: r.fbs ? `${r.fbs} mg/dL` : 'ไม่ได้เจาะเลือด',
      bw: r.bw ? `${r.bw} kg` : '-',
      bmi: r.bmi ? r.bmi : '-',
      pulse: r.pulse ? `${r.pulse} bpm` : '-',
      primaryDiagnosisICD10: r.pdx || 'ไม่ระบุ',
      secondaryDiagnoses: [r.dx0, r.dx1].filter(Boolean),
    }));
  } catch (error) {
    console.error('❌ HOSxP Patient Medical History Error:', error);
    throw error;
  }
}

export interface HosxpAppointmentOptions {
  search?: string;
  startDate?: string;
  endDate?: string;
  hn?: string;
  clinic?: string;
  page?: number;
  limit?: number;
  latestPerPatient?: boolean;
}

/**
 * Query upcoming/filtered appointments directly from HOSxP `oapp` JOIN `patient`, `clinic`, `doctor`
 * Uses the latest `nextdate` per patient for upcoming appointment tracking
 * Supports search, date ranges, clinic filtering, HN filtering, pagination, and TIS-620 to UTF-8 conversion
 */
export async function getHosxpAppointments(optionsOrLimit: number | HosxpAppointmentOptions = 50) {
  try {
    const pool = getHosxpPool();

    let search = '';
    let startDate = '';
    let endDate = '';
    let hn = '';
    let clinic = '001,002'; // default NCD clinics
    let page = 1;
    let limit = 50;
    let latestPerPatient = true;

    if (typeof optionsOrLimit === 'number') {
      limit = optionsOrLimit;
    } else if (typeof optionsOrLimit === 'object' && optionsOrLimit !== null) {
      search = optionsOrLimit.search || '';
      startDate = optionsOrLimit.startDate || '';
      endDate = optionsOrLimit.endDate || '';
      hn = optionsOrLimit.hn || '';
      clinic = optionsOrLimit.clinic !== undefined ? optionsOrLimit.clinic : '001,002';
      page = optionsOrLimit.page || 1;
      limit = optionsOrLimit.limit || 50;
      if (optionsOrLimit.latestPerPatient !== undefined) {
        latestPerPatient = optionsOrLimit.latestPerPatient;
      }
    }

    const offset = (page - 1) * limit;
    const params: any[] = [];

    let joinSql = '';
    if (latestPerPatient && !hn.trim()) {
      // Get the latest nextdate per patient for upcoming appointments
      joinSql += ` INNER JOIN (
        SELECT hn, MAX(nextdate) AS max_nextdate
        FROM oapp
        WHERE nextdate >= CURDATE()
        GROUP BY hn
      ) latest_app ON o.hn = latest_app.hn AND o.nextdate = latest_app.max_nextdate `;
    }

    let whereSql = ' WHERE 1=1';

    if (clinic && clinic !== 'all') {
      const clinicList = clinic.split(',').map((c) => c.trim()).filter(Boolean);
      if (clinicList.length > 0) {
        whereSql += ` AND o.clinic IN (${clinicList.map(() => '?').join(',')})`;
        params.push(...clinicList);
      }
    }

    if (hn.trim()) {
      const cleanHn = hn.trim().replace(/^HN-?/i, '');
      whereSql += ` AND o.hn = ?`;
      params.push(cleanHn);
    }

    if (startDate && endDate) {
      whereSql += ` AND o.nextdate BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      whereSql += ` AND o.nextdate >= ?`;
      params.push(startDate);
    } else if (endDate) {
      whereSql += ` AND o.nextdate <= ?`;
      params.push(endDate);
    } else if (!hn.trim() && !search.trim()) {
      whereSql += ` AND o.nextdate >= CURDATE()`;
    }

    if (search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      const cleanSearchHn = `%${search.trim().replace(/^HN-?/i, '')}%`;
      whereSql += ` AND (
        o.hn LIKE ? 
        OR p.cid LIKE ? 
        OR CONVERT(p.fname USING utf8mb4) LIKE ? 
        OR CONVERT(p.lname USING utf8mb4) LIKE ? 
        OR CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) LIKE ?
      )`;
      params.push(cleanSearchHn, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const countSql = `SELECT COUNT(DISTINCT o.oapp_id) as total 
                      FROM oapp o 
                      ${joinSql}
                      LEFT JOIN patient p ON o.hn = p.hn 
                      ${whereSql}`;

    const sql = `SELECT o.oapp_id, 
                        o.hn, 
                        CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) AS patient_name, 
                        COALESCE(p.mobile_phone_number, p.hometel, p.informtel) AS phone,
                        p.cid,
                        p.birthday,
                        o.vstdate,
                        o.nextdate, 
                        o.nexttime, 
                        o.clinic, 
                        CONVERT(c.name USING utf8mb4) AS clinic_name, 
                        o.doctor, 
                        CONVERT(d.name USING utf8mb4) AS doctor_name, 
                        CONVERT(o.app_cause USING utf8mb4) AS app_cause,
                        CONVERT(o.note USING utf8mb4) AS note,
                        CONVERT(o.contact_point USING utf8mb4) AS contact_point
                 FROM oapp o
                 ${joinSql}
                 LEFT JOIN patient p ON o.hn = p.hn
                 LEFT JOIN clinic c ON o.clinic = c.clinic
                 LEFT JOIN doctor d ON o.doctor = d.code
                 ${whereSql}
                 GROUP BY o.oapp_id
                 ORDER BY o.nextdate DESC, o.nexttime DESC 
                 LIMIT ? OFFSET ?`;

    const [rows]: any = await pool.execute(sql, [...params, limit, offset]);
    const [countRows]: any = await pool.execute(countSql, params);

    const appointments = rows.map((r: any) => {
      let rawDate = '';
      if (r.nextdate) {
        const d = new Date(r.nextdate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        rawDate = `${year}-${month}-${day}`;
      }

      return {
        id: String(r.oapp_id),
        oapp_id: r.oapp_id,
        hn: r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : 'HN-0000',
        rawHn: r.hn,
        patientName: r.patient_name || 'ไม่ระบุชื่อ',
        phone: r.phone || '-',
        cid: r.cid || '-',
        birthday: r.birthday,
        vstDate: r.vstdate,
        nextDate: r.nextdate,
        nextTime: r.nexttime,
        rawDate,
        dateFormatted: r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-',
        timeFormatted: r.nexttime ? `${r.nexttime} น.` : '08:30 น.',
        clinicCode: r.clinic,
        clinicName: r.clinic_name || 'คลินิก NCDs',
        doctorCode: r.doctor,
        doctorName: r.doctor_name || 'แพทย์ผู้ตรวจ',
        appCause: r.app_cause || 'ตรวจติดตามอาการ NCDs',
        note: r.note || '',
        contactPoint: r.contact_point || '',
        status: 'confirmed',
      };
    });

    if (typeof optionsOrLimit === 'number') {
      return appointments;
    }

    return {
      appointments,
      total: countRows[0]?.total || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error('❌ HOSxP Appointment Query Error:', error);
    throw error;
  }
}

/**
 * Query appointments by HN from HOSxP `oapp`
 */
export async function getHosxpAppointmentsByHn(hn: string, limit = 20) {
  return getHosxpAppointments({ hn, limit, clinic: 'all' });
}

/**
 * Query single appointment detail by `oapp_id` from HOSxP `oapp`
 */
export async function getHosxpAppointmentById(oappId: number | string) {
  try {
    const pool = getHosxpPool();
    const [rows]: any = await pool.execute(
      `SELECT o.oapp_id, 
              o.hn, 
              CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) AS patient_name, 
              COALESCE(p.mobile_phone_number, p.hometel, p.informtel) AS phone,
              p.cid,
              p.birthday,
              o.vstdate,
              o.nextdate, 
              o.nexttime, 
              o.clinic, 
              CONVERT(c.name USING utf8mb4) AS clinic_name, 
              o.doctor, 
              CONVERT(d.name USING utf8mb4) AS doctor_name, 
              CONVERT(o.app_cause USING utf8mb4) AS app_cause,
              CONVERT(o.note USING utf8mb4) AS note,
              CONVERT(o.contact_point USING utf8mb4) AS contact_point
       FROM oapp o
       LEFT JOIN patient p ON o.hn = p.hn
       LEFT JOIN clinic c ON o.clinic = c.clinic
       LEFT JOIN doctor d ON o.doctor = d.code
       WHERE o.oapp_id = ?
       LIMIT 1`,
      [oappId]
    );

    if (!rows || rows.length === 0) return null;

    const r = rows[0];
    let rawDate = '';
    if (r.nextdate) {
      const d = new Date(r.nextdate);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      rawDate = `${year}-${month}-${day}`;
    }

    return {
      id: String(r.oapp_id),
      oapp_id: r.oapp_id,
      hn: r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : 'HN-0000',
      rawHn: r.hn,
      patientName: r.patient_name || 'ไม่ระบุชื่อ',
      phone: r.phone || '-',
      cid: r.cid || '-',
      birthday: r.birthday,
      vstDate: r.vstdate,
      nextDate: r.nextdate,
      nextTime: r.nexttime,
      rawDate,
      dateFormatted: r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-',
      timeFormatted: r.nexttime ? `${r.nexttime} น.` : '08:30 น.',
      clinicCode: r.clinic,
      clinicName: r.clinic_name || 'คลินิก NCDs',
      doctorCode: r.doctor,
      doctorName: r.doctor_name || 'แพทย์ผู้ตรวจ',
      appCause: r.app_cause || 'ตรวจติดตามอาการ NCDs',
      note: r.note || '',
      contactPoint: r.contact_point || '',
      status: 'confirmed',
    };
  } catch (error) {
    console.error('❌ HOSxP Appointment Detail Query Error:', error);
    throw error;
  }
}

/**
 * Query NCDs missed follow-ups and calculate patient overdue days from HOSxP
 * Filters out patients who have already visited or rescheduled
 */
export async function getHosxpMissedFollowUps(limit = 50, daysInterval = 60) {
  try {
    const pool = getHosxpPool();
    const [rows]: any = await pool.execute(
      `SELECT o.oapp_id, 
              o.hn, 
              CONVERT(CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) USING utf8mb4) AS patient_name,
              COALESCE(p.mobile_phone_number, p.hometel, p.informtel) AS phone,
              p.cid,
              o.vstdate,
              o.nextdate, 
              o.nexttime, 
              o.clinic, 
              CONVERT(c.name USING utf8mb4) AS clinic_name, 
              o.doctor, 
              CONVERT(d.name USING utf8mb4) AS doctor_name, 
              CONVERT(o.app_cause USING utf8mb4) AS app_cause,
              DATEDIFF(CURDATE(), o.nextdate) AS overdue_days
       FROM oapp o
       LEFT JOIN patient p ON o.hn = p.hn
       LEFT JOIN clinic c ON o.clinic = c.clinic
       LEFT JOIN doctor d ON o.doctor = d.code
       WHERE o.nextdate < CURDATE()
         AND o.nextdate >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         AND (
           o.clinic IN ('001', '002', '030', '011', '012', '026', '018', '003')
           OR CONVERT(c.name USING utf8mb4) LIKE '%เบาหวาน%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%ความดัน%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%CKD%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%NCD%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%COPD%'
           OR CONVERT(c.name USING utf8mb4) LIKE '%Stroke%'
         )
         AND NOT EXISTS (
           SELECT 1 FROM ovst v WHERE v.hn = o.hn AND v.vstdate >= o.nextdate
         )
         AND NOT EXISTS (
           SELECT 1 FROM oapp o2 WHERE o2.hn = o.hn AND o2.nextdate > o.nextdate
         )
       ORDER BY o.nextdate ASC
       LIMIT ?`,
      [daysInterval, limit]
    );

    return rows.map((r: any) => {
      const overdueDays = Number(r.overdue_days) || 0;
      const dateStr = r.nextdate ? new Date(r.nextdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

      let priority: 'urgent' | 'high' | 'normal' = 'normal';
      let overdueStatusText = '';

      if (overdueDays >= 14) {
        priority = 'urgent';
        overdueStatusText = `🔴 เลยกำหนด ${overdueDays} วัน (เกิน 2 สัปดาห์ - ด่วนที่สุด)`;
      } else if (overdueDays >= 7) {
        priority = 'urgent';
        overdueStatusText = `🔴 เลยกำหนด ${overdueDays} วัน (เกิน 1 สัปดาห์ - ด่วนที่สุด)`;
      } else if (overdueDays >= 3) {
        priority = 'high';
        overdueStatusText = `🟡 เลยกำหนด ${overdueDays} วัน (ด่วน)`;
      } else {
        priority = 'normal';
        overdueStatusText = `🟢 เลยกำหนด ${overdueDays} วัน (ปกติ)`;
      }

      return {
        id: String(r.oapp_id),
        oapp_id: r.oapp_id,
        hn: r.hn ? (r.hn.startsWith('HN-') ? r.hn : `HN-${r.hn}`) : `HN-${r.hn}`,
        rawHn: r.hn,
        patientName: r.patient_name || 'ไม่ระบุชื่อ',
        phone: r.phone || '-',
        cid: r.cid || '-',
        taskType: 'ติดตามขาดนัด NCDs',
        assignedTo: 'พยาบาล NCDs (โรงพยาบาลคลองหาด)',
        missedDate: r.nextdate,
        overdueDays,
        overdueStatusText,
        dueDate: `ขาดนัดเมื่อ ${dateStr} (${overdueDays} วันที่แล้ว)`,
        priority,
        status: 'todo',
        clinic: r.clinic_name || 'คลินิก NCDs',
        doctor: r.doctor_name || 'แพทย์ผู้ตรวจ',
        appCause: r.app_cause || 'ตรวจติดตามอาการ NCDs',
      };
    });
  } catch (error) {
    console.error('❌ HOSxP Missed Follow-ups Query Error:', error);
    throw error;
  }
}


