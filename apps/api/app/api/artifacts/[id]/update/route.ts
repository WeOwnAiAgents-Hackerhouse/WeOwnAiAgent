import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { streamResponse } from 'ai';
import { documentHandlersByArtifactKind } from '../../../../../lib/artifacts/server';
import { getDocumentById } from '@myira/database';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { description } = await req.json();
    const documentId = params.id;

    // Get the document
    const document = await getDocumentById({ id: documentId });
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Find the appropriate handler
    const handler = documentHandlersByArtifactKind.find(h => h.kind === document.kind);
    
    if (!handler) {
      return NextResponse.json({ error: 'Invalid artifact kind' }, { status: 400 });
    }

    // Use streaming response
    return streamResponse(async (stream) => {
      await handler.onUpdateDocument({
        document,
        description,
        dataStream: stream,
        session,
      });
    });
  } catch (error) {
    console.error('Error updating artifact:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 