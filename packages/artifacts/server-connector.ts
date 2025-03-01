import { ArtifactKind } from '@weown/system-design';

export interface DocumentRequestProps {
  id: string;
  title: string;
  kind: ArtifactKind;
  dataStream: any;
  session: any;
}

export interface DocumentUpdateProps {
  documentId: string;
  description: string;
  dataStream: any;
  session: any;
}

export async function createArtifact(props: DocumentRequestProps): Promise<void> {
  const response = await fetch('/api/artifacts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: props.id,
      title: props.title,
      kind: props.kind,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create artifact');
  }
  
  // Handle streaming response
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    try {
      const data = JSON.parse(chunk);
      props.dataStream.writeData(data);
    } catch (e) {
      console.error('Error parsing chunk:', e);
    }
  }
}

export async function updateArtifact(props: DocumentUpdateProps): Promise<void> {
  const response = await fetch(`/api/artifacts/${props.documentId}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: props.description,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update artifact');
  }
  
  // Handle streaming response
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    try {
      const data = JSON.parse(chunk);
      props.dataStream.writeData(data);
    } catch (e) {
      console.error('Error parsing chunk:', e);
    }
  }
} 