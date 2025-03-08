'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useOktoWallet } from '@myira/okto-integration';
import { WalletProvider } from '@myira/wallet-provider';
import { getWalletSession } from '@myira/auth';
import { AgentMetadata, DataSourceMetadata } from './interfaces';
import { AgentService } from './services/agent.service';
import { DataSourceService } from './services/data-source.service';

export interface CDPContextType {
  isAuthenticated: boolean;
  user: any;
  agents: AgentMetadata[];
  dataSources: DataSourceMetadata[];
  isLoading: boolean;
  error: Error | null;
  
  // Core functions
  loadAgents: () => Promise<AgentMetadata[]>;
  loadDataSources: () => Promise<DataSourceMetadata[]>;
  
  // Services
  agentService: AgentService;
  dataSourceService: DataSourceService;
}

const CDPContext = createContext<CDPContextType | null>(null);

export interface CDPProviderProps {
  children: ReactNode;
}

export const CDPProvider: React.FC<CDPProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [dataSources, setDataSources] = useState<DataSourceMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Service instances
  const agentService = new AgentService();
  const dataSourceService = new DataSourceService();
  
  // Get wallet connection from Okto
  const { isConnected, address } = useOktoWallet();
  
  // Check authentication on mount and when wallet connection changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isConnected && address) {
          // Get session from wallet
          const session = await getWalletSession();
          
          if (session?.user) {
            setUser(session.user);
            setIsAuthenticated(true);
            
            // Load initial data
            await loadAgents();
            await loadDataSources();
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to authenticate'));
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [isConnected, address]);
  
  // Function to load agents
  const loadAgents = async (): Promise<AgentMetadata[]> => {
    setIsLoading(true);
    try {
      const userId = user?.id;
      if (!userId) return [];
      
      const agentData = await agentService.getAllAgents(userId);
      setAgents(agentData);
      setError(null);
      return agentData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load agents'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to load data sources
  const loadDataSources = async (): Promise<DataSourceMetadata[]> => {
    setIsLoading(true);
    try {
      const userId = user?.id;
      if (!userId) return [];
      
      const sourceData = await dataSourceService.getAllSources(userId);
      setDataSources(sourceData);
      setError(null);
      return sourceData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data sources'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const contextValue: CDPContextType = {
    user,
    isAuthenticated,
    agents,
    dataSources,
    loadAgents,
    loadDataSources,
    isLoading,
    error,
    agentService,
    dataSourceService
  };
  
  return (
    <CDPContext.Provider value={contextValue}>
      {children}
    </CDPContext.Provider>
  );
};

// Custom hook to use the CDP context
export const useCDP = (): CDPContextType => {
  const context = useContext(CDPContext);
  if (!context) {
    throw new Error('useCDP must be used within a CDPProvider');
  }
  return context;
};

// Wrapper component that includes WalletProvider
export const CDPWithWalletProvider: React.FC<CDPProviderProps> = ({ children }) => {
  return (
    <WalletProvider>
      <CDPProvider>
        {children}
      </CDPProvider>
    </WalletProvider>
  );
}; 