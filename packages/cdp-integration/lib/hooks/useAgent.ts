'use client';

import { useState } from 'react';
import { useCDP } from '../provider';
import { AgentMetadata, AgentConfig, AgentTool } from '../interfaces';

export function useAgent() {
  const { agentService, loadAgents } = useCDP();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const createAgent = async (data: Partial<AgentMetadata>): Promise<AgentMetadata | null> => {
    setIsLoading(true);
    try {
      const agent = await agentService.createAgent(data);
      await loadAgents(); // Refresh the agent list
      setError(null);
      return agent;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create agent'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAgentConfig = async (agentId: string): Promise<AgentConfig | null> => {
    setIsLoading(true);
    try {
      const config = await agentService.getAgentConfig(agentId);
      setError(null);
      return config;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get agent configuration'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateAgentConfig = async (
    agentId: string, 
    updates: Partial<AgentConfig>
  ): Promise<AgentConfig | null> => {
    setIsLoading(true);
    try {
      const config = await agentService.updateAgentConfig(agentId, updates);
      setError(null);
      return config;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update agent configuration'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAgent = async (agentId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await agentService.deleteAgent(agentId);
      if (success) {
        await loadAgents(); // Refresh the agent list
      }
      setError(null);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete agent'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addTool = async (agentId: string, tool: AgentTool): Promise<AgentConfig | null> => {
    setIsLoading(true);
    try {
      const config = await agentService.addTool(agentId, tool);
      setError(null);
      return config;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add tool to agent'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createAgent,
    getAgentConfig,
    updateAgentConfig,
    deleteAgent,
    addTool,
    isLoading,
    error,
  };
} 