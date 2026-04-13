import type { APIRoute } from 'astro';
import { APP_URL, getGoogleAuthUrl, GOOGLE_CLIENT_ID } from '../../../lib/validation';
import { db } from '../../../db';
import { sessions } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const action = url.searchParams.get('action');
  
  if (action === 'google') {
    const redirectUri = `${APP_URL}/api/auth/callback`;
    const scope = encodeURIComponent('email profile');
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    return redirect(authUrl);
  }
  
  if (action === 'logout') {
    const sessionCookie = cookies.get('session');
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        if (sessionData.sessionId) {
          await db.delete(sessions).where(eq(sessions.id, sessionData.sessionId));
        }
      } catch (err) {
        console.error('Logout session delete error:', err);
      }
    }
    cookies.delete('session', { path: '/' });
    return redirect('/');
  }
  
  return redirect('/');
};

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const action = formData.get('action');
  
  if (action === 'logout') {
    const sessionCookie = cookies.get('session');
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        if (sessionData.sessionId) {
          await db.delete(sessions).where(eq(sessions.id, sessionData.sessionId));
        }
      } catch (err) {
        console.error('Logout session delete error:', err);
      }
    }
    cookies.delete('session', { path: '/' });
    return redirect('/');
  }
  
  return new Response(JSON.stringify({ error: 'Invalid action' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
};