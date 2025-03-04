'use client';

import { useState } from 'react';
import { useCDP } from '../provider';
import { DataSourceMetadata, IDataSource } from '../interfaces';

export function useDataSource() {
  const { dataSourceService, loadDataSources } = useCDP();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const uploadFile = async (
    file: File,
    name: string,
    description?: string
  ): Promise<IDataSource | null> => {
    setIsLoading(true);
    try {
      const dataSource = await dataSourceService.uploadFile(file, name, description);
      await loadDataSources(); // Refresh data sources
      setError(null);
      return dataSource;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload file'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addUrlSource = async (
    url: string,
    name: string,
    options?: any
  ): Promise<IDataSource | null> => {
    setIsLoading(true);
    try {
      const dataSource = await dataSourceService.addUrlSource(url, name, options);
      await loadDataSources(); // Refresh data sources
      setError(null);
      return dataSource;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add URL source'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteSource = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await dataSourceService.deleteSource(id);
      if (success) {
        await loadDataSources(); // Refresh data sources
      }
      setError(null);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete data source'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    uploadFile,
    addUrlSource,
    deleteSource,
    isLoading,
    error,
  };
} 