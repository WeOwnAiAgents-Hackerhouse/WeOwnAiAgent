'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Import the Okta client if needed, or remove the comment
// import oktaAuth from '@/lib/oktaClient';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        // Add your authentication handling logic here
        router.push('/dashboard');
      } catch (error) {
        console.error('Error handling authentication:', error);
      }
    };

    handleAuthentication();
  }, [router]);

  return <div>Loading...</div>;
}