import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SELLER_SESSION_COOKIE = 'seller_session';

function getSessionSecret(): string {
  return process.env.SELLER_SESSION_SECRET ?? process.env.AUTH_SECRET ?? 'dev-insecure-session-secret';
}

function sign(value: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

export function createSellerSessionValue(sellerId: string): string {
  const payload = JSON.stringify({ sellerId, issuedAt: Date.now() });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function readSellerIdFromSession(value: string | undefined): string | null {
  if (!value) return null;

  const [encodedPayload, signature] = value.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const decoded = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const parsed = JSON.parse(decoded) as { sellerId?: unknown };
    return typeof parsed.sellerId === 'string' ? parsed.sellerId : null;
  } catch {
    return null;
  }
}

export async function getAuthenticatedSellerId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SELLER_SESSION_COOKIE)?.value;
  return readSellerIdFromSession(cookieValue);
}

export async function setAuthenticatedSellerSession(sellerId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SELLER_SESSION_COOKIE, createSellerSessionValue(sellerId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAuthenticatedSellerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SELLER_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
