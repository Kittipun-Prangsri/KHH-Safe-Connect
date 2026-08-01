import mysql from 'mysql2/promise';

/**
 * HOSxP Database Connection Pool Configuration
 */
export function getHosxpPool() {
  const host = process.env.HOSXP_DB_HOST || '127.0.0.1';
  const port = Number(process.env.HOSXP_DB_PORT) || 3306;
  const user = process.env.HOSXP_DB_USER || 'sa';
  const password = process.env.HOSXP_DB_PASSWORD || '';
  const database = process.env.HOSXP_DB_NAME || 'hosxp';

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
    const [rows]: any = await pool.execute(
      `SELECT hn, pname, fname, lname, birthday, sex, cid, mobile_phone_number, hometel, informtel 
       FROM patient 
       WHERE hn = ? OR cid = ? 
       LIMIT 1`,
      [query, query]
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
 * Query appointments from HOSxP `oapp_moph_appointment_log` table
 */
export async function getHosxpAppointments(limit = 50) {
  try {
    const pool = getHosxpPool();
    const [rows]: any = await pool.execute(
      `SELECT log.oapp_id, log.hn, CONCAT(p.pname, p.fname, ' ', p.lname) AS patient_name, 
              log.nextdate, log.nexttime, log.clinic, log.doctor, log.app_cause
       FROM oapp_moph_appointment_log log
       LEFT JOIN patient p ON log.hn = p.hn
       WHERE log.nextdate >= CURDATE()
       ORDER BY log.nextdate ASC
       LIMIT ?`,
      [limit]
    );

    return rows;
  } catch (error) {
    console.error('❌ HOSxP Appointment Query Error:', error);
    throw error;
  }
}
