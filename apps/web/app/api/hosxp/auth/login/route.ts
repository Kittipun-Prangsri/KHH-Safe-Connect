import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getHosxpPool() {
  return mysql.createPool({
    host: process.env.HOSXP_DB_HOST || '192.168.1.4',
    port: Number(process.env.HOSXP_DB_PORT) || 3306,
    user: process.env.HOSXP_DB_USER || 'Khos',
    password: process.env.HOSXP_DB_PASSWORD || 'KHzjkowfh',
    database: process.env.HOSXP_DB_NAME || 'hos',
    charset: 'tis620',
    waitForConnections: true,
    connectionLimit: 10,
  });
}

/**
 * Determine Role from HOSxP opduser entryposition, groupname, doctorcode
 */
function mapHosxpRole(user: any): { role: string; roleLabel: string; badgeColor: string } {
  const pos = (user.entryposition || '').toLowerCase();
  const group = (user.groupname || '').toLowerCase();
  const login = (user.loginname || '').toLowerCase();

  if (login === 'admin' || group.includes('admin') || group.includes('it') || pos.includes('สารสนเทศ')) {
    return {
      role: 'super_admin',
      roleLabel: 'ผู้ดูแลระบบ (IT Super Admin)',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    };
  }

  if (user.doctorcode || pos.includes('แพทย์') || pos.includes('พญ') || pos.includes('นพ')) {
    return {
      role: 'doctor',
      roleLabel: 'แพทย์ประจำคลินิก (Doctor)',
      badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
    };
  }

  if (pos.includes('พยาบาล')) {
    return {
      role: 'nurse',
      roleLabel: 'พยาบาลวิชาชีพ (Nurse)',
      badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    };
  }

  if (pos.includes('ผู้อำนวยการ') || pos.includes('หัวหน้า')) {
    return {
      role: 'executive',
      roleLabel: 'ผู้บริหาร (Executive)',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
  }

  return {
    role: 'staff',
    roleLabel: user.entryposition || 'เจ้าหน้าที่ (Staff)',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอก ชื่อผู้ใช้งาน (Username) และ รหัสผ่าน (Password)' },
        { status: 400 }
      );
    }

    const pool = getHosxpPool();

    // Query real opduser from HOSxP database with TIS-620 conversion
    const [rows]: any = await pool.execute(
      `SELECT loginname, 
              CONVERT(name USING utf8mb4) AS name, 
              CONVERT(entryposition USING utf8mb4) AS entryposition, 
              CONVERT(department USING utf8mb4) AS department, 
              CONVERT(groupname USING utf8mb4) AS groupname, 
              doctorcode, passweb, password, password_text, account_disable
       FROM opduser 
       WHERE (loginname = ? OR doctorcode = ? OR cid = ?)
         AND (account_disable IS NULL OR account_disable != 'Y')
       LIMIT 1`,
      [username.trim(), username.trim(), username.trim()]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: `ไม่พบชื่อผู้ใช้งาน '${username}' ในระบบ HOSxP` },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Verify Password against HOSxP passweb (MD5), password_text, or plain text
    const inputMd5Upper = crypto.createHash('md5').update(password).digest('hex').toUpperCase();
    const inputMd5Lower = crypto.createHash('md5').update(password).digest('hex').toLowerCase();

    let isPasswordValid = false;

    if (user.passweb) {
      const passwebUpper = String(user.passweb).toUpperCase();
      if (passwebUpper === inputMd5Upper || passwebUpper === inputMd5Lower || user.passweb === password) {
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid && user.password_text) {
      if (user.password_text === password) {
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid && user.password) {
      if (user.password === password) {
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'รหัสผ่าน HOSxP ไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Determine Role
    const roleInfo = mapHosxpRole(user);
    const fullName = user.name || username;

    const userSession = {
      id: user.loginname,
      loginname: user.loginname,
      name: fullName,
      doctorcode: user.doctorcode || '-',
      position: user.entryposition || 'เจ้าหน้าที่',
      department: user.department || 'โรงพยาบาลคลองหาด',
      role: roleInfo.role,
      roleLabel: roleInfo.roleLabel,
      badgeColor: roleInfo.badgeColor,
      avatarInitials: fullName.slice(0, 2),
    };

    return NextResponse.json({
      success: true,
      message: `⚡ เข้าสู่ระบบ HOSxP สำเร็จ! ยินดีต้อนรับ ${fullName}`,
      user: userSession,
    });
  } catch (error: any) {
    console.error('❌ HOSxP Login Auth Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
