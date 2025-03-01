import { db } from './db';
import { user, chat, message, document, vote, suggestion } from './schema';
import { eq, and, desc, gt, lt } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { hash } from 'bcrypt-ts';

// User queries
export async function getUser({ 
  email, 
  id,
  walletAddress 
}: { 
  email?: string; 
  id?: string;
  walletAddress?: string;
}) {
  if (email) {
    return await db.query.user.findFirst({
      where: eq(user.email, email),
    });
  } else if (id) {
    return await db.query.user.findFirst({
      where: eq(user.id, id),
    });
  } else if (walletAddress) {
    return await db.query.user.findFirst({
      where: eq(user.walletAddress, walletAddress),
    });
  }
  
  return null;
}

export async function createUser({ 
  email, 
  password,
  walletAddress,
  name
}: { 
  email: string; 
  password?: string;
  walletAddress?: string;
  name?: string;
}) {
  const userId = nanoid();
  
  // If wallet address is provided but no password, create a random one
  const userPassword = password || (walletAddress ? await hash(nanoid(), 10) : undefined);
  
  await db.insert(user).values({
    id: userId,
    email,
    password: userPassword,
    walletAddress,
    name,
  });
  
  return await getUser({ id: userId });
}

// Chat queries
export async function getChatById({ id }: { id: string }) {
  return await db.query.chat.findFirst({
    where: eq(chat.id, id),
  });
}

export async function getChatsByUserId({ id }: { id: string }) {
  return await db.query.chat.findMany({
    where: eq(chat.userId, id),
    orderBy: [desc(chat.createdAt)],
  });
}

export async function saveChat({
  id,
  title,
  userId,
  createdAt,
}: {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
}) {
  await db.insert(chat).values({
    id,
    title,
    userId,
    createdAt,
    visibility: 'private',
  });
}

export async function deleteChatById({ id }: { id: string }) {
  await db.delete(chat).where(eq(chat.id, id));
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: string;
}) {
  await db
    .update(chat)
    .set({ visibility })
    .where(eq(chat.id, chatId));
}

// Message queries
export async function getMessagesByChatId({ chatId }: { chatId: string }) {
  return await db.query.message.findMany({
    where: eq(message.chatId, chatId),
    orderBy: [message.createdAt],
  });
}

export async function getMessageById({ id }: { id: string }) {
  return await db.query.message.findFirst({
    where: eq(message.id, id),
  });
}

export async function saveMessages({
  messages,
}: {
  messages: Array<{
    id?: string;
    content: string;
    role: string;
    createdAt: Date;
    chatId: string;
  }>;
}) {
  const messagesToInsert = messages.map((message) => ({
    id: message.id || nanoid(),
    content: message.content,
    role: message.role,
    createdAt: message.createdAt,
    chatId: message.chatId,
  }));

  await db.insert(message).values(messagesToInsert);
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  await db
    .delete(message)
    .where(and(eq(message.chatId, chatId), gt(message.createdAt, timestamp)));
}

// Document queries
export async function getDocumentsById({ id }: { id: string }) {
  return await db.query.document.findMany({
    where: eq(document.id, id),
    orderBy: [document.createdAt],
  });
}

export async function saveDocument({
  id,
  title,
  content,
  kind,
  userId,
  createdAt,
}: {
  id: string;
  title: string;
  content: string;
  kind: string;
  userId: string;
  createdAt: Date;
}) {
  await db.insert(document).values({
    id,
    title,
    content,
    kind,
    userId,
    createdAt,
  });
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  await db
    .delete(document)
    .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
}

// Vote queries
export async function getVotesByChatId({ chatId }: { chatId: string }) {
  return await db.query.vote.findMany({
    where: eq(vote.chatId, chatId),
  });
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  await db.insert(vote).values({
    id: nanoid(),
    chatId,
    messageId,
    type,
    createdAt: new Date(),
  });
}

// Suggestion queries
export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  return await db.query.suggestion.findMany({
    where: eq(suggestion.documentId, documentId),
    orderBy: [suggestion.createdAt],
  });
}

export async function saveSuggestion({
  documentId,
  content,
  userId,
}: {
  documentId: string;
  content: string;
  userId: string;
}) {
  await db.insert(suggestion).values({
    id: nanoid(),
    documentId,
    content,
    userId,
    createdAt: new Date(),
  });
} 