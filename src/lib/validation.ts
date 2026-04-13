import { z } from 'zod';

export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  nik: z.string().length(16, 'NIK must be exactly 16 digits'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  registrationType: z.enum(['mahasiswa', 'entrepreneur', 'umum']),
  institutionName: z.string().optional(),
  institutionAddress: z.string().optional(),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  proposalPath: z.string().optional(),
  videoBlob: z.string().optional(),
  terms: z.literal('on', { errorMap: () => ({ message: 'You must accept the terms' }) })
});

export const fileValidationSchema = z.object({
  mimeType: z.string(),
  magicBytes: z.string()
});

export const MAGIC_BYTES: Record<string, string[]> = {
  'application/pdf': ['25504446'],
  'video/webm': ['1a45dfa3'],
  'video/mp4': ['66747970']
};

export function validateMagicBytes(buffer: ArrayBuffer, expectedMimeType: string): boolean {
  const bytes = new Uint8Array(buffer);
  const header = Array.from(bytes.slice(0, 4))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const expected = MAGIC_BYTES[expectedMimeType];
  if (!expected) return false;
  
  return expected.some(magic => header.startsWith(magic));
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

export const GOOGLE_CLIENT_ID = import.meta.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = import.meta.env.GOOGLE_CLIENT_SECRET || '';
export const APP_URL = import.meta.env.APP_URL || 'http://localhost:4321';

export function getGoogleAuthUrl(): string {
  const redirectUri = `${APP_URL}/api/auth/callback`;
  const scope = encodeURIComponent('email profile');
  const responseType = 'code';
  const accessType = 'offline';
  const prompt = 'consent';
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=${accessType}&prompt=${prompt}`;
}

export function getGoogleTokenUrl(): string {
  return 'https://oauth2.googleapis.com/token';
}

export function getGoogleUserInfoUrl(): string {
  return 'https://www.googleapis.com/oauth2/v2/userinfo';
}