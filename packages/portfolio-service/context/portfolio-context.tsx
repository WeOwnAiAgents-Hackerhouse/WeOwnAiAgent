'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiKeys, SupportedChain, UserPortfolio } from '../types';
import { PortfolioService } from '../services/portfolio-service';

interface PortfolioContextType {
  portfolio: UserPortfolio | null;
  isLoading: boolean;
  error: Error | null;
  refreshPortfolio: (address?: string, chains?: SupportedChain[]) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
  apiKeys: ApiKeys;
  defaultAddress?: string;
  defaultChains?: SupportedChain[];
  autoRefreshInterval?: number; // in milliseconds
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({
  children,
  apiKeys,
  defaultAddress,
  defaultChains,
  autoRefreshInterval = 0, // 0 means no auto-refresh
}) => {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | undefined>(defaultAddress);
  
  const portfolioService = new PortfolioService(apiKeys);

  const refreshPortfolio = async (address?: string, chains?: SupportedChain[]) => {
    if (!address && !currentAddress) {
      setError(new Error('No address provided'));
      return;
    }

    const targetAddress = address || currentAddress;
    if (address && address !== currentAddress) {
      setCurrentAddress(address);
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await portfolioService.getUserPortfolio(targetAddress!, chains || defaultChains);
      setPortfolio(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch portfolio'));
      console.error('Error fetching portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (defaultAddress) {
      refreshPortfolio(defaultAddress, defaultChains);
    }
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefreshInterval || autoRefreshInterval <= 0 || !currentAddress) return;

    const intervalId = setInterval(() => {
      refreshPortfolio(currentAddress, defaultChains);
    }, autoRefreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefreshInterval, currentAddress, defaultChains]);

  const value = {
    portfolio,
    isLoading,
    error,
    refreshPortfolio,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolioContext = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider');
  }
  return context;
}; 