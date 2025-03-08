import { NextResponse } from 'next/server';
import { getWalletSession, auth } from '@myira/auth';


export async function GET() {
  // First check for Next-Auth session
  const session = await auth();
  
  if (session?.user) {
    return NextResponse.json({ 
      user: session.user,
      provider: 'next-auth'
    });
  }
  
  // If no Next-Auth session, check for wallet session
  const walletSession = await getWalletSession();
  
  if (walletSession?.user) {
    return NextResponse.json({
      user: walletSession.user,
      provider: 'wallet'
    });
  }
  
  // No authenticated session found
  return NextResponse.json({ authenticated: false }, { status: 401 });
} 