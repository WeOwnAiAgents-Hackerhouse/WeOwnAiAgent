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
    let verifyResult;
    try {
      verifyResult = await siweMessage.verify({
        signature,
        nonce,
      });
    } catch (verifyError) {
      console.error('SIWE verification error:', verifyError);
      return NextResponse.json({ error: 'Error verifying signature' }, { status: 422 });
    }
    
    if (!verifyResult.success) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 422 });
    }
    
    // Get the wallet address from the verified message
    const address = verifyResult.data.address;
    
    // Create response with success message
    const response = NextResponse.json({ 
      success: true, 
      address,
      redirectUrl: '/dashboard', // Redirect to dashboard
      message: 'Authentication successful! No database registration required.'
    });
    
    // Remove the nonce cookie
    response.cookies.set('siwe-nonce', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    
    // Set the wallet-auth cookie with the address as the value
    response.cookies.set('wallet-auth', address, {
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