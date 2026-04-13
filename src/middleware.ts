import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ cookies, locals, redirect, url }, next) => {
  const path = url.pathname;

  // 1. Public Paths & API (Always allowed)
  if (path === '/' || path === '/admin/login' || path.startsWith('/api/')) {
    return next();
  }

  // 2. Admin Protection
  if (path.startsWith('/admin')) {
    const adminSession = cookies.get('admin_session');
    if (adminSession) {
      try {
        const data = JSON.parse(adminSession.value);
        if (data.role === 'admin' && data.sessionId) {
          locals.user = data;
          return next();
        }
      } catch (e) {}
    }
    return redirect('/admin/login');
  }

  // 3. Student Registration Protection
  if (path.startsWith('/register')) {
    const userSession = cookies.get('session');
    if (userSession) {
      try {
        const data = JSON.parse(userSession.value);
        if (data.userId && data.sessionId) {
          locals.user = data;
          return next();
        }
      } catch (e) {}
    }
    return redirect('/?error=unauthorized');
  }

  return next();
});