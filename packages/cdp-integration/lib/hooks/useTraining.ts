'use client';

import { useState } from 'react';
import { useCDP } from '../provider';
import { TrainingSession, TrainingOptions } from '../interfaces';

export function useTraining() {
  const { trainingService } = useCDP();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const startTraining = async (
    agentId: string,
    options?: TrainingOptions
  ): Promise<TrainingSession | null> => {
    setIsLoading(true);
    try {
      const session = await trainingService.startTraining(agentId, options);
      setError(null);
      return session;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start training'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getTrainingStatus = async (
    agentId: string,
    sessionId: string
  ): Promise<TrainingSession | null> => {
    setIsLoading(true);
    try {
      const session = await trainingService.getTrainingStatus(agentId, sessionId);
      setError(null);
      return session;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get training status'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelTraining = async (
    agentId: string,
    sessionId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await trainingService.cancelTraining(agentId, sessionId);
      setError(null);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to cancel training'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getTrainingHistory = async (agentId: string): Promise<TrainingSession[]> => {
    setIsLoading(true);
    try {
      const history = await trainingService.getTrainingHistory(agentId);
      setError(null);
      return history;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get training history'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to wait for training to complete
  const waitForTrainingCompletion = async (
    agentId: string,
    sessionId: string,
    onProgress?: (session: TrainingSession) => void,
    checkIntervalMs: number = 5000,
    timeoutMs: number = 300000 // 5 minutes
  ): Promise<TrainingSession | null> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const session = await getTrainingStatus(agentId, sessionId);
      
      if (!session) return null;
      
      // Call the progress callback if provided
      if (onProgress) {
        onProgress(session);
      }
      
      // Check if training is complete
      if (
        session.status === 'completed' ||
        session.status === 'failed' ||
        session.status === 'canceled'
      ) {
        return session;
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, checkIntervalMs));
    }
    
    // Timeout reached
    setError(new Error('Training completion timeout reached'));
    return null;
  };
  
  return {
    startTraining,
    getTrainingStatus,
    cancelTraining,
    getTrainingHistory,
    waitForTrainingCompletion,
    isLoading,
    error,
  };
} 