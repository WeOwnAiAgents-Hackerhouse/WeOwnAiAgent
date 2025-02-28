import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Agent, AgentExecution, AgentMemory, AgentModel, AgentTool, Attestation, Model, Tool } from './schema';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  type Message,
  message,
  vote,
  agent,
  model,
  agentModel,
  tool,
  agentTool,
  agentExecution,
  agentMemory,
  attestation,
} from './schema';
import { ArtifactKind } from '@/components/artifact';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// Configure database connection
const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('Database URL is not defined. Please set POSTGRES_URL or DATABASE_URL in your environment');
}

// Configure connection with proper SSL settings for production
const client = postgres(dbUrl, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// Initialize Drizzle
export const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
  } catch (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to delete chat by id from database');
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
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
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    console.error('Failed to upvote message in database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save document in database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database',
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database',
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error('Failed to get message by id from database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)),
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds)),
        );
    }
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database',
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error('Failed to update chat visibility in database');
    throw error;
  }
}

// Agent CRUD operations
export async function createAgent({
  name,
  description,
  userId,
  configuration,
}: {
  name: string;
  description?: string;
  userId: string;
  configuration: any;
}) {
  try {
    const now = new Date();
    return await db.insert(agent).values({
      name,
      description,
      userId,
      configuration,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error('Failed to create agent in database');
    throw error;
  }
}

export async function getAgentById({ id }: { id: string }) {
  try {
    const [selectedAgent] = await db.select().from(agent).where(eq(agent.id, id));
    return selectedAgent;
  } catch (error) {
    console.error('Failed to get agent by id from database');
    throw error;
  }
}

export async function getAgentsByUserId({ userId }: { userId: string }) {
  try {
    return await db
      .select()
      .from(agent)
      .where(eq(agent.userId, userId))
      .orderBy(desc(agent.updatedAt));
  } catch (error) {
    console.error('Failed to get agents by user id from database');
    throw error;
  }
}

export async function updateAgent({
  id,
  name,
  description,
  configuration,
  status,
  visibility,
}: {
  id: string;
  name?: string;
  description?: string;
  configuration?: any;
  status?: 'active' | 'inactive' | 'error';
  visibility?: 'public' | 'private';
}) {
  try {
    const updateData: Partial<Agent> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (configuration !== undefined) updateData.configuration = configuration;
    if (status !== undefined) updateData.status = status;
    if (visibility !== undefined) updateData.visibility = visibility;

    return await db.update(agent).set(updateData).where(eq(agent.id, id));
  } catch (error) {
    console.error('Failed to update agent in database');
    throw error;
  }
}

export async function deleteAgentById({ id }: { id: string }) {
  try {
    // Delete related records first
    await db.delete(agentMemory).where(eq(agentMemory.agentId, id));
    await db.delete(attestation).where(eq(attestation.agentId, id));
    await db.delete(agentExecution).where(eq(agentExecution.agentId, id));
    await db.delete(agentTool).where(eq(agentTool.agentId, id));
    await db.delete(agentModel).where(eq(agentModel.agentId, id));
    
    // Then delete the agent
    return await db.delete(agent).where(eq(agent.id, id));
  } catch (error) {
    console.error('Failed to delete agent from database');
    throw error;
  }
}

// Model operations
export async function getModels() {
  try {
    return await db.select().from(model);
  } catch (error) {
    console.error('Failed to get models from database');
    throw error;
  }
}

export async function associateModelWithAgent({
  agentId,
  modelId,
  isDefault = false,
}: {
  agentId: string;
  modelId: string;
  isDefault?: boolean;
}) {
  try {
    return await db.insert(agentModel).values({
      agentId,
      modelId,
      isDefault,
    });
  } catch (error) {
    console.error('Failed to associate model with agent in database');
    throw error;
  }
}

// Tool operations
export async function getTools() {
  try {
    return await db.select().from(tool);
  } catch (error) {
    console.error('Failed to get tools from database');
    throw error;
  }
}

export async function associateToolWithAgent({
  agentId,
  toolId,
  configuration,
}: {
  agentId: string;
  toolId: string;
  configuration?: any;
}) {
  try {
    return await db.insert(agentTool).values({
      agentId,
      toolId,
      configuration,
    });
  } catch (error) {
    console.error('Failed to associate tool with agent in database');
    throw error;
  }
}

// Agent execution operations
export async function createAgentExecution({
  agentId,
  input,
}: {
  agentId: string;
  input?: any;
}) {
  try {
    return await db.insert(agentExecution).values({
      agentId,
      startedAt: new Date(),
      status: 'running',
      input,
    });
  } catch (error) {
    console.error('Failed to create agent execution in database');
    throw error;
  }
}

export async function updateAgentExecution({
  id,
  status,
  output,
  error,
  metrics,
}: {
  id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  output?: any;
  error?: string;
  metrics?: any;
}) {
  try {
    const updateData: Partial<AgentExecution> = {
      status,
    };

    if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      updateData.completedAt = new Date();
    }

    if (output !== undefined) updateData.output = output;
    if (error !== undefined) updateData.error = error;
    if (metrics !== undefined) updateData.metrics = metrics;

    return await db.update(agentExecution).set(updateData).where(eq(agentExecution.id, id));
  } catch (error) {
    console.error('Failed to update agent execution in database');
    throw error;
  }
}

// Agent memory operations
export async function saveAgentMemory({
  agentId,
  key,
  value,
  expiresAt,
}: {
  agentId: string;
  key: string;
  value: any;
  expiresAt?: Date;
}) {
  try {
    return await db.insert(agentMemory).values({
      agentId,
      key,
      value,
      createdAt: new Date(),
      expiresAt,
    });
  } catch (error) {
    console.error('Failed to save agent memory in database');
    throw error;
  }
}

export async function getAgentMemory({
  agentId,
  key,
}: {
  agentId: string;
  key?: string;
}) {
  try {
    // Build the where condition based on parameters
    const whereCondition = key 
      ? and(eq(agentMemory.agentId, agentId), eq(agentMemory.key, key))
      : eq(agentMemory.agentId, agentId);
    
    return await db
      .select()
      .from(agentMemory)
      .where(whereCondition);
  } catch (error) {
    console.error('Failed to get agent memory from database');
    throw error;
  }
}

// Attestation operations
export async function createAttestation({
  agentId,
  type,
  issuer,
  subject,
  data,
  signature,
  expiresAt,
}: {
  agentId: string;
  type: 'identity' | 'capability' | 'performance' | 'compliance';
  issuer: string;
  subject: string;
  data: any;
  signature: string;
  expiresAt?: Date;
}) {
  try {
    return await db.insert(attestation).values({
      agentId,
      type,
      issuer,
      subject,
      data,
      signature,
      createdAt: new Date(),
      expiresAt,
    });
  } catch (error) {
    console.error('Failed to create attestation in database');
    throw error;
  }
}

export async function getAttestationsByAgentId({
  agentId,
  type,
}: {
  agentId: string;
  type?: 'identity' | 'capability' | 'performance' | 'compliance';
}) {
  try {
    // Build the where condition based on parameters
    const whereCondition = type
      ? and(eq(attestation.agentId, agentId), eq(attestation.revoked, false), eq(attestation.type, type))
      : and(eq(attestation.agentId, agentId), eq(attestation.revoked, false));
    
    return await db
      .select()
      .from(attestation)
      .where(whereCondition);
  } catch (error) {
    console.error('Failed to get attestations by agent id from database');
    throw error;
  }
}

export async function revokeAttestation({ id }: { id: string }) {
  try {
    return await db.update(attestation)
      .set({ revoked: true })
      .where(eq(attestation.id, id));
  } catch (error) {
    console.error('Failed to revoke attestation in database');
    throw error;
  }
}
