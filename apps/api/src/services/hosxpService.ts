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
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

/**
 * Query patient from HOSxP `patient` table by HN or CID
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
 * Query upcoming appointments from HOSxP `oapp` & `patient` & `oapp_moph_appointment_log` tables
 */
export async function getHosxpAppointments(limit = 50) {
  try {
    const pool = getHosxpPool();
    const [rows]: any = await pool.execute(
      `SELECT o.oapp_id, o.hn, CONCAT(COALESCE(p.pname,''), COALESCE(p.fname,''), ' ', COALESCE(p.lname,'')) AS patient_name, 
              o.nextdate, o.nexttime, o.clinic, o.doctor, o.app_cause
       FROM oapp o
       LEFT JOIN patient p ON o.hn = p.hn
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
