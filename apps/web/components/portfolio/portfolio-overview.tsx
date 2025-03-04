'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolio } from '@myira/portfolio-service';
import type { SupportedChain } from '@myira/portfolio-service';

interface PortfolioOverviewProps {
  address: string;
}

export default function PortfolioOverview({ address }: PortfolioOverviewProps) {
  const [selectedChains, setSelectedChains] = useState<SupportedChain[]>(['ethereum', 'optimism', 'base']);
  
  const { 
    portfolio, 
    isLoading, 
    error, 
    refresh, 
    totalValue,
    chainValues 
  } = usePortfolio({
    address,
    chains: selectedChains,
    autoFetch: !!address
  });

  const handleChainToggle = (chain: SupportedChain) => {
    setSelectedChains(prev => 
      prev.includes(chain) 
        ? prev.filter(c => c !== chain) 
        : [...prev, chain]
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading portfolio data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No portfolio data available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Total Portfolio Value: ${totalValue.toLocaleString()}
        </h2>
        <p className="text-gray-600">
          Address: {portfolio.address}
        </p>
        <p className="text-gray-600">
          Last Updated: {new Date(portfolio.lastUpdated).toLocaleString()}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(['ethereum', 'optimism', 'base', 'arbitrum', 'polygon'] as SupportedChain[]).map(chain => (
          <button
            key={chain}
            onClick={() => handleChainToggle(chain)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedChains.includes(chain)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {chain.charAt(0).toUpperCase() + chain.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(chainValues).map(([chain, value]) => (
          <div key={chain} className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{chain.charAt(0).toUpperCase() + chain.slice(1)}</h3>
            <p className="text-2xl font-bold text-blue-600">${value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => refresh()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Refresh Portfolio
        </button>
      </div>
    </div>
  );
} 