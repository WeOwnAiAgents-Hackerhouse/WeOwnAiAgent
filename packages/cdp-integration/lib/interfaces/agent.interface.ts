import { DataSourceMetadata } from './data-source.interface';

export enum AgentKind {
  ASSISTANT = 'assistant',
  CHATBOT = 'chatbot',
  SEARCH = 'search',
  CUSTOM = 'custom'
}

export enum DeploymentStatus {
  DRAFT = 'draft',
  TESTING = 'testing',
  DEPLOYED = 'deployed',
  ARCHIVED = 'archived'
}

export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  kind: AgentKind;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  isPublic: boolean;
  deploymentStatus: DeploymentStatus;
  modelProvider: string;
  modelId: string;
  version: string;
}

export interface AgentTool {
  name: string;
  description: string;
  type: 'function' | 'retrieval' | 'action';
  parameters?: Record<string, any>;
  function?: string; // Function source code or reference
}

export interface ModelParameters {
  temperature: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  [key: string]: any; // Allow provider-specific parameters
}

export interface AgentConfig {
  id: string;
  agentId: string;
  systemPrompt: string;
  tools: AgentTool[];
  dataSources: string[]; // IDs of linked data sources
  parameters: ModelParameters;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAgentService {
  createAgent(data: Partial<AgentMetadata>): Promise<AgentMetadata>;
  getAgentById(id: string): Promise<AgentMetadata | null>;
  getAllAgents(ownerId: string): Promise<AgentMetadata[]>;
  updateAgent(id: string, updates: Partial<AgentMetadata>): Promise<AgentMetadata>;
  deleteAgent(id: string): Promise<boolean>;
  getAgentConfig(agentId: string): Promise<AgentConfig | null>;
  updateAgentConfig(agentId: string, updates: Partial<AgentConfig>): Promise<AgentConfig>;
  linkDataSource(agentId: string, dataSourceId: string): Promise<AgentConfig>;
  unlinkDataSource(agentId: string, dataSourceId: string): Promise<AgentConfig>;
  addTool(agentId: string, tool: AgentTool): Promise<AgentConfig>;
  removeTool(agentId: string, toolName: string): Promise<AgentConfig>;
  getLinkedDataSources(agentId: string): Promise<DataSourceMetadata[]>;
} 