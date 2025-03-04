'use client';

import { useState, useEffect } from 'react';
import { SupportedChain, UserPortfolio, ChainPortfolio } from '../types';
import { usePortfolioContext } from '../context/portfolio-context';

interface UsePortfolioOptions {
  address?: string;
  chains?: SupportedChain[];
  autoFetch?: boolean;
}

interface UsePortfolioResult {
  portfolio: UserPortfolio | null;
  isLoading: boolean;
  error: Error | null;
  refresh: (address?: string, chains?: SupportedChain[]) => Promise<void>;
  getChainPortfolio: (chain: SupportedChain) => ChainPortfolio | null;
  totalValue: number;
  chainValues: Record<SupportedChain, number>;
}

export const usePortfolio = (options: UsePortfolioOptions = {}): UsePortfolioResult => {
  const { address, chains, autoFetch = true } = options;
  const { portfolio, isLoading, error, refreshPortfolio } = usePortfolioContext();
  const [chainValues, setChainValues] = useState<Record<SupportedChain, number>>({} as Record<SupportedChain, number>);

  // Initial fetch if autoFetch is true
  useEffect(() => {
    if (autoFetch && address) {
      refreshPortfolio(address, chains);
    }
  }, [address, autoFetch]);

  // Update chain values whenever portfolio changes
  useEffect(() => {
    if (portfolio) {
      const values: Record<string, number> = {};
      portfolio.chains.forEach((chainPortfolio) => {
        values[chainPortfolio.chain] = chainPortfolio.totalValue;
      });
      setChainValues(values as Record<SupportedChain, number>);
    }
  }, [portfolio]);

  // Helper function to get portfolio for a specific chain
  const getChainPortfolio = (chain: SupportedChain): ChainPortfolio | null => {
    if (!portfolio) return null;
    return portfolio.chains.find((c) => c.chain === chain) || null;
  };

  return {
    portfolio,
    isLoading,
    error,
    refresh: refreshPortfolio,
    getChainPortfolio,
    totalValue: portfolio?.totalValue || 0,
    chainValues,
  };
}; 