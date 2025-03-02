import { Artifact } from '@weown/system-design';

interface Metadata {
  outputs: Array<any>; // ConsoleOutput type would be defined in system-design
}

export const codeArtifact = new Artifact<'code', Metadata>({
  kind: 'code',
  description:
    'Useful for code generation; Code execution is only available for python code.',
  initialize: async ({ setMetadata }) => {
    setMetadata({
      outputs: [],
    });
  },
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'code-delta') {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: streamPart.content as string,
        isVisible:
          draftArtifact.status === 'streaming' &&
          draftArtifact.content.length > 300 &&
          draftArtifact.content.length < 310
            ? true
            : draftArtifact.isVisible,
        status: 'streaming',
      }));
    }
  },
  content: ({ metadata, setMetadata, ...props }) => {
    return (
      <>
        <div className="px-1">
          Code Editor Component
        </div>

        {metadata?.outputs && (
          <>Console Output Component</>
        )}
      </>
    );
  },
  actions: [
    {
      icon: <>Icon</>,
      label: 'Run',
      description: 'Execute code',
      onClick: async ({ content, setMetadata }) => {
        // Implementation of code execution
      },
    },
    // More actions...
  ],
  toolbar: [
    {
      icon: <>Icon</>,
      description: 'Add comments',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Add comments to the code snippet for understanding',
        });
      },
    },
    // More toolbar items...
  ],
}); 