'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@myira/portfolio-service';
import type { SupportedChain } from '@myira/portfolio-service';

interface TokenListProps {
  address: string;
}

export default function TokenList({ address }: TokenListProps) {
  const [selectedChains, setSelectedChains] = useState<SupportedChain[]>(['ethereum', 'optimism', 'base']);
  
  const { 
    portfolio, 
    isLoading, 
    error
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
        <p className="mt-2 text-gray-600">Loading token data...</p>
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
        <p className="text-gray-600">No token data available.</p>
      </div>
    );
  }

  return (
    <div>
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

      {portfolio.chains.map(chain => (
        <div key={chain.chain} className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex justify-between">
            <span>{chain.chain.charAt(0).toUpperCase() + chain.chain.slice(1)}</span>
            <span>Tokens: ${chain.tokensValue.toLocaleString()}</span>
          </h3>

          {chain.tokens.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chain.tokens.map(token => (
                    <tr key={token.address}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {token.logoUrl && (
                            <img src={token.logoUrl} alt={token.symbol} className="h-6 w-6 mr-2" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{token.symbol}</div>
                            <div className="text-sm text-gray-500">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {token.balance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        ${token.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        ${token.value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tokens found for this chain</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 