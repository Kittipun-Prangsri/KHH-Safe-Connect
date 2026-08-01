import { NextResponse } from 'next/server';
import { getHosxpPool } from '@/lib/hosxpClient';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = Number(searchParams.get('limit')) || 50;

    const pool = getHosxpPool();
    let sql = `SELECT hn, 
                      CONVERT(pname USING utf8mb4) as pname, 
                      CONVERT(fname USING utf8mb4) as fname, 
                      CONVERT(lname USING utf8mb4) as lname, 
                      birthday, sex, cid, mobile_phone_number, hometel, informtel 
               FROM patient`;
    const params: any[] = [];

    if (search.trim()) {
      const cleanHn = `%${search.trim().replace(/^HN-?/i, '')}%`;
      const searchPattern = `%${search.trim()}%`;
      sql += ` WHERE hn LIKE ? 
                  OR cid LIKE ? 
                  OR CONVERT(fname USING utf8mb4) LIKE ? 
                  OR CONVERT(lname USING utf8mb4) LIKE ? 
                  OR CONVERT(CONCAT(COALESCE(pname,''), COALESCE(fname,''), ' ', COALESCE(lname,'')) USING utf8mb4) LIKE ?`;
      params.push(cleanHn, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += ` ORDER BY hn DESC LIMIT ?`;
    params.push(limit);

    const [rows]: any = await pool.execute(sql, params);

    const patients = rows.map((p: any) => ({
      id: p.hn,
      hn: p.hn.startsWith('HN-') ? p.hn : `HN-${p.hn}`,
      rawHn: p.hn,
      name: `${p.pname || ''}${p.fname || ''} ${p.lname || ''}`.trim() || 'ไม่ระบุชื่อ',
      cid: p.cid || '-',
      birthday: p.birthday,
      sex: p.sex === '1' ? 'ชาย' : 'หญิง',
      phone: p.mobile_phone_number || p.hometel || p.informtel || '081-000-0000',
      diseases: ['NCDs', 'DM/HT'],
      status: 'active',
    }));

    return NextResponse.json({ success: true, count: patients.length, patients });
  } catch (error: any) {
    console.error('❌ Real HOSxP Patients API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
