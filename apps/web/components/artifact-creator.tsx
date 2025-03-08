import React, { useState } from 'react';
import { CreateArtifact, Artifact } from '@myira/system-design';
import { textArtifact, codeArtifact, imageArtifact, sheetArtifact } from '@myira/artifacts';
import { createArtifact, updateArtifact } from '@myira/artifacts/server-connector';
import { generateUUID } from '@/lib/utils';

interface ArtifactCreatorProps {
  initialTitle: string;
  artifactKind: 'text' | 'code' | 'image' | 'sheet';
}

export function ArtifactCreator({ initialTitle, artifactKind }: ArtifactCreatorProps) {
  const [documentId] = useState(() => generateUUID());
  
  // Select the appropriate artifact implementation based on kind
  const getArtifactImplementation = () => {
    switch (artifactKind) {
      case 'text':
        return textArtifact;
      case 'code':
        return codeArtifact;
      case 'image':
        return imageArtifact;
      case 'sheet':
        return sheetArtifact;
      default:
        return textArtifact;
    }
  };

  const handleCreateDocument = async (args: {
    id: string;
    title: string;
    dataStream: any;
  }) => {
    // Call the server connector to create the artifact
    await createArtifact({
      id: args.id,
      title: args.title,
      kind: artifactKind,
      dataStream: args.dataStream,
      session: null, // Session would be obtained from auth context
    });
  };

  const handleUpdateDocument = async (args: {
    documentId: string;
    description: string;
    dataStream: any;
  }) => {
    // Call the server connector to update the artifact
    await updateArtifact({
      documentId: args.documentId,
      description: args.description,
      dataStream: args.dataStream,
      session: null, // Session would be obtained from auth context
    });
  };

  return (
    <CreateArtifact
      artifactImplementation={getArtifactImplementation()}
      documentId={documentId}
      initialTitle={initialTitle}
      onCreateDocument={handleCreateDocument}
      onUpdateDocument={handleUpdateDocument}
    />
  );
} 