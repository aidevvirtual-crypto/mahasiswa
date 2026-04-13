import type { APIRoute } from 'astro';
import { getGoogleAuthUrl, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL, getGoogleTokenUrl, getGoogleUserInfoUrl } from '../../../lib/validation';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const action = url.searchParams.get('action');
  
  if (action === 'google') {
    const redirectUri = `${APP_URL}/api/auth/callback`;
    const scope = encodeURIComponent('email profile');
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    return redirect(authUrl);
  }
  
  if (action === 'logout') {
    cookies.delete('session', { path: '/' });
    return redirect('/');
  }
  
  return redirect('/');
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const action = formData.get('action');
  
  if (action === 'logout') {
    cookies.delete('session', { path: '/' });
    return redirect('/');
  }
  
  return new Response(JSON.stringify({ error: 'Invalid action' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
};