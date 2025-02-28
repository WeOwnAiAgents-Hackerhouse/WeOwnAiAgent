import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();
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
    
    // Authentication successful
    const address = verifyResult.data?.address;
    
    // Create a response with the address
    const response = NextResponse.json({ 
      success: true,
      address 
    });
    
    // Set a cookie to maintain the session
    response.cookies.set('siwe-address', address as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('SIWE verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}