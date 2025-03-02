import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import { auth, signIn } from '@/app/(auth)/auth';
import { createUser, getUser } from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { message, signature, email } = await req.json();
    const nonce = req.cookies.get('siwe-nonce')?.value;
    
    if (!nonce) {
      return NextResponse.json({ error: 'Invalid nonce' }, { status: 422 });
    }
    
    // Verify the signature
    const siweMessage = new SiweMessage(message);
    let verifyResult: { success: boolean; data?: SiweMessage; error?: any } = { success: false };
    
    try {
      verifyResult = await siweMessage.verify({
        signature,
        nonce,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to verify signature' },
        { status: 422 }
      );
    }
    
    if (!verifyResult.success) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 422 }
      );
    }
    
    const address = siweMessage.address;
    
    // Check if user exists with this wallet address
    const [existingUser] = await getUser(address);
    
    if (!existingUser) {
      // Create new user if not exists
      if (email) {
        // If email is provided (from registration flow)
        await createUser(address, '', email);
      } else {
        // If no email (just wallet login)
        await createUser(address, '');
      }
    }
    
    // Sign in the user with NextAuth
    await signIn('credentials', {
      email: address, // Using wallet address as the identifier
      password: '', // Password not needed for wallet auth
      redirect: false,
    });
    
    // Create a response with the address
    const response = NextResponse.json({ 
      success: true,
      address 
    });
    
    // Set a cookie to maintain the session
    response.cookies.set('wallet-auth', address, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Wallet authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 