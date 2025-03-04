'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioService } from '../services/portfolio-service';
import { PortfolioServiceConfig, SupportedChain, UserPortfolio } from '../types';

interface PortfolioContextType {
  portfolio: UserPortfolio | null;
  isLoading: boolean;
  error: Error | null;
  fetchPortfolio: (address: string, chains?: SupportedChain[]) => Promise<void>;
  refreshPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: React.ReactNode;
  config: PortfolioServiceConfig;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ 
  children, 
  config 
}) => {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentChains, setCurrentChains] = useState<SupportedChain[]>(['ethereum', 'optimism', 'base']);
  
  const portfolioService = new PortfolioService(config);

  const fetchPortfolio = async (address: string, chains?: SupportedChain[]) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const chainsToUse = chains || currentChains;
      setCurrentAddress(address);
      setCurrentChains(chainsToUse);
      
      const portfolioData = await portfolioService.getUserPortfolio(address, chainsToUse);
      setPortfolio(portfolioData);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch portfolio'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPortfolio = async () => {
    if (currentAddress) {
      await fetchPortfolio(currentAddress, currentChains);
    }
  };

  // Automatically refresh portfolio data every 5 minutes
  useEffect(() => {
    if (!currentAddress) return;
    
    const intervalId = setInterval(() => {
      refreshPortfolio();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [currentAddress, currentChains]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        isLoading,
        error,
        fetchPortfolio,
        refreshPortfolio
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider');
  }
  return context;
}; 