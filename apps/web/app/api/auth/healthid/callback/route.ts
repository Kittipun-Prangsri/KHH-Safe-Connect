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
          // Fetch HealthID User Profile across standard MOPH ID endpoints
          const profileEndpoints = [
            `${baseUrl.replace(/\/$/, '')}/api/v1/users/me`,
            `${baseUrl.replace(/\/$/, '')}/oauth/userinfo`,
            `${baseUrl.replace(/\/$/, '')}/api/v1/profile`,
            `${baseUrl.replace(/\/$/, '')}/api/v1/user`,
          ];

          for (const ep of profileEndpoints) {
            try {
              const profileRes = await fetch(ep, {
                headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
              });
              if (profileRes && profileRes.ok) {
                const resJson = await profileRes.json();
                if (resJson && Object.keys(resJson).length > 0) {
                  healthIdUser = resJson;
                  break;
                }
              }
            } catch {
              // Try next endpoint
            }
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

    // Deep recursive extractor for any key list inside nested objects
    const extractDeepKey = (obj: any, keys: string[]): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      for (const k of keys) {
        if (obj[k] && (typeof obj[k] === 'string' || typeof obj[k] === 'number')) {
          const val = String(obj[k]).trim();
          if (val.length > 0) return val;
        }
      }
      for (const subKey of Object.keys(obj)) {
        if (obj[subKey] && typeof obj[subKey] === 'object') {
          const res = extractDeepKey(obj[subKey], keys);
          if (res) return res;
        }
      }
      return null;
    };

    // Extract CID & Provider ID from all possible sources
    const cidCandidate = extractDeepKey(healthIdUser, ['cid', 'pid', 'id_card', 'national_id', 'health_id', 'sub']) ||
                         extractDeepKey(jwtData, ['cid', 'pid', 'sub']) ||
                         directCid || directProviderId;
    const cid = cidCandidate && cidCandidate !== 'HEALTHID-USER' ? cidCandidate : 'HEALTHID-USER';

    const providerIdCandidate = extractDeepKey(healthIdUser, ['provider_id', 'providerId', 'doctorcode', 'doctor_code', 'license_no', 'licenseno']) ||
                                extractDeepKey(jwtData, ['provider_id', 'doctorcode']) ||
                                directProviderId || cid;
    const providerId = providerIdCandidate || cid;

    // Extract Name DIRECTLY from MOPH ID / Provider Center payloads
    const directNameFound = extractDeepKey(healthIdUser, ['provider_name', 'provider_full_name', 'doctor_name', 'staff_name', 'name_th', 'th_name', 'full_name_th', 'name', 'full_name', 'fullname', 'display_name']) ||
                            extractDeepKey(jwtData, ['provider_name', 'name_th', 'name', 'full_name']) ||
                            directName;

    const title = extractDeepKey(healthIdUser, ['title_th', 'title', 'prefix_name', 'prefix']) || '';
    const firstName = extractDeepKey(healthIdUser, ['first_name_th', 'first_name', 'firstname', 'fname_th', 'fname']) || '';
    const lastName = extractDeepKey(healthIdUser, ['last_name_th', 'last_name', 'lastname', 'lname_th', 'lname']) || '';
    const constructedName = (firstName || lastName) ? `${title}${firstName} ${lastName}`.trim() : null;

    const mophIdName = (directNameFound || (constructedName && constructedName.length > 2 ? constructedName : null) || '').trim();

    // Extract Position DIRECTLY from MOPH ID / Provider Center payloads
    const rawPosFound = extractDeepKey(healthIdUser, ['position', 'position_name', 'entryposition', 'position_th', 'job_title', 'role_label', 'rank']) ||
                        extractDeepKey(jwtData, ['position', 'entryposition', 'role_label']);
    const mophIdPosition = (rawPosFound || '').trim();

    // Match HOSxP DB by CID, ProviderID (doctorcode), or loginname with 1s timeout
    let dbUser: any = null;
    try {
      const searchTerms = Array.from(new Set([cid, providerId, directProviderId, directCid])).filter((t) => t && t !== 'HEALTHID-USER');

      if (searchTerms.length > 0) {
        const fetchDbUser = async () => {
          const pool = getHosxpPool();
          // 1. Try opduser_Ncd
          try {
            const [ncdRows]: any = await pool.execute(
              `SELECT loginname, 
                      CONVERT(name USING utf8mb4) AS name, 
                      CONVERT(entryposition USING utf8mb4) AS entryposition, 
                      CONVERT(department USING utf8mb4) AS department, 
                      doctorcode, cid
               FROM opduser_Ncd 
               WHERE (cid IN (${searchTerms.map(() => '?').join(',')}) OR doctorcode IN (${searchTerms.map(() => '?').join(',')}) OR loginname IN (${searchTerms.map(() => '?').join(',')})) LIMIT 1`,
              [...searchTerms, ...searchTerms, ...searchTerms]
            );
            if (ncdRows && ncdRows.length > 0) return ncdRows[0];
          } catch {
            // Fallback to opduser
          }

          // 2. Try opduser
          try {
            const [opdRows]: any = await pool.execute(
              `SELECT loginname, 
                      CONVERT(name USING utf8mb4) AS name, 
                      CONVERT(entryposition USING utf8mb4) AS entryposition, 
                      CONVERT(department USING utf8mb4) AS department, 
                      doctorcode, cid
               FROM opduser 
               WHERE (cid IN (${searchTerms.map(() => '?').join(',')}) OR doctorcode IN (${searchTerms.map(() => '?').join(',')}) OR loginname IN (${searchTerms.map(() => '?').join(',')})) LIMIT 1`,
              [...searchTerms, ...searchTerms, ...searchTerms]
            );
            if (opdRows && opdRows.length > 0) return opdRows[0];
          } catch {
            // Fallback to doctor
          }

          // 3. Fallback to doctor table
          try {
            const [docRows]: any = await pool.execute(
              `SELECT code AS doctorcode, 
                      CONVERT(name USING utf8mb4) AS name, 
                      CONVERT(position_name USING utf8mb4) AS entryposition, 
                      cid
               FROM doctor 
               WHERE (code IN (${searchTerms.map(() => '?').join(',')}) OR licenseno IN (${searchTerms.map(() => '?').join(',')}) OR cid IN (${searchTerms.map(() => '?').join(',')})) LIMIT 1`,
              [...searchTerms, ...searchTerms, ...searchTerms]
            );
            if (docRows && docRows.length > 0) return docRows[0];
          } catch {
            // doctor fallback
          }
          return null;
        };

        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 1000));
        dbUser = await Promise.race([fetchDbUser(), timeoutPromise]);
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
