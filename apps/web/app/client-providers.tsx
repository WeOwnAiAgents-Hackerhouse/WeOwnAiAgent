'use client';

import React from 'react';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { PortfolioProvider } from '@myira/portfolio-service';
import { Web3Provider } from '@myira/providers';

export const metadata: Metadata = {
  title: 'MyIRA - Your Intelligent Retirement Assistant',
  description: 'Manage your crypto portfolio across multiple chains for long-term growth and retirement planning.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}



interface ClientProvidersProps {
  children: React.ReactNode;
  apiKeys: {
    coinGecko?: string;
    debank?: string;
    zapper?: string;
    covalent?: string;
  };
}

export function ClientProviders({ children, apiKeys }: ClientProvidersProps) {
  return (
    <PortfolioProvider apiKeys={apiKeys}>
      <Web3Provider>
        {children}
      </Web3Provider>
    </PortfolioProvider>
  );
} 
