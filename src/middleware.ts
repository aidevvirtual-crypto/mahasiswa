import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ cookies, locals, redirect, url }, next) => {
  const sessionCookie = cookies.get('session');

  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      const { userId, sessionId } = sessionData;

      if (sessionId && userId) {
        const { db } = await import('./db');
        const { sessions, users } = await import('./db/schema');
        const { eq, and, gt } = await import('drizzle-orm');

        const validSession = await db.query.sessions.findFirst({
          where: and(
            eq(sessions.id, sessionId),
            eq(sessions.userId, userId),
            gt(sessions.expiresAt, new Date())
          )
        });

        if (validSession) {
          const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
          });

          if (user) {
            locals.user = {
              id: user.id,
              email: user.email,
              name: user.name,
              picture: user.picture,
              role: user.role
            };
          }
        } else {
          cookies.delete('session', { path: '/' });
        }
      }
    } catch (err) {
      console.error('Session validation error:', err);
      cookies.delete('session', { path: '/' });
    }
  }

  const currentPath = url.pathname;

  if (currentPath.startsWith('/register')) {
    if (!locals.user) {
      return redirect('/?error=unauthorized');
    }
  }

  if (currentPath.startsWith('/admin')) {
    if (!locals.user || locals.user.role !== 'admin') {
      return redirect('/?error=unauthorized');
    }
  }

  return next();
});