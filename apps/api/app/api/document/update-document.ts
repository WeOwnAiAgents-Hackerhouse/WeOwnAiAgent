import { DataStreamWriter, tool } from 'ai';
import { z } from 'zod';
import { type Session } from '@myira/auth';
import { documentHandlersByArtifactKind } from '../../../lib/artifacts/server';

interface UpdateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const updateDocument = ({ session, dataStream }: UpdateDocumentProps) =>
  tool({
    description:
      'Update an existing document with new content. This tool will call other functions that will update the contents of the document based on the description.',
    parameters: z.object({
      id: z.string(),
      description: z.string(),
    }),
    execute: async ({ id, description }) => {
      dataStream.writeData({
        type: 'id',
        content: id,
      });

      dataStream.writeData({
        type: 'description',
        content: description,
      });

      dataStream.writeData({
        type: 'clear',
        content: '',
      });

      // Get the document from the database
      // This is a placeholder - in a real implementation, you would fetch the document
      const document = await getDocumentById(id);

      if (!document) {
        throw new Error(`Document not found: ${id}`);
      }

      // Find the appropriate handler for this document kind
      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === document.kind,
      );

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${document.kind}`);
      }

      // Update the document
      await documentHandler.onUpdateDocument({
        document,
        description,
        dataStream,
        session,
      });
      dataStream.writeData({ type: 'finish', content: '' });

      return {
        id,
        message: 'The document has been updated and is now visible to the user.',
      };
    },
  });

// Placeholder function to get a document by ID
// In a real implementation, this would fetch from your database
async function getDocumentById(id: string) {
  // This is a placeholder - replace with actual implementation
  return {
    id,
    title: 'Sample Document',
    kind: 'text',
    content: 'Sample content',
    userId: 'user123',
    createdAt: new Date(),
    updatedAt: new Date()
  };
} 