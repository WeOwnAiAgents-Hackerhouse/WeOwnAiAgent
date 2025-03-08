import { NextRequest, NextResponse } from 'next/server';
import { sessionAdapter, type Session } from '@myira/auth';
import { generateUUID } from '@myira/utils';

/**
 * GET /api/document
 * Gets a document by ID
 */
export async function GET(request: NextRequest) {
  try {
    // Get the session
    const session = await sessionAdapter.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the document ID from the query parameters
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would fetch the document from your database
    // This is a placeholder
    const document = {
      id,
      title: 'Sample Document',
      kind: 'text',
      content: 'Sample content',
      userId: session.user.id,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/document
 * Creates a new document
 */
export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await sessionAdapter.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const { title, kind, content } = await request.json();
    
    if (!title || !kind) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate a unique ID for the document
    const id = generateUUID();
    
    // In a real implementation, you would save the document to your database
    // This is a placeholder
    const document = {
      id,
      title,
      kind,
      content: content || '',
      userId: session.user.id,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/document
 * Updates an existing document
 */
export async function PUT(request: NextRequest) {
  try {
    // Get the session
    const session = await sessionAdapter.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const { id, content } = await request.json();
    
    if (!id || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would update the document in your database
    // This is a placeholder
    const document = {
      id,
      title: 'Updated Document',
      kind: 'text',
      content,
      userId: session.user.id,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/document
 * Deletes a document
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get the session
    const session = await sessionAdapter.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the document ID from the query parameters
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would delete the document from your database
    // This is a placeholder
    
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 