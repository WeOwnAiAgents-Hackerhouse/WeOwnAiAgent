'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Define a fallback component to use while the dynamic imports are loading
function LoadingFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <div className="sr-only">Loading...</div>
      {/* Still render children to avoid hydration issues */}
      <div className="hidden">{children}</div>
    </div>
  );
}

// Dynamically import the providers to avoid SSR issues
const PortfolioProvider = dynamic(
  () => import('@myira/portfolio-service').then(mod => mod.PortfolioProvider),
  { 
    ssr: false,
    loading: ({ children }) => <LoadingFallback>{children}</LoadingFallback>
  }
);

const Web3Provider = dynamic(
  () => import('@myira/providers').then(mod => mod.Web3Provider),
  { 
    ssr: false,
    loading: ({ children }) => <LoadingFallback>{children}</LoadingFallback>
  }
);

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // API keys would typically come from environment variables
  const apiKeys = {
    coinGecko: process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
    debank: process.env.NEXT_PUBLIC_DEBANK_API_KEY,
    zapper: process.env.NEXT_PUBLIC_ZAPPER_API_KEY,
    covalent: process.env.NEXT_PUBLIC_COVALENT_API_KEY,
  };

  return (
    <PortfolioProvider apiKeys={apiKeys}>
      <Web3Provider>
        {children}
      </Web3Provider>
    </PortfolioProvider>
  );
} 