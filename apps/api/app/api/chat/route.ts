import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@weown/auth';
import { myProvider } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@weown/database';
import {
  generateUUID,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();

  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = messages[messages.length - 1];

  if (!userMessage) {
    return new Response('No message provided', { status: 400 });
  }

  await saveChat({
    id,
    title: userMessage.content.substring(0, 100),
    userId: session.user.id,
    createdAt: new Date(),
  });

  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        experimental_activeTools:
          selectedChatModel === 'chat-model-reasoning'
            ? [
                {
                  name: 'create_document',
                  description:
                    'Create a new document with the specified content and type.',
                  parameters: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        description: 'The title of the document',
                      },
                      kind: {
                        type: 'string',
                        enum: ['text', 'code', 'image', 'sheet'],
                        description: 'The type of document to create',
                      },
                      description: {
                        type: 'string',
                        description: 'Description of what to create',
                      },
                    },
                    required: ['title', 'kind', 'description'],
                  },
                  execute: createDocument,
                },
                {
                  name: 'update_document',
                  description: 'Update an existing document with new content.',
                  parameters: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: 'The ID of the document to update',
                      },
                      description: {
                        type: 'string',
                        description: 'Description of the changes to make',
                      },
                    },
                    required: ['id', 'description'],
                  },
                  execute: updateDocument,
                },
                {
                  name: 'request_suggestions',
                  description: 'Request suggestions for a document.',
                  parameters: {
                    type: 'object',
                    properties: {
                      documentId: {
                        type: 'string',
                        description: 'The ID of the document',
                      },
                    },
                    required: ['documentId'],
                  },
                  execute: requestSuggestions,
                },
                {
                  name: 'get_weather',
                  description: 'Get the current weather for a location.',
                  parameters: {
                    type: 'object',
                    properties: {
                      location: {
                        type: 'string',
                        description: 'The location to get weather for',
                      },
                    },
                    required: ['location'],
                  },
                  execute: getWeather,
                },
              ]
            : undefined,
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: () => {
      return 'Oops, an error occured!';
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (!chat) {
      return new Response('Not Found', { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
} 