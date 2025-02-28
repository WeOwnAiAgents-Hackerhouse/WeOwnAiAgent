import { NextResponse } from 'next/server';
import { generateNonce } from 'siwe';

export async function GET() {
  const nonce = generateNonce();
  
  // Store nonce in a cookie
  const response = NextResponse.json({ nonce });
  response.cookies.set('siwe-nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  });
  
  return response;
} 