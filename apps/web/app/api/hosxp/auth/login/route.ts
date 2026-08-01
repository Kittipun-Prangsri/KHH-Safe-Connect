import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getHosxpPool } from '@/lib/hosxpClient';

export const dynamic = 'force-dynamic';

const DEMO_USERS: Record<string, any> = {
  '0816': {
    id: '0816',
    loginname: '0816',
    name: 'พญ. สุภาพร ใจดี (Demo Doctor)',
    doctorcode: '0816',
    position: 'แพทย์ประจำคลินิก NCDs',
    department: 'โรงพยาบาลคลองหาด',
    role: 'doctor',
    roleLabel: 'แพทย์ประจำคลินิก (Doctor)',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
    avatarInitials: 'สุ',
  },
  admin: {
    id: 'admin',
    loginname: 'admin',
    name: 'ผู้ดูแลระบบ IT (Demo Super Admin)',
    doctorcode: '-',
    position: 'นักวิชาการคอมพิวเตอร์ / สารสนเทศ',
    department: 'กลุ่มงานสารสนเทศทางการแพทย์',
    role: 'super_admin',
    roleLabel: 'ผู้ดูแลระบบ (IT Super Admin)',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    avatarInitials: 'AD',
  },
  nurse: {
    id: 'nurse',
    loginname: 'nurse',
    name: 'พยาบาลวิชาชีพ (Demo Nurse)',
    doctorcode: '-',
    position: 'พยาบาลวิชาชีพปฏิบัติการ',
    department: 'คลินิกโรคเรื้อรัง NCDs',
    role: 'nurse',
    roleLabel: 'พยาบาลวิชาชีพ (Nurse)',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    avatarInitials: 'พย',
  },
  staff: {
    id: 'staff',
    loginname: 'staff',
    name: 'เจ้าหน้าที่เวชระเบียน (Demo Staff)',
    doctorcode: '-',
    position: 'เจ้าหน้าที่เวชระเบียน',
    department: 'งานเวชระเบียน',
    role: 'staff',
    roleLabel: 'เจ้าหน้าที่ (Staff)',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    avatarInitials: 'จน',
  },
};

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
  let cleanUsername = '';
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอก ชื่อผู้ใช้งาน (Username) และ รหัสผ่าน (Password)' },
        { status: 400 }
      );
    }

    cleanUsername = username.trim();
    const pool = getHosxpPool();

    // Query real opduser from HOSxP database with TIS-620 conversion
    let rows: any[] = [];
    try {
      const [dbRows]: any = await pool.execute(
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
        [cleanUsername, cleanUsername, cleanUsername]
      );
      rows = dbRows;
    } catch (dbErr: any) {
      const isConnectionError =
        dbErr.code === 'ETIMEDOUT' ||
        dbErr.code === 'ECONNREFUSED' ||
        dbErr.code === 'ENOTFOUND' ||
        dbErr.code === 'EHOSTUNREACH' ||
        dbErr.syscall === 'connect';

      if (isConnectionError) {
        console.warn(`⚠️ HOSxP DB Connection Error (${dbErr.code || 'ETIMEDOUT'}). Checking demo user fallback for '${cleanUsername}'...`);

        const demoKey = cleanUsername.toLowerCase();
        const demoUser = DEMO_USERS[demoKey];

        if (demoUser) {
          return NextResponse.json({
            success: true,
            message: `⚡ เข้าสู่ระบบในโหมด Demo สำเร็จ! (เนื่องจากไม่สามารถเชื่อมต่อฐานข้อมูล HOSxP 192.168.1.4 จากภายนอกได้)`,
            user: demoUser,
            isDemoMode: true,
          });
        }

        return NextResponse.json(
          {
            success: false,
            message: `❌ ไม่สามารถเชื่อมต่อฐานข้อมูล HOSxP (192.168.1.4:3306) ได้ (Connection Timeout) - กรุณาตรวจสอบว่าท่านเชื่อมต่อวง LAN โรงพยาบาลหรือ VPN (หรือใช้ Username: 0816 หรือ admin เพื่อทดสอบโหมด Demo)`,
            code: dbErr.code || 'ETIMEDOUT',
          },
          { status: 503 }
        );
      }
      throw dbErr;
    }

    if (!rows || rows.length === 0) {
      // Fallback check for demo accounts if user not found in DB
      const demoKey = cleanUsername.toLowerCase();
      if (DEMO_USERS[demoKey]) {
        return NextResponse.json({
          success: true,
          message: `⚡ เข้าสู่ระบบสำเร็จ (Demo Account)! ยินดีต้อนรับ ${DEMO_USERS[demoKey].name}`,
          user: DEMO_USERS[demoKey],
          isDemoMode: true,
        });
      }

      return NextResponse.json(
        { success: false, message: `ไม่พบชื่อผู้ใช้งาน '${cleanUsername}' ในระบบ HOSxP` },
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
    const fullName = user.name || cleanUsername;

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
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์กับฐานข้อมูล HOSxP' },
      { status: 500 }
    );
  }
}

