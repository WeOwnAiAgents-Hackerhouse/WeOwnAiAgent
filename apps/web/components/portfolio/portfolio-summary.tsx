'use client';

import React from 'react';
import { UserPortfolio } from '@myira/portfolio-service';
import { formatCurrency } from '../../lib/format-utils';

interface PortfolioSummaryProps {
  portfolio: UserPortfolio;
  onRefresh: () => void;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  portfolio, 
  onRefresh 
}) => {
  const formattedTotalValue = formatCurrency(portfolio.totalValue);
  const lastUpdatedTime = new Date(portfolio.lastUpdated).toLocaleTimeString();
  const lastUpdatedDate = new Date(portfolio.lastUpdated).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Portfolio Summary</h2>
          <button
            onClick={onRefresh}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Refresh
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Total Portfolio Value</p>
          <p className="text-3xl font-bold text-gray-900">{formattedTotalValue}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolio.chains.map((chain) => (
            <div key={chain.chainId} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 mr-2 rounded-full bg-gray-200 flex items-center justify-center">
                  {chain.chainName.charAt(0)}
                </div>
                <h3 className="font-medium">{chain.chainName}</h3>
              </div>
              <p className="text-lg font-semibold">{formatCurrency(chain.totalValue)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {chain.tokens.length} tokens, {chain.nfts.length} NFTs
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-right">
          Last updated: {lastUpdatedDate} at {lastUpdatedTime}
        </div>
      </div>
    </div>
  );
}; 