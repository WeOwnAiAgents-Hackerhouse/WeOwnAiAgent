import { NextRequest, NextResponse } from 'next/server';
import { getSuggestionsByDocumentId } from '@myira/database';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const suggestions = await getSuggestionsByDocumentId({ documentId });
    
    return NextResponse.json(suggestions || []);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 