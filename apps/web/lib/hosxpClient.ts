import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

/**
 * Get or initialize HOSxP MySQL Connection Pool with short connectTimeout (3s) to prevent Vercel ETIMEDOUT hangs
 */
export function getHosxpPool() {
  if (!pool) {
    const host = process.env.HOSXP_DB_HOST || '192.168.1.4';
    const port = Number(process.env.HOSXP_DB_PORT) || 3306;
    const user = process.env.HOSXP_DB_USER || 'Khos';
    password: process.env.HOSXP_DB_PASSWORD || 'KHzjkowfh';
    const database = process.env.HOSXP_DB_NAME || 'hos';

    pool = mysql.createPool({
      host,
      port,
      user,
      password: process.env.HOSXP_DB_PASSWORD || 'KHzjkowfh',
      database,
      charset: 'tis620',
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 3000, // 3 seconds timeout
      enableKeepAlive: true,
    });
  }
  return pool;
}
