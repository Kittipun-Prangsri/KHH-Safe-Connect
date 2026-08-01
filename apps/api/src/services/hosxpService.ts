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

    let sql = `SELECT hn, pname, fname, lname, birthday, sex, cid, mobile_phone_number, hometel, informtel 
               FROM patient`;
    let countSql = `SELECT COUNT(*) as total FROM patient`;
    const params: any[] = [];

    if (search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      const cleanHn = `%${search.trim().replace(/^HN-?/i, '')}%`;
      const whereClause = ` WHERE hn LIKE ? 
                             OR cid LIKE ? 
                             OR CONVERT(fname USING utf8mb4) LIKE ? 
                             OR CONVERT(lname USING utf8mb4) LIKE ? 
                             OR CONVERT(CONCAT(COALESCE(pname,''), COALESCE(fname,''), ' ', COALESCE(lname,'')) USING utf8mb4) LIKE ?`;
      sql += whereClause;
      countSql += whereClause;
      params.push(cleanHn, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += ` ORDER BY hn DESC LIMIT ? OFFSET ?`;

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

/**
 * Query upcoming appointments from HOSxP `oapp` JOIN `patient`, `clinic`, `doctor`
 */
export async function getHosxpAppointments(limit = 50) {
  try {
    const pool = getHosxpPool();
    const [rows]: any = await pool.execute(
      `SELECT o.oapp_id, o.hn, CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) AS patient_name, 
              o.nextdate, o.nexttime, o.clinic, c.name AS clinic_name, o.doctor, d.name AS doctor_name, o.app_cause
       FROM oapp o
       LEFT JOIN patient p ON o.hn = p.hn
       LEFT JOIN clinic c ON o.clinic = c.clinic
       LEFT JOIN doctor d ON o.doctor = d.code
       WHERE o.nextdate >= CURDATE()
       ORDER BY o.nextdate ASC
       LIMIT ?`,
      [limit]
    );

    return rows;
  } catch (error) {
    console.error('❌ HOSxP Appointment Query Error:', error);
    throw error;
  }
}
