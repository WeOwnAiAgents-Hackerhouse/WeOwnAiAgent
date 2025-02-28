'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { login, type LoginActionState } from '../actions';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: 'idle' },
  );

  useEffect(() => {
    if (state.status === 'success') {
      setIsSuccessful(true);
      toast.success('Signed in successfully!');
      
      // Redirect to chat page after successful login
      setTimeout(() => {
        router.push('/chat');
      }, 1000);
    }
  }, [state, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // For development: Accept any credentials
    toast.success('Signed in successfully!');
    setTimeout(() => {
      router.push('/chat');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0b14] text-white">
      <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto px-4">
        <Card className="w-full bg-zinc-900 border-zinc-700">
          <CardContent className="flex flex-col md:flex-row p-0">
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                <p className="text-gray-400 mt-1">Login to your WeOwn Agent Box account</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Login'}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-2 text-gray-400">Or continue with</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white"
                    onClick={() => router.push('/chat')}
                  >
                    <span className="mr-2">G</span>
                    Google
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white"
                    onClick={() => router.push('/chat')}
                  >
                    <span className="mr-2">ℙ</span>
                    Privy
                  </Button>
                </div>
                
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-blue-400 hover:underline">
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
            
            <div className="relative hidden md:block md:w-1/2">
              <img
                src="/images/login-illustration.jpg" 
                alt="Login illustration"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <Link href="/terms">Terms of Service</Link>{" "}
          and <Link href="/privacy">Privacy Policy</Link>.
        </div>
      </div>
      
      <footer className="w-full py-8 bg-zinc-900/50 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2023 WeOwn Agent Box. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white">Terms</Link>
            <Link href="#" className="text-gray-400 hover:text-white">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
