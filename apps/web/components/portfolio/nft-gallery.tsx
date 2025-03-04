'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@myira/portfolio-service';
import type { SupportedChain } from '@myira/portfolio-service';

interface NFTGalleryProps {
  address: string;
}

export default function NFTGallery({ address }: NFTGalleryProps) {
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
        <p className="mt-2 text-gray-600">Loading NFT data...</p>
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
        <p className="text-gray-600">No NFT data available.</p>
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
            <span>NFTs: ${chain.nftsValue.toLocaleString()}</span>
          </h3>

          {chain.nfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chain.nfts.map(nft => (
                <div key={`${nft.address}-${nft.tokenId}`} className="border rounded-lg overflow-hidden shadow-sm">
                  {nft.imageUrl ? (
                    <img 
                      src={nft.imageUrl} 
                      alt={nft.name} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e2e8f0/a0aec0?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h5 className="font-medium text-gray-900">{nft.name || `#${nft.tokenId}`}</h5>
                    <p className="text-sm text-gray-500">{nft.collection}</p>
                    <p className="text-sm text-gray-900 mt-2">
                      Floor Price: ${nft.floorPrice?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No NFTs found for this chain</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 