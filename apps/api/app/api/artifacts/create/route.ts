import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { streamResponse } from 'ai';
import { documentHandlersByArtifactKind } from '../../../../lib/artifacts/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, kind } = await req.json();

    // Find the appropriate handler
    const handler = documentHandlersByArtifactKind.find(h => h.kind === kind);
    
    if (!handler) {
      return NextResponse.json({ error: 'Invalid artifact kind' }, { status: 400 });
    }

    // Use streaming response
    return streamResponse(async (stream) => {
      await handler.onCreateDocument({
        id,
        title,
        dataStream: stream,
        session,
      });
    });
  } catch (error) {
    console.error('Error creating artifact:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 