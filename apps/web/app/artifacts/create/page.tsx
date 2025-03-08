'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {  ArtifactKind }  from '@myira/system-design';
import { ArtifactCreator } from '../../../components/artifact-creator';
export default function CreateArtifactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kind = (searchParams.get('kind') as ArtifactKind) || 'text';
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Now ready to create the artifact
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Create New Artifact</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Title/Prompt</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter a title or prompt..."
            required
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={!title.trim()}
        >
          Create
        </button>
      </form>
      
      {title && (
        <ArtifactCreator
          initialTitle={title}
          artifactKind={kind}
        />
      )}
    </div>
  );
} 