import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.id,
        loginname: session.id,
        name: session.name,
        role: session.role,
        roleLabel: session.roleLabel || session.role,
        position: session.roleLabel || 'เจ้าหน้าที่ทางการแพทย์',
        badgeColor: session.role === 'super_admin'
          ? 'bg-purple-100 text-purple-700 border-purple-200'
          : session.role === 'doctor'
            ? 'bg-sky-100 text-sky-700 border-sky-200'
            : session.role === 'nurse'
              ? 'bg-teal-100 text-teal-700 border-teal-200'
              : 'bg-emerald-100 text-emerald-700 border-emerald-200',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
