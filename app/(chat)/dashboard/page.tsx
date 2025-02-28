import { cookies } from 'next/headers';
import Link from 'next/link';
import { auth } from '@/app/(auth)/auth';
import { getChatsByUserId } from '@/lib/db/queries';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/icons';
import { generateUUID } from '@/lib/utils';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-2 p-4 text-center">
        <h1 className="text-2xl font-semibold">Welcome to the AI Chat</h1>
        <p className="text-muted-foreground">Please sign in to start chatting</p>
      </div>
    );
  }
  
  // Get user's chats
  const chats = await getChatsByUserId({ id: session.user.id as string });
  
  // Generate a new chat ID for the "New Chat" button
  const newChatId = generateUUID();
  
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href={`/chat/${newChatId}`}>
          <Button className="flex items-center gap-2">
            <PlusIcon  />
            New Chat
          </Button>
        </Link>
      </div>
      
      {chats.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-medium">No chats yet</h2>
          <p className="mt-2 text-muted-foreground">
            Start a new conversation to begin chatting with AI
          </p>
          <Link href={`/chat/${newChatId}`} className="mt-4">
            <Button className="flex items-center gap-2">
              <PlusIcon />
              Start a new chat
            </Button>
          </Link>
        </div>
      ) : (
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
          
          <Link 
            href={`/chat/${newChatId}`}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center transition-colors hover:bg-muted/50"
          >
            <PlusIcon />
            <h2 className="mt-2 font-medium">New Chat</h2>
          </Link>
        </div>
      )}
    </div>
  );
} 