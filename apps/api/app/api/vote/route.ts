import { auth } from '@weown/auth';
import { getVotesByChatId, voteMessage } from '@weown/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new Response('chatId is required', { status: 400 });
  }

  const votes = await getVotesByChatId({ chatId });
  return Response.json(votes);
}

export async function POST(request: Request) {
  const { chatId, messageId, type } = await request.json();

  if (!chatId || !messageId || !type) {
    return new Response('Missing required fields', { status: 400 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  await voteMessage({
    chatId,
    messageId,
    type: type,
  });

  return new Response('Message voted', { status: 200 });
} 