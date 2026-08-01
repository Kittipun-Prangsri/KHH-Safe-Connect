import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

function getHosxpPool() {
  return mysql.createPool({
    host: process.env.HOSXP_DB_HOST || '192.168.1.4',
    port: Number(process.env.HOSXP_DB_PORT) || 3306,
    user: process.env.HOSXP_DB_USER || 'Khos',
    password: process.env.HOSXP_DB_PASSWORD || 'KHzjkowfh',
    database: process.env.HOSXP_DB_NAME || 'hos',
    waitForConnections: true,
    connectionLimit: 5,
  });
}

export async function GET(
  request: Request,
  { params }: { params: { hn: string } }
) {
  try {
    const hn = params.hn.replace(/^HN-?/i, '');
    const pool = getHosxpPool();

    const [rows]: any = await pool.execute(
      `SELECT o.vn, o.vstdate, o.vsttime, s.bps, s.bpd, s.fbs, s.bw, s.height, s.bmi, s.pulse, v.pdx
       FROM ovst o
       LEFT JOIN opdscreen s ON o.vn = s.vn
       LEFT JOIN vn_stat v ON o.vn = v.vn
       WHERE o.hn = ?
       ORDER BY o.vstdate DESC, o.vsttime DESC
       LIMIT 10`,
      [hn]
    );

    const history = rows.map((r: any) => {
      const dateStr = r.vstdate ? new Date(r.vstdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
      return {
        vn: r.vn,
        visitDate: dateStr,
        visitTime: r.vsttime || '-',
        bp: r.bps && r.bpd ? `${r.bps}/${r.bpd} mmHg` : 'ไม่พบข้อมูล',
        fbs: r.fbs ? `${r.fbs} mg/dL` : 'ไม่ได้เจาะเลือด',
        bw: r.bw ? `${r.bw} kg` : '-',
        bmi: r.bmi ? `${r.bmi}` : '-',
        pulse: r.pulse ? `${r.pulse} bpm` : '-',
        primaryDiagnosisICD10: r.pdx || 'ไม่ระบุ',
      };
    });

    return NextResponse.json({ success: true, hn, count: history.length, history });
  } catch (error: any) {
    console.error('❌ Real HOSxP Medical History API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
