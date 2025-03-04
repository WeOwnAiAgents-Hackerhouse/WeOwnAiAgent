export enum TrainingStatus {
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELED = 'canceled'
}

export interface TrainingMetrics {
  accuracy?: number;
  f1Score?: number;
  precision?: number;
  recall?: number;
  customMetrics?: Record<string, number>;
}

export interface TrainingSession {
  id: string;
  agentId: string;
  status: TrainingStatus;
  progress: number; // 0-100
  metrics: TrainingMetrics;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  config?: Record<string, any>; // Training-specific configuration
}

export interface TrainingOptions {
  dataset?: string; // Optional dataset ID to use
  epochs?: number;
  batchSize?: number;
  optimizerConfig?: Record<string, any>;
  validateOnComplete?: boolean;
  [key: string]: any; // Additional provider-specific options
}

export interface ITrainingService {
  startTraining(agentId: string, options?: TrainingOptions): Promise<TrainingSession>;
  getTrainingStatus(agentId: string, sessionId: string): Promise<TrainingSession>;
  cancelTraining(agentId: string, sessionId: string): Promise<boolean>;
  getTrainingHistory(agentId: string): Promise<TrainingSession[]>;
  getLatestTrainingSession(agentId: string): Promise<TrainingSession | null>;
} 