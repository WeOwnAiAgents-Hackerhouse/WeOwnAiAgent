import React from 'react';
import { Web3Provider } from '@weown/wallet-provider';
import { OktoProvider } from '@weown/okto-integration';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <OktoProvider>
            {children}
          </OktoProvider>
        </Web3Provider>
      </body>
    </html>
  );
} 
