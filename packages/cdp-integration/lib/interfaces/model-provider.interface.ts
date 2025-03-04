export enum ModelCapability {
  TEXT_GENERATION = 'text_generation',
  CHAT = 'chat',
  EMBEDDING = 'embedding',
  IMAGE_GENERATION = 'image_generation',
  FINE_TUNING = 'fine_tuning',
  RAG = 'rag'
}

export interface ModelInfo {
  id: string;
  provider: string;
  name: string;
  capabilities: ModelCapability[];
  maxTokens: number;
  pricing?: {
    inputTokens: number; // per 1000 tokens
    outputTokens: number; // per 1000 tokens
  };
  defaultParameters?: Record<string, any>;
}

export interface IModelProvider {
  getName(): string;
  getModels(): Promise<ModelInfo[]>;
  getModelById(id: string): Promise<ModelInfo | null>;
  generateText(modelId: string, prompt: string, parameters?: Record<string, any>): Promise<string>;
  generateChatResponse(modelId: string, messages: any[], parameters?: Record<string, any>): Promise<any>;
  createEmbedding(modelId: string, text: string): Promise<number[]>;
  supportsCapability(modelId: string, capability: ModelCapability): Promise<boolean>;
  getTokenCount(text: string): number;
}

export interface IModelProviderRegistry {
  registerProvider(provider: IModelProvider): void;
  getProvider(name: string): IModelProvider | null;
  getAllProviders(): IModelProvider[];
  getModelById(providerId: string, modelId: string): Promise<ModelInfo | null>;
  getAllModels(): Promise<ModelInfo[]>;
} 