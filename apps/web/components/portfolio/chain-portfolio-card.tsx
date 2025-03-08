'use client';

import React, { useState } from 'react';
import { ChainPortfolio } from '@myira/portfolio-service';
import { formatCurrency } from '../../lib/format-utils';

interface ChainPortfolioCardProps {
  chainPortfolio: ChainPortfolio;
}

export const ChainPortfolioCard: React.FC<ChainPortfolioCardProps> = ({ 
  chainPortfolio 
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts' | 'staking'>('tokens');
  
  const { chainName, tokens, nfts, stakingPositions, totalValue } = chainPortfolio;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800">{chainName}</h3>
          <span className="text-lg font-bold">{formatCurrency(totalValue)}</span>
        </div>
      </div>
      
      <div className="border-b border-gray-100">
        <div className="flex">
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === 'tokens' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tokens')}
          >
            Tokens ({tokens.length})
          </button>
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === 'nfts' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('nfts')}
          >
            NFTs ({nfts.length})
          </button>
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === 'staking' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('staking')}
          >
            Staking ({stakingPositions.length})
          </button>
        </div>
      </div>
      
      <div className="p-4 max-h-80 overflow-y-auto">
        {activeTab === 'tokens' && (
          <div className="space-y-3">
            {tokens.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No tokens found</p>
            ) : (
              tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {token.logoUrl ? (
                      <img 
                        src={token.logoUrl} 
                        alt={token.symbol} 
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                        {token.symbol.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-xs text-gray-500">{token.balance} {token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(token.value)}</p>
                    <p className="text-xs text-gray-500">${token.price.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'nfts' && (
          <div className="grid grid-cols-2 gap-3">
            {nfts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4 col-span-2">No NFTs found</p>
            ) : (
              nfts.map((nft, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  {nft.imageUrl ? (
                    <img 
                      src={nft.imageUrl} 
                      alt={nft.name} 
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                      No Image
                    </div>
                  )}
                  <div className="p-2">
                    <p className="font-medium text-sm truncate">{nft.name}</p>
                    <p className="text-xs text-gray-500 truncate">{nft.collection}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'staking' && (
          <div className="space-y-3">
            {stakingPositions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No staking positions found</p>
            ) : (
              stakingPositions.map((position, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{position.protocol}</p>
                    <p className="text-sm text-green-600">
                      {position.apy ? `${position.apy.toFixed(2)}% APY` : 'APY N/A'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{position.amount} {position.asset}</p>
                    <p className="font-medium">{formatCurrency(position.value)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 