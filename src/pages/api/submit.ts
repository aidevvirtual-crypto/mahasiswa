import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '../../db';
import { registrations, users, portfolioAssets } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { registrationSchema, sanitizeFilename } from '../../lib/validation';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const body = await request.json();
    
    const result = registrationSchema.safeParse(body);
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return new Response(JSON.stringify({ error: 'Validation failed', details: errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = result.data;
    
    let user = await db.query.users.findFirst({
      where: eq(users.email, data.email)
    });
    
    if (!user) {
      const userId = crypto.randomUUID();
      await db.insert(users).values({
        id: userId,
        email: data.email,
        name: data.fullName,
        role: 'user'
      });
      user = await db.query.users.findFirst({
        where: eq(users.email, data.email)
      });
    }
    
    const existingReg = await db.query.registrations.findFirst({
      where: eq(registrations.userId, user!.id)
    });
    
    if (existingReg) {
      return new Response(JSON.stringify({ error: 'Registration already submitted' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const registrationId = crypto.randomUUID();
    
    await db.insert(registrations).values({
      id: registrationId,
      userId: user!.id,
      nik: data.nik,
      dateOfBirth: data.dob,
      status: 'pending',
      registrationType: data.registrationType,
      institutionName: data.institutionName || null,
      institutionAddress: data.institutionAddress || null,
      businessName: data.businessName || null,
      businessAddress: data.businessAddress || null,
      proposalPath: data.proposalPath || null,
      step: 4,
      submittedAt: new Date()
    });
    
    if (data.videoBlob) {
      await db.insert(portfolioAssets).values({
        id: crypto.randomUUID(),
        registrationId: registrationId,
        userId: user!.id,
        type: 'video',
        fileName: `video_${registrationId}.webm`,
        filePath: `/uploads/${registrationId}/video.webm`,
        mimeType: 'video/webm',
        fileSize: 0,
        uploadStatus: 'completed'
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      registrationId: registrationId,
      message: 'Registration submitted successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};