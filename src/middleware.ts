import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ cookies, locals, redirect, url }, next) => {
  // Normalize path (remove trailing slash except for root '/')
  const currentPath = url.pathname.replace(/\/$/, '') || '/';

  // 1. ALLOW PUBLIC PAGES
  if (currentPath === '/' || currentPath === '/admin/login' || currentPath.startsWith('/api/auth')) {
    return next();
  }

  // 2. PROTECT ADMIN SECTION
  if (currentPath.startsWith('/admin')) {
    const adminSessionCookie = cookies.get('admin_session');
    
    if (adminSessionCookie) {
      try {
        const sessionData = JSON.parse(adminSessionCookie.value);
        const { userId, sessionId, role } = sessionData;

        if (role === 'admin' && sessionId && userId) {
          const { db } = await import('./db');
          const { sessions } = await import('./db/schema');
          const { eq, and, gt } = await import('drizzle-orm');

          const validSession = await db.query.sessions.findFirst({
            where: and(
              eq(sessions.id, sessionId),
              eq(sessions.userId, userId),
              gt(sessions.expiresAt, new Date())
            )
          });

          if (validSession) {
            locals.user = {
              id: userId,
              email: sessionData.email,
              name: sessionData.name,
              role: role
            };
            return next();
          }
        }
      } catch (err) {
        console.error('Admin session validation error:', err);
      }
      cookies.delete('admin_session', { path: '/' });
    }
    return redirect('/admin/login');
  }

  // 3. PROTECT REGISTER SECTION (STUDENTS)
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

  if (currentPath.startsWith('/register')) {
    if (!locals.user) {
      return redirect('/?error=unauthorized');
    }
  }

  return next();
});