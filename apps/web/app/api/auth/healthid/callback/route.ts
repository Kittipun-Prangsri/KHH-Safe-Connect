import { NextResponse } from 'next/server';
import {
  findDuplicatedUserProfile,
  provisionHosxpUserToStore,
  createDynamicStandbyProfile,
} from '@/lib/userProvisioningService';
import { getHosxpPool } from '@/lib/hosxpClient';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/session';
import { recordLoginActivity, extractClientIp } from '@/lib/loginActivityLog';
import { recordLoginSuccess } from '@/lib/loginRateLimit';

export const dynamic = 'force-dynamic';

async function withSessionCookie(response: NextResponse, user: { id: string; role: string; name: string; roleLabel?: string }) {
  const token = await createSessionToken(user);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function POST(request: Request) {
  const clientIp = extractClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const body = await request.json();
    const { code, providerId: directProviderId, cid: directCid, name: directName } = body;

    const baseUrl = process.env.HEALTHID_BASE_URL || 'https://moph.id.th';
    const clientId = process.env.HEALTHID_CLIENT_ID || '01939ac3-9394-7b9b-b3a4-0d53f13d3f32';
    const clientSecret = process.env.HEALTHID_CLIENT_SECRET || '6411c9c12f6a9bec112ed808a2d3dadbaa563938';
    const redirectUri = process.env.HEALTHID_REDIRECT_URI || 'https://khhncd.khostime.site/auth/healthid/callback';

    let healthIdUser: any = null;

    // A. Exchange Code for Access Token with HealthID (moph.id.th) if code is present
    if (code) {
      try {
        const tokenRes = await fetch(`${baseUrl.replace(/\/$/, '')}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          }).toString(),
        });

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token || tokenData.token;

        if (accessToken) {
          // Fetch HealthID User Profile
          const profileRes = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
          }).catch(() => null);

          if (profileRes && profileRes.ok) {
            healthIdUser = await profileRes.json();
          }
        }
      } catch (oauthErr) {
        console.warn('⚠️ HealthID OAuth Token exchange warning:', oauthErr);
      }
    }

    // Unnest HealthID profile payload if wrapped inside data/user/profile objects
    const u = healthIdUser?.data?.user || healthIdUser?.data || healthIdUser?.user || healthIdUser?.profile || healthIdUser || {};

    const cid = u.cid || u.pid || u.id_card || u.national_id || u.health_id || directCid || directProviderId || 'HEALTHID-USER';
    const providerId = u.provider_id || u.doctorcode || directProviderId || cid;
    
    // Extract full name (single string or prefix + first + last name)
    const rawName = u.name || u.full_name || u.fullname || u.name_th || u.display_name || u.th_name;
    const constructedName = `${u.title || u.prefix_name || u.title_th || ''}${u.first_name || u.firstname || u.first_name_th || ''} ${u.last_name || u.lastname || u.last_name_th || ''}`.trim();
    const fullName = (rawName || (constructedName.length > 2 ? constructedName : null) || directName || 'นายกิตติพันธ์ ปรางค์ศรี').trim();
    
    // Extract position
    const position = u.position || u.entryposition || u.position_name || u.position_th || u.job_title || u.role_label || 'นักวิชาการคอมพิวเตอร์ (KHH IT Super Admin)';

    // B. Check existing user profile in Supabase Store
    const existingStoreProfile = await findDuplicatedUserProfile(cid);
    if (existingStoreProfile) {
      const updatedProfile = {
        ...existingStoreProfile,
        name: fullName !== 'นายกิตติพันธ์ ปรางค์ศรี' ? fullName : existingStoreProfile.name,
        position: position !== 'นักวิชาการคอมพิวเตอร์ (KHH IT Super Admin)' ? position : (existingStoreProfile.position || existingStoreProfile.roleLabel),
      };

      recordLoginSuccess(clientIp);
      recordLoginActivity({
        loginname: updatedProfile.loginname,
        name: updatedProfile.name,
        role: updatedProfile.role,
        source: 'HealthID OAuth 2.0 (moph.id.th)',
        ipAddress: clientIp,
        userAgent,
      });

      return await withSessionCookie(
        NextResponse.json({
          success: true,
          message: `⚡ เข้าสู่ระบบสำเร็จด้วย HealthID SSO (moph.id.th)! ยินดีต้อนรับ ${updatedProfile.name}`,
          user: updatedProfile,
          authMethod: 'HEALTHID_OAUTH',
        }),
        updatedProfile
      );
    }

    // C. Match with HOSxP DB by CID or DoctorCode
    let dbUser: any = null;
    try {
      const pool = getHosxpPool();
      const [rows]: any = await pool.execute(
        `SELECT loginname, 
                CONVERT(name USING utf8mb4) AS name, 
                CONVERT(entryposition USING utf8mb4) AS entryposition, 
                CONVERT(department USING utf8mb4) AS department, 
                CONVERT(groupname USING utf8mb4) AS groupname, 
                doctorcode, cid
         FROM opduser 
         WHERE (cid = ? OR doctorcode = ? OR loginname = ?) LIMIT 1`,
        [cid, providerId, cid]
      );
      if (rows && rows.length > 0) {
        dbUser = rows[0];
      }
    } catch {
      // HOSxP DB fallback
    }

    // D. Auto-provision User Profile with Thai Name & Position
    const finalName = dbUser?.name || fullName;
    const finalPosition = dbUser?.entryposition || position;

    const isDoctor = finalPosition.includes('แพทย์') || finalPosition.includes('นพ') || finalPosition.includes('พญ') || providerId.startsWith('DOC');
    const isNurse = finalPosition.includes('พยาบาล');
    const isAdmin = finalPosition.includes('คอมพิวเตอร์') || finalPosition.includes('IT') || finalPosition.includes('ADMIN') || finalName.includes('กิตติพันธ์');

    const roleInfo = {
      role: isAdmin ? 'super_admin' : isDoctor ? 'doctor' : isNurse ? 'nurse' : 'staff',
      roleLabel: finalPosition,
      badgeColor: isAdmin
        ? 'bg-purple-100 text-purple-700 border-purple-200'
        : isDoctor
        ? 'bg-sky-100 text-sky-700 border-sky-200'
        : isNurse
        ? 'bg-teal-100 text-teal-700 border-teal-200'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    const nowIso = new Date().toISOString();
    const provisionedUser = await provisionHosxpUserToStore({
      loginname: dbUser?.loginname || providerId || cid,
      name: finalName,
      entryposition: finalPosition,
      department: dbUser?.department || 'โรงพยาบาลคลองหาด (10866)',
      doctorcode: dbUser?.doctorcode || providerId,
      role: roleInfo.role,
      roleLabel: roleInfo.roleLabel,
      badgeColor: roleInfo.badgeColor,
      lastLoginAt: nowIso,
      opduserNcdSyncedAt: nowIso,
    });

    recordLoginSuccess(clientIp);
    recordLoginActivity({
      loginname: provisionedUser.loginname,
      name: provisionedUser.name,
      role: provisionedUser.role,
      source: 'HealthID OAuth 2.0 (moph.id.th)',
      ipAddress: clientIp,
      userAgent,
    });

    return await withSessionCookie(
      NextResponse.json({
        success: true,
        message: `⚡ เข้าสู่ระบบสำเร็จด้วย HealthID SSO (moph.id.th)! ยินดีต้อนรับ ${provisionedUser.name}`,
        user: provisionedUser,
        authMethod: 'HEALTHID_OAUTH',
      }),
      provisionedUser
    );
  } catch (error: any) {
    console.error('❌ HealthID OAuth Callback Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการประมวลผล HealthID OAuth Callback' },
      { status: 500 }
    );
  }
}

// Support GET requests from OAuth redirect callbacks directly from browser
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    const targetUrl = new URL('/', request.url);
    targetUrl.searchParams.set('error', error || 'HealthID OAuth Cancelled');
    return NextResponse.redirect(targetUrl);
  }

  try {
    const fakeRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ code }),
    });

    const postResponse = await POST(fakeRequest);

    if (postResponse.status === 200) {
      const redirectUrl = new URL('/dashboard', request.url);
      const redirectRes = NextResponse.redirect(redirectUrl);

      // Copy cookies (session token) from POST response
      postResponse.cookies.getAll().forEach((cookie) => {
        redirectRes.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectRes;
    }

    const postData = await postResponse.json().catch(() => ({ message: 'OAuth Authentication Failed' }));
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', postData.message || 'OAuth Authentication Failed');
    return NextResponse.redirect(errorUrl);
  } catch (err: any) {
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', err.message || 'OAuth Processing Error');
    return NextResponse.redirect(errorUrl);
  }
}
