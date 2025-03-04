'use client';

import React from 'react';
import { ConnectKitButton } from 'connectkit';

export const ConnectWalletButton: React.FC = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName }) => {
        return (
          <button
            onClick={show}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isConnected ? (
              <span>
                {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </span>
            ) : isConnecting ? (
              <span>Connecting...</span>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}; 