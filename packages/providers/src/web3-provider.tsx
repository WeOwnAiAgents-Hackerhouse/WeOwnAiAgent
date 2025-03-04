'use client';

import React, { ReactNode } from 'react';
import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet, optimism, base } from 'wagmi/chains';
import { http } from 'viem';

// Create wagmi config
const config = createConfig({
  chains: [mainnet, optimism, base],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});

export interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
} 