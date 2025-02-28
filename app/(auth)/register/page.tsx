'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { FaGithub, FaWallet } from 'react-icons/fa';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store email in localStorage for later use
      localStorage.setItem('registration-email', email);
      toast.success('Email saved! Please connect your wallet to continue.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save email');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/chat' });
  };
  
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
          signature,
          email: localStorage.getItem('registration-email') || `${address.slice(0, 6)}@wallet.user`,
        }),
      });
      
      if (!verifyRes.ok) {
        const error = await verifyRes.json();
        throw new Error(error.error || 'Verification failed');
      }
      
      toast.success('Wallet connected and verified!');
      router.push('/chat');
    } catch (error) {
      console.error('Wallet sign-in error:', error);
      toast.error(error.message || 'Failed to sign in with wallet');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-800/50 border-zinc-700 shadow-xl">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-zinc-400">Sign up with your email and wallet</p>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-700/50 border-zinc-600"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Saving...' : 'Save Email'}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-600"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-zinc-800 px-2 text-zinc-400">Connect Wallet</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <ConnectKitButton.Custom>
                {({ isConnected, show }) => {
                  return (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={show}
                      className="w-full border-zinc-600 text-white hover:bg-zinc-700"
                    >
                      <FaWallet className="mr-2 h-4 w-4" />
                      {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                    </Button>
                  );
                }}
              </ConnectKitButton.Custom>
              
              {isConnected && (
                <Button
                  type="button"
                  onClick={handleWalletSignIn}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Signing...' : 'Sign Message & Register'}
                </Button>
              )}
            </div>
            
            <Separator className="bg-zinc-600" />
            
            <div className="text-center text-sm">
              <p className="text-zinc-400 mb-4">Or sign up with</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleGitHubSignIn}
                className="w-full border-zinc-600 text-white hover:bg-zinc-700"
              >
                <FaGithub className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
            
            <div className="text-center text-sm text-zinc-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
