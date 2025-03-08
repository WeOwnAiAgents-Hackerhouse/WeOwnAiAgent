import { NextResponse } from 'next/server';
import { sessionAdapter } from '@myira/auth';

/**
 * GET /api/protected
 * A protected route that requires authentication
 */
export async function GET() {
  try {
    // Check if the user is authenticated
    const isAuthenticated = await sessionAdapter.isAuthenticated();
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the user information
    const user = await sessionAdapter.getUser();
    
    // Get the authentication provider
    const provider = await sessionAdapter.getProvider();
    
    // Return protected data
    return NextResponse.json({
      message: 'This is protected data',
      user,
      provider,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in protected route:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 