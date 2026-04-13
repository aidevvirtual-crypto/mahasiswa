import type { APIRoute } from 'astro';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL, getGoogleTokenUrl, getGoogleUserInfoUrl } from '../../../lib/validation';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  
  if (error) {
    console.error('OAuth error:', error);
    return redirect('/?error=' + encodeURIComponent(error));
  }
  
  if (!code) {
    return redirect('/?error=no_code');
  }
  
  try {
    const redirectUri = `${APP_URL}/api/auth/callback`;
    
    const tokenResponse = await fetch(getGoogleTokenUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get token');
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    const userResponse = await fetch(getGoogleUserInfoUrl(), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }
    
    const userInfo = await userResponse.json();
    
    let user = await db.query.users.findFirst({
      where: eq(users.email, userInfo.email)
    });
    
    if (!user) {
      const userId = crypto.randomUUID();
      await db.insert(users).values({
        id: userId,
        email: userInfo.email,
        name: userInfo.name || 'User',
        picture: userInfo.picture || null,
        role: 'user'
      });
      user = await db.query.users.findFirst({
        where: eq(users.email, userInfo.email)
      });
    }
    
    const sessionId = crypto.randomUUID();
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    cookies.set('session', JSON.stringify({
      userId: user!.id,
      email: user!.email,
      name: user!.name,
      sessionId
    }), {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: sessionExpiry
    });
    
    return redirect('/register');
    
  } catch (err) {
    console.error('OAuth callback error:', err);
    return redirect('/?error=auth_failed');
  }
};