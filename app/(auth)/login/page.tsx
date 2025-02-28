'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FaWallet } from 'react-icons/fa';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const router = useRouter();
  const { address, isConnected, connector } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletDetected, setWalletDetected] = useState(false);
  
  // Check if wallet is detected
  useEffect(() => {
    // Check if window.ethereum exists (MetaMask, Rabby, etc.)
    const hasInjectedProvider = typeof window !== 'undefined' && window.ethereum !== undefined;
    
    // Log wallet detection status
    console.log('Wallet detection:', { 
      hasInjectedProvider, 
      isConnected, 
      address,
      connector: connector?.name
    });
    
    setWalletDetected(hasInjectedProvider);
  }, [isConnected, address, connector]);
  
  const handleWalletSignIn = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get nonce from server
      const nonceRes = await fetch('/api/auth/nonce');
      const { nonce } = await nonceRes.json();
      
      // Create a proper SIWE message
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'By signing this message, you agree to the Terms and Conditions of WeOwn Agent Box. This is a hackathon project.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,  // Default to Ethereum mainnet, adjust as needed
        nonce: nonce
      });
      
      const message = siweMessage.prepareMessage();
      
      // Sign message
      const signature = await signMessageAsync({ message });
      
      // Verify signature
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          signature 
        }),
      });
      
      if (!verifyRes.ok) {
        const error = await verifyRes.json();
        throw new Error(error.error || 'Verification failed');
      }
      
      const data = await verifyRes.json();
      
      toast.success('Wallet authenticated successfully!');
      
      // Redirect to dashboard after successful authentication
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to authenticate with wallet';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0b14] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to WeOwn Agent Box</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-400 underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-700">
              <span className="relative z-10 bg-[#0a0b14] px-2 text-gray-400">
                Connect with Wallet
              </span>
            </div>
            
            {!walletDetected && (
              <div className="text-center text-amber-400 text-sm">
                No wallet extension detected. Please install MetaMask, Rabby, or another Ethereum wallet.
              </div>
            )}
            
            <div className="grid gap-4">
              <ConnectKitButton.Custom>
                {({ isConnected, show }) => {
                  return (
                    <Button 
                      variant="outline" 
                      onClick={show}
                      className="w-full border-zinc-700 text-white hover:bg-zinc-800"
                    >
                      <FaWallet className="mr-2 h-4 w-4" />
                      {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                    </Button>
                  );
                }}
              </ConnectKitButton.Custom>
              
              {isConnected && (
                <Button
                  onClick={handleWalletSignIn}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Signing...' : 'Sign Message & Continue'}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-balance text-center text-xs text-gray-500">
          By clicking continue, you agree to our <Link href="#" className="text-blue-400 underline underline-offset-4">Terms of Service</Link>{" "}
          and <Link href="#" className="text-blue-400 underline underline-offset-4">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
