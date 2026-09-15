import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { maskIC } from './utils';

export { maskIC };

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'jom-kenyang-madani-dapur-siswa-secret-key-2026'
);

export interface JWTPayload {
  userId: string;
  name: string;
  icNumber: string;
  studentId: string;
  role: 'STUDENT' | 'ADMIN';
  program?: string;
  semester?: number;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('jk_session')?.value;
  if (!token) return null;
  return await verifyToken(token);
}
