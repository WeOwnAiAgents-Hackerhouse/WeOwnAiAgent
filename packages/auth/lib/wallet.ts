'use server';

import { SiweMessage } from 'siwe';
import { cookies } from 'next/headers';
import { getUser, createUser } from '@myira/database';

export async function verifyWalletSignature(
  message: string,
  signature: string
) {
  try {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });
    
    if (!fields.success) {
      return { status: 'error', message: 'Invalid signature' };
    }
    
    // The address is verified, now we can check if the user exists
    const address = fields.data.address;
    
    // Check if user exists with this wallet address
    let user = await getUser({ walletAddress: address });
    
    if (!user) {
      // Create a new user with the wallet address
      user = await createUser({
        walletAddress: address,
        email: `${address.toLowerCase()}@wallet.user`, // Create a placeholder email
      });
    }
    
    // Set a cookie to maintain the session
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days from now
    
    cookies().set('wallet_auth', address, {
      expires,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return { 
      status: 'success', 
      user: {
        id: user.id,
        address
      }
    };
  } catch (error) {
    console.error('Wallet verification error:', error);
    return { status: 'error', message: 'Failed to verify wallet signature' };
  }
}

export async function getWalletSession() {
  const walletAddress = cookies().get('wallet_auth')?.value;
  
  if (!walletAddress) {
    return null;
  }
  
  const user = await getUser({ walletAddress });
  
  if (!user) {
    // Clear the invalid cookie
    cookies().delete('wallet_auth');
    return null;
  }
  
  return {
    user: {
      id: user.id,
      address: walletAddress
    }
  };
}

export async function logoutWallet() {
  cookies().delete('wallet_auth');
  return { status: 'success' };
} 