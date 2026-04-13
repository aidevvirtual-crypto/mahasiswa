import type { APIRoute } from 'astro';
import { db } from '../../db';
import { sessions } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const sessionCookie = cookies.get('admin_session');

  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      if (sessionData.sessionId) {
        await db.delete(sessions).where(eq(sessions.id, sessionData.sessionId));
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  cookies.delete('admin_session', { path: '/' });
  return redirect('/admin/login');
};