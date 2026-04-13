import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { users, sessions } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simple admin check - in production, use proper password hashing
    // For now, check against environment variables or database
    const adminEmail = 'admin@mahasiswa.com';
    const adminPassword = 'admin123';

    if (email !== adminEmail || password !== adminPassword) {
      // Check database for admin users
      const user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (!user || user.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Create session
      const sessionId = crypto.randomUUID();
      const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        token: sessionId,
        expiresAt: sessionExpiry
      });

      cookies.set('admin_session', JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        sessionId
      }), {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: sessionExpiry
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default admin login
    let admin = await db.query.users.findFirst({
      where: eq(users.email, adminEmail)
    });

    if (!admin) {
      const adminId = crypto.randomUUID();
      await db.insert(users).values({
        id: adminId,
        email: adminEmail,
        name: 'Administrator',
        role: 'admin'
      });
      admin = await db.query.users.findFirst({
        where: eq(users.email, adminEmail)
      });
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      id: sessionId,
      userId: admin!.id,
      token: sessionId,
      expiresAt: sessionExpiry
    });

    cookies.set('admin_session', JSON.stringify({
      userId: admin!.id,
      email: admin!.email,
      name: admin!.name,
      role: admin!.role,
      sessionId
    }), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: sessionExpiry
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};