'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@myira/ui';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
  userAddress: string;
}

export function ChatInterface({ onBack, userAddress }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: `Hello! I'm your MyIRA assistant. I'll help you create your wallet portfolio across different chains. What would you like to do first?`,
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            {message.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg inline-block max-w-[80%]">
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg inline-block max-w-[80%]">
                  <ReactMarkdown className="prose">
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..." 
          className="flex-1 p-2 border border-gray-300 rounded"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </form>
      
      <div className="mt-4 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back to Home
        </Button>
        <div className="text-sm text-gray-500">
          Connected as: {userAddress}
        </div>
      </div>
    </div>
  );
} 