import React, { useState, useEffect, useRef } from 'react';
import { Artifact, ArtifactKind, ViewMode } from './artifact';
import { toast } from 'sonner';
import { DataStreamWriter, createDataStream } from 'ai';

// Define enum values that were previously referenced as types
enum ArtifactState {
  IDLE = 'idle',
  GENERATING = 'generating',
  ERROR = 'error'
}

export interface CreateArtifactProps<K extends ArtifactKind = ArtifactKind, M = any> {
  artifactImplementation: Artifact<K, M>;
  documentId: string;
  initialTitle: string;
  initialContent?: string;
  onCreateDocument?: (args: {
    id: string;
    title: string;
    dataStream: DataStreamWriter;
  }) => Promise<void>;
  onUpdateDocument?: (args: {
    document: any;
    description: string;
    dataStream: DataStreamWriter;
  }) => Promise<void>;
}

// Extended Artifact interface to include the methods used in this component
interface ExtendedArtifact<K extends ArtifactKind = ArtifactKind, M = any> extends Artifact<K, M> {
  getInitialMetadata?: () => M;
  getSuggestions?: (documentId: string) => Promise<any[]>;
  onContentChange?: (content: string, setMetadata: React.Dispatch<React.SetStateAction<M>>) => void;
  onGenerate?: (args: {
    content: string;
    prompt: string;
    dataStream: DataStreamWriter;
    setContent: (content: string) => void;
    setMetadata: React.Dispatch<React.SetStateAction<M>>;
  }) => Promise<void>;
  renderContent?: (args: {
    content: string;
    metadata: M;
    state: ArtifactState;
    viewMode: ViewMode;
    setContent: (content: string) => void;
    setMetadata: React.Dispatch<React.SetStateAction<M>>;
  }) => React.ReactNode;
  renderToolbar?: (args: {
    content: string;
    metadata: M;
    state: ArtifactState;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    setContent: (content: string) => void;
    setMetadata: React.Dispatch<React.SetStateAction<M>>;
    onGenerate: (prompt?: string) => Promise<void>;
    onCancel: () => void;
  }) => React.ReactNode;
  renderSuggestions?: (args: {
    suggestions: any[];
    onSelect: (suggestion: { prompt: string }) => void;
  }) => React.ReactNode;
}

export function CreateArtifact<K extends ArtifactKind = ArtifactKind, M = any>({
  artifactImplementation,
  documentId,
  initialTitle,
  initialContent = '',
  onCreateDocument,
  onUpdateDocument,
}: CreateArtifactProps<K, M>) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [state, setState] = useState<ArtifactState>(ArtifactState.IDLE);
  const [viewMode, setViewMode] = useState<ViewMode>('default' as ViewMode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const dataStreamRef = useRef<DataStreamWriter | null>(null);

  // Cast to extended artifact to access the additional methods
  const extendedArtifact = artifactImplementation as ExtendedArtifact<K, M>;

  // Initialize metadata based on artifact implementation
  const [metadata, setMetadata] = useState<M>(
    extendedArtifact.getInitialMetadata?.() || {} as M
  );

  useEffect(() => {
    // Load suggestions if the artifact supports them
    const loadSuggestions = async () => {
      if (extendedArtifact.getSuggestions) {
        try {
          const fetchedSuggestions = await extendedArtifact.getSuggestions(documentId);
          setSuggestions(fetchedSuggestions);
        } catch (error) {
          console.error('Failed to load suggestions:', error);
        }
      }
    };

    loadSuggestions();
  }, [documentId, extendedArtifact]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    extendedArtifact.onContentChange?.(newContent, setMetadata);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleGenerate = async (prompt?: string) => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      setState(ArtifactState.GENERATING);
      
      // Create a new data stream for the generation
      const dataStream = createDataStream();
      dataStreamRef.current = dataStream;
      
      // Handle document creation or update based on provided callbacks
      if (content === initialContent && onCreateDocument) {
        await onCreateDocument({
          id: documentId,
          title,
          dataStream,
        });
      } else if (onUpdateDocument) {
        await onUpdateDocument({
          document: {
            id: documentId,
            title,
            content,
            kind: artifactImplementation.kind,
          },
          description: prompt || '',
          dataStream,
        });
      }
      
      // Let the artifact implementation handle the generation
      if (extendedArtifact.onGenerate) {
        await extendedArtifact.onGenerate({
          content,
          prompt: prompt || '',
          dataStream,
          setContent: handleContentChange,
          setMetadata,
        });
      }
      
      setState(ArtifactState.IDLE);
      toast.success('Generation completed');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate content');
      setState(ArtifactState.ERROR);
    } finally {
      setIsGenerating(false);
      dataStreamRef.current = null;
    }
  };

  const handleCancel = () => {
    if (dataStreamRef.current) {
      dataStreamRef.current.abort?.();
      dataStreamRef.current = null;
    }
    setState(ArtifactState.IDLE);
    setIsGenerating(false);
    toast.info('Generation cancelled');
  };

  const renderContent = () => {
    if (extendedArtifact.renderContent) {
      return extendedArtifact.renderContent({
        content,
        metadata,
        state,
        viewMode,
        setContent: handleContentChange,
        setMetadata,
      });
    }
    return null;
  };

  const renderToolbar = () => {
    if (extendedArtifact.renderToolbar) {
      return extendedArtifact.renderToolbar({
        content,
        metadata,
        state,
        viewMode,
        setViewMode: handleViewModeChange,
        setContent: handleContentChange,
        setMetadata,
        onGenerate: handleGenerate,
        onCancel: handleCancel,
      });
    }
    return null;
  };

  const renderSuggestions = () => {
    if (extendedArtifact.renderSuggestions && suggestions.length > 0) {
      return extendedArtifact.renderSuggestions({
        suggestions,
        onSelect: (suggestion: { prompt: string }) => handleGenerate(suggestion.prompt),
      });
    }
    return null;
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-xl font-semibold bg-transparent border-none outline-none flex-grow"
          placeholder="Untitled"
        />
        {renderToolbar()}
      </div>
      
      <div className="flex-grow overflow-auto">
        {renderContent()}
      </div>
      
      {renderSuggestions()}
    </div>
  );
}

// Re-export for convenience
export { Artifact }; 