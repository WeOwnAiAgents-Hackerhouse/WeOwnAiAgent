import { Artifact } from '@weown/system-design';
import { Suggestion } from '@weown/database';

interface TextArtifactMetadata {
  suggestions: Array<Suggestion>;
}

export const textArtifact = new Artifact<'text', TextArtifactMetadata>({
  kind: 'text',
  description: 'Useful for text content, like drafting essays and emails.',
  initialize: async ({ documentId, setMetadata }) => {
    // This would now call into the API to get suggestions
    const response = await fetch(`/api/artifacts/${documentId}/suggestions`);
    const suggestions = await response.json();
    
    setMetadata({
      suggestions,
    });
  },
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === 'suggestion') {
      setMetadata((metadata) => ({
        suggestions: [
          ...metadata.suggestions,
          streamPart.content as Suggestion,
        ],
      }));
    }

    if (streamPart.type === 'text-delta') {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: draftArtifact.content + (streamPart.content as string),
        isVisible:
          draftArtifact.status === 'streaming' &&
          draftArtifact.content.length > 400 &&
          draftArtifact.content.length < 450
            ? true
            : draftArtifact.isVisible,
        status: 'streaming',
      }));
    }
  },
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    // Implement text content rendering here
    // Would reference components from @weown/system-design
    return <div>Text Editor Component</div>;
  },
  actions: [
    {
      icon: <>Icon</>,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        return currentVersionIndex === 0;
      },
    },
    // Other actions...
  ],
  toolbar: [
    {
      icon: <>Icon</>,
      description: 'Add final polish',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please add final polish and check for grammar, add section titles for better structure, and ensure everything reads smoothly.',
        });
      },
    },
    // Other toolbar items...
  ],
}); 