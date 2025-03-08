import { NextRequest, NextResponse } from 'next/server';
import { verifyWalletSignature, logoutWallet } from '@myira/auth';

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json();
    
    if (!message || !signature) {
      return NextResponse.json(
        { error: 'Missing message or signature' },
        { status: 400 }
      );
    }
    
    const result = await verifyWalletSignature(message, signature);
    
    if (result.status === 'error') {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Wallet authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const result = await logoutWallet();
  return NextResponse.json(result);
} 