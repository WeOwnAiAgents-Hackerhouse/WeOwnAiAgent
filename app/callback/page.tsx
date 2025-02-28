'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import oktaAuth from '@/lib/oktaClient';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        //const tokens = await oktaAuth.handleAuthentication();
        // Store tokens or handle session
        router.push('/'); // Redirect to home or desired page
      } catch (error) {
        console.error('Error handling authentication:', error);
      }
    };

    handleAuthentication();
  }, [router]);

  return <div>Loading...</div>;
} 