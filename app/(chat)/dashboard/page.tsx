'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/icons';
import { generateUUID } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  
  // Check if user is authenticated with wallet
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get wallet address from cookie
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('wallet-auth='))
          ?.split('=')[1];
        
        if (!cookieValue) {
          // Not authenticated, redirect to login
          router.push('/login');
          return;
        }
        
        setWalletAddress(cookieValue);
        
        // Fetch chats (if you have an API for this)
        try {
          const res = await fetch('/api/chats');
          if (res.ok) {
            const data = await res.json();
            setChats(data.chats || []);
          }
        } catch (error) {
          console.error('Failed to fetch chats:', error);
          // Continue even if chat fetching fails
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Generate a new chat ID
  const newChatId = generateUUID();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          {walletAddress && (
            <div className="text-sm text-muted-foreground">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          )}
          <Link href={`/chat/${newChatId}`}>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              New Chat
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-xl font-medium">Welcome to WeOwn Agent Box</h2>
        <p className="mt-2 text-muted-foreground">
          Start a new conversation to begin chatting with AI
        </p>
        <Link href={`/chat/${newChatId}`} className="mt-4">
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Start a new chat
          </Button>
        </Link>
      </div>
      
      {chats.length > 0 && (
        <>
          <h2 className="mt-8 mb-4 text-xl font-semibold">Your Recent Chats</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chats.map((chat) => (
              <Link 
                key={chat.id} 
                href={`/chat/${chat.id}`}
                className="group flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <h2 className="line-clamp-1 font-medium group-hover:underline">
                  {chat.title || "Untitled Chat"}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {new Date(chat.createdAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 