import { auth } from '@weown/auth';
import { ArtifactKind } from '@weown/system-design';
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from '@weown/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const documents = await getDocumentsById({ id });

  if (!documents || documents.length === 0) {
    return new Response('Not Found', { status: 404 });
  }

  if (documents[0].userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json(documents);
}

export async function POST(request: Request) {
  const { id, title, content, kind } = await request.json();

  if (!id || !title || !content || !kind) {
    return new Response('Bad Request', { status: 400 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await saveDocument({
      id,
      title,
      content,
      kind: kind as ArtifactKind,
      userId: session.user.id,
      createdAt: new Date(),
    });

    return new Response('Created', { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const timestamp = searchParams.get('timestamp');

  if (!id || !timestamp) {
    return new Response('Bad Request', { status: 400 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const documents = await getDocumentsById({ id });

  if (!documents || documents.length === 0) {
    return new Response('Not Found', { status: 404 });
  }

  if (documents[0].userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  await deleteDocumentsByIdAfterTimestamp({
    id,
    timestamp: new Date(timestamp),
  });

  return new Response('Deleted', { status: 200 });
} 