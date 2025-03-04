'use client';

import React from 'react';
import { usePortfolio } from '@weown/portfolio-service';
import { PortfolioSummary } from './portfolio-summary';
import { ChainPortfolioCard } from './chain-portfolio-card';
import { LoadingSpinner } from '../ui/loading-spinner';

interface PortfolioDashboardProps {
  address?: string;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ address }) => {
  const { portfolio, isLoading, error, refreshPortfolio } = usePortfolio({
    address,
    chains: ['ethereum', 'optimism', 'base'],
    autoFetch: true,
  });

  if (isLoading && !portfolio) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading your portfolio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 font-medium text-lg mb-2">Error Loading Portfolio</h3>
        <p className="text-red-600 mb-4">{error.message}</p>
        <button
          onClick={() => refreshPortfolio()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-yellow-800 font-medium text-lg mb-2">No Portfolio Data</h3>
        <p className="text-yellow-600">We couldn't find any assets for this wallet address.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Summary */}
      <PortfolioSummary portfolio={portfolio} onRefresh={refreshPortfolio} />

      {/* Chain-specific Portfolios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.chains.map((chainPortfolio) => (
          <ChainPortfolioCard 
            key={chainPortfolio.chainId} 
            chainPortfolio={chainPortfolio} 
          />
        ))}
      </div>
    </div>
  );
}; 