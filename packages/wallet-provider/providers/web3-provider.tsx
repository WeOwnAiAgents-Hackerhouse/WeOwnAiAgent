'use client';

import React, { useEffect } from 'react';
import { WagmiProvider, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Log available providers
if (typeof window !== 'undefined') {
  console.log('Available wallet providers:', {
    ethereum: !!window.ethereum,
    web3: !!window.web3,
    injectedProviders: window.ethereum?.providers || []
  });
}

// Wagmi config
const config = createConfig(
  getDefaultConfig({
    appName: 'WeOwn Agent Box',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    chains: [mainnet, sepolia],
    ssr: true,
  }),
);

export interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  // Log when provider mounts
  useEffect(() => {
    console.log('Web3Provider mounted');
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            '--ck-connectbutton-background': '#3b82f6',
            '--ck-connectbutton-hover-background': '#2563eb',
            '--ck-connectbutton-color': 'white',
            '--ck-font-family': 'sans-serif',
          }}
          options={{
            hideBalance: true,
            hideNoWalletCTA: false,
            walletConnectCTA: "modal",
            overlayBlur: 0,
            language: 'en-US',
            embedGoogleFonts: false,
            walletConnectName: "WalletConnect",
            enforceSupportedChains: false,
            initialChainId: 1
          }}
          debugMode
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};