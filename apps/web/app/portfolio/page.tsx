'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@myira/system-design';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import components that depend on browser APIs
const PortfolioOverview = dynamic(() => import('../../components/portfolio/portfolio-overview'), { 
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
});

const TokenList = dynamic(() => import('../../components/portfolio/token-list'), { 
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
});

const NFTGallery = dynamic(() => import('../../components/portfolio/nft-gallery'), { 
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
});

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render wallet-dependent UI until mounted to avoid hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Connect Your Wallet</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          Please connect your wallet to view your portfolio
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Portfolio</h1>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        {/* Portfolio Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'tokens' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('tokens')}
          >
            Tokens
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'nfts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('nfts')}
          >
            NFTs
          </button>
        </div>

        {/* Portfolio Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && <PortfolioOverview address={address || ''} />}
          {activeTab === 'tokens' && <TokenList address={address || ''} />}
          {activeTab === 'nfts' && <NFTGallery address={address || ''} />}
        </div>
      </div>
    </div>
  );
} 