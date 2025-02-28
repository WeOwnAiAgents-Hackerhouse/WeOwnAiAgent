import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  password: varchar('password', { length: 255 }),
  image: varchar('image', { length: 255 }),
  walletAddress: varchar('walletAddress', { length: 255 }).unique(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export const account = pgTable('Account', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: timestamp('expires_at', { mode: 'date' }),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (table) => {
  return {
    providerProviderAccountIdKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  };
});

export type Account = InferSelectModel<typeof account>;

export const session = pgTable('Session', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  sessionToken: varchar('sessionToken', { length: 255 }).notNull().unique(),
});

export type Session = InferSelectModel<typeof session>;

export const verificationToken = pgTable('VerificationToken', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => {
  return {
    compoundKey: primaryKey({
      columns: [table.identifier, table.token],
    }),
  };
});

export type VerificationToken = InferSelectModel<typeof verificationToken>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  title: varchar('title', { length: 255 }).notNull(),
  userId: uuid('userId').notNull().references(() => user.id),
  visibility: varchar('visibility', { length: 255 }).notNull().default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  content: text('content').notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  chatId: uuid('chatId').notNull().references(() => chat.id, { onDelete: 'cascade' }),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const agent = pgTable('Agent', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  configuration: json('configuration').notNull(),
  status: varchar('status', { enum: ['active', 'inactive', 'error'] })
    .notNull()
    .default('inactive'),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Agent = InferSelectModel<typeof agent>;

export const model = pgTable('Model', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  provider: text('provider').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  capabilities: json('capabilities').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Model = InferSelectModel<typeof model>;

export const agentModel = pgTable(
  'AgentModel',
  {
    agentId: uuid('agentId')
      .notNull()
      .references(() => agent.id),
    modelId: uuid('modelId')
      .notNull()
      .references(() => model.id),
    isDefault: boolean('isDefault').notNull().default(false),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.agentId, table.modelId] }),
    };
  },
);

export type AgentModel = InferSelectModel<typeof agentModel>;

export const tool = pgTable('Tool', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  type: varchar('type', { 
    enum: ['blockchain', 'wallet', 'api', 'database', 'custom'] 
  }).notNull(),
  schema: json('schema').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Tool = InferSelectModel<typeof tool>;

export const agentTool = pgTable(
  'AgentTool',
  {
    agentId: uuid('agentId')
      .notNull()
      .references(() => agent.id),
    toolId: uuid('toolId')
      .notNull()
      .references(() => tool.id),
    configuration: json('configuration'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.agentId, table.toolId] }),
    };
  },
);

export type AgentTool = InferSelectModel<typeof agentTool>;

export const agentExecution = pgTable('AgentExecution', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  agentId: uuid('agentId')
    .notNull()
    .references(() => agent.id),
  startedAt: timestamp('startedAt').notNull(),
  completedAt: timestamp('completedAt'),
  status: varchar('status', { 
    enum: ['running', 'completed', 'failed', 'cancelled'] 
  }).notNull(),
  input: json('input'),
  output: json('output'),
  error: text('error'),
  metrics: json('metrics'),
});

export type AgentExecution = InferSelectModel<typeof agentExecution>;

export const agentMemory = pgTable('AgentMemory', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  agentId: uuid('agentId')
    .notNull()
    .references(() => agent.id),
  key: text('key').notNull(),
  value: json('value').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  expiresAt: timestamp('expiresAt'),
});

export type AgentMemory = InferSelectModel<typeof agentMemory>;

export const attestation = pgTable('Attestation', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  agentId: uuid('agentId')
    .notNull()
    .references(() => agent.id),
  type: varchar('type', { 
    enum: ['identity', 'capability', 'performance', 'compliance'] 
  }).notNull(),
  issuer: text('issuer').notNull(),
  subject: text('subject').notNull(),
  data: json('data').notNull(),
  signature: text('signature').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  expiresAt: timestamp('expiresAt'),
  revoked: boolean('revoked').notNull().default(false),
});

export type Attestation = InferSelectModel<typeof attestation>;
