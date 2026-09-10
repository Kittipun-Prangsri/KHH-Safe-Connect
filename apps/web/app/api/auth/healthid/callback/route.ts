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
    let tokenData: any = {};
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

        tokenData = await tokenRes.json().catch(() => ({}));
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

    // Decode JWT payload from access_token / id_token if available
    const decodeJwt = (t?: string) => {
      if (!t || typeof t !== 'string' || !t.includes('.')) return {};
      try {
        const parts = t.split('.');
        if (parts.length < 2) return {};
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
      } catch {
        return {};
      }
    };
    const jwtData = decodeJwt(tokenData?.access_token || tokenData?.token || tokenData?.id_token);

    // Unnest HealthID profile payload if wrapped inside data/user/profile objects
    const u = healthIdUser?.data?.user || healthIdUser?.data || healthIdUser?.user || healthIdUser?.profile || healthIdUser || jwtData || {};

    const cid = u.cid || u.pid || u.id_card || u.national_id || u.health_id || jwtData.cid || jwtData.pid || directCid || directProviderId || 'HEALTHID-USER';
    const providerId = u.provider_id || u.doctorcode || jwtData.provider_id || directProviderId || cid;

    // Extract full name DIRECTLY from MOPH ID / ProviderID response parameters
    const rawName = u.provider_name || u.provider_full_name || u.name_th || u.name || u.full_name || u.fullname || u.display_name || u.th_name || jwtData.provider_name || jwtData.name_th || jwtData.name || jwtData.full_name;
    const constructedName = `${u.title || u.prefix_name || u.title_th || ''}${u.first_name || u.firstname || u.first_name_th || ''} ${u.last_name || u.lastname || u.last_name_th || ''}`.trim();
    const mophIdName = (rawName || (constructedName.length > 2 ? constructedName : null) || directName || '').trim();

    // Extract position DIRECTLY from MOPH ID / ProviderID response parameters
    const orgObj = typeof u.organization === 'object' ? u.organization : (typeof jwtData.organization === 'object' ? jwtData.organization : {});
    const orgPosition = orgObj?.position || orgObj?.position_name || orgObj?.entryposition || u.organization_position || jwtData.organization_position;
    const rawPosition = orgPosition || u.position || u.entryposition || u.position_name || u.position_th || u.job_title || u.role_label || jwtData.position || jwtData.entryposition;
    const mophIdPosition = (rawPosition || '').trim();

    // Match HOSxP DB by CID, ProviderID (doctorcode), or loginname
    let dbUser: any = null;
    try {
      const pool = getHosxpPool();
      // Try opduser table first by CID or ProviderID (doctorcode)
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
      } else if (providerId) {
        // Fallback: Query HOSxP doctor table by ProviderID (doctorcode / licenseno)
        const [docRows]: any = await pool.execute(
          `SELECT code AS doctorcode, 
                  CONVERT(name USING utf8mb4) AS name, 
                  CONVERT(position_name USING utf8mb4) AS entryposition, 
                  cid
           FROM doctor 
           WHERE (code = ? OR licenseno = ? OR cid = ?) LIMIT 1`,
          [providerId, providerId, cid]
        );
        if (docRows && docRows.length > 0) {
          dbUser = docRows[0];
        }
      }
    } catch {
      // HOSxP DB fallback
    }

    const isGeneric = (str?: string) => !str || str.includes('MOPH ID') || str.includes('MOPH Provider') || str.includes('HEALTHID') || str.includes('HealthID') || str.includes('บุคลากรสาธารณสุข');

    const fallbackName = (providerId && providerId !== 'HEALTHID-USER')
      ? `เจ้าหน้าที่ (Provider ID: ${providerId})`
      : (cid && cid !== 'HEALTHID-USER')
      ? `บุคลากร MOPH ID (${cid})`
      : 'เจ้าหน้าที่สาธารณสุข';

    const fallbackPosition = (providerId && providerId !== 'HEALTHID-USER')
      ? `บุคลากรทางการแพทย์ (${providerId})`
      : 'บุคลากรสาธารณสุข';

    const displayName = mophIdName || dbUser?.name || fallbackName;
    const displayPosition = mophIdPosition || dbUser?.entryposition || fallbackPosition;

    // B. Check existing user profile in Supabase Store and update with real MOPH ID/HOSxP info
    const existingStoreProfile = await findDuplicatedUserProfile(cid);
    if (existingStoreProfile) {
      const finalName = mophIdName || dbUser?.name || (isGeneric(existingStoreProfile.name) ? displayName : existingStoreProfile.name);
      const finalPos = mophIdPosition || dbUser?.entryposition || (isGeneric(existingStoreProfile.position) ? displayPosition : existingStoreProfile.position);

      const isDoctor = finalPos.includes('แพทย์') || finalPos.includes('นพ') || finalPos.includes('พญ');
      const isNurse = finalPos.includes('พยาบาล');
      const isAdmin = finalPos.includes('คอมพิวเตอร์') || finalPos.includes('IT') || finalPos.includes('ADMIN');

      const updatedProfile = {
        ...existingStoreProfile,
        name: finalName,
        position: finalPos,
        role: isAdmin ? 'super_admin' : isDoctor ? 'doctor' : isNurse ? 'nurse' : existingStoreProfile.role,
        roleLabel: finalPos,
        badgeColor: isAdmin
          ? 'bg-purple-100 text-purple-700 border-purple-200'
          : isDoctor
            ? 'bg-sky-100 text-sky-700 border-sky-200'
            : isNurse
              ? 'bg-teal-100 text-teal-700 border-teal-200'
              : existingStoreProfile.badgeColor || 'bg-emerald-100 text-emerald-700 border-emerald-200',
      };

      recordLoginSuccess(clientIp);
      recordLoginActivity({
        loginname: updatedProfile.loginname,
        name: updatedProfile.name,
        role: updatedProfile.role,
        source: 'MOPH ID (moph.id.th)',
        ipAddress: clientIp,
        userAgent,
      });

      return await withSessionCookie(
        NextResponse.json({
          success: true,
          message: `⚡ เข้าสู่ระบบสำเร็จด้วย MOPH ID! ยินดีต้อนรับ ${updatedProfile.name}`,
          user: updatedProfile,
          authMethod: 'HEALTHID_OAUTH',
        }),
        updatedProfile
      );
    }

    // D. Auto-provision User Profile with MOPH ID / HOSxP Real Name & Position
    const isDoctor = displayPosition.includes('แพทย์') || displayPosition.includes('นพ') || displayPosition.includes('พญ') || providerId.startsWith('DOC');
    const isNurse = displayPosition.includes('พยาบาล');
    const isAdmin = displayPosition.includes('คอมพิวเตอร์') || displayPosition.includes('IT') || displayPosition.includes('ADMIN');

    const roleInfo = {
      role: isAdmin ? 'super_admin' : isDoctor ? 'doctor' : isNurse ? 'nurse' : 'staff',
      roleLabel: displayPosition,
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
      name: displayName,
      entryposition: displayPosition,
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
