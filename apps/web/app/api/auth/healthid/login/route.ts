import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const baseUrl = process.env.HEALTHID_BASE_URL || 'https://moph.id.th';
  const clientId = process.env.HEALTHID_CLIENT_ID || '01939ac3-9394-7b9b-b3a4-0d53f13d3f32';
  
  // Use absolute redirect URI from env or construct from incoming request header
  let redirectUri = process.env.HEALTHID_REDIRECT_URI || 'https://khhncd.khostime.site/auth/healthid/callback';

  // State parameter for CSRF security
  const state = Math.random().toString(36).substring(2, 15);

  const authUrl = `${baseUrl.replace(/\/$/, '')}/oauth/redirect?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;

  return NextResponse.redirect(authUrl);
}
