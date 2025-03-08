'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDataSource } from '../lib/hooks/useDataSource';
import { DataSourceMetadata } from '../lib/interfaces';
import { Button, Input, Card, Tabs, Tab } from '@myira/system-design';

interface DataPreparationProps {
  onSourceAdded?: (source: DataSourceMetadata) => void;
}

export function DataPreparation({ onSourceAdded }: DataPreparationProps) {
  const { uploadFile, addUrlSource, isLoading, error } = useDataSource();
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [activeTab, setActiveTab] = useState('file');
  
  // File upload handling
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        // Use filename as source name if not provided
        const name = sourceName || file.name;
        
        const source = await uploadFile(file, name);
        if (source && onSourceAdded) {
          onSourceAdded(source.getMetadata());
        }
        
        // Reset the form
        setSourceName('');
      }
    },
  });
  
  // URL source handling
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl) return;
    
    const name = sourceName || `URL Source ${new Date().toISOString()}`;
    const source = await addUrlSource(sourceUrl, name);
    
    if (source && onSourceAdded) {
      onSourceAdded(source.getMetadata());
    }
    
    // Reset the form
    setSourceName('');
    setSourceUrl('');
  };
  
  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-4">Data Preparation</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error.message}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Source Name (optional)</label>
        <Input
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          placeholder="Give your data source a name"
          className="w-full"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tab value="file" title="Upload File">
          <div 
            {...getRootProps()} 
            className={`mt-4 border-2 border-dashed rounded-md p-8 text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <div>
                <p>Drag and drop a file here, or click to select a file</p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, TXT, MD (max 50MB)
                </p>
              </div>
            )}
          </div>
        </Tab>
        
        <Tab value="url" title="Add URL">
          <form onSubmit={handleUrlSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">URL</label>
              <Input
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/resource"
                className="w-full"
                required
              />
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add URL Source'}
            </Button>
          </form>
        </Tab>
      </Tabs>
    </Card>
  );
} 