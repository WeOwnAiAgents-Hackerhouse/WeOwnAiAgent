export enum DeploymentEnvironment {
  DEV = 'dev',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

export enum DeploymentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FAILED = 'failed',
  DEPLOYING = 'deploying'
}

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetConcurrency: number;
}

export interface AuthConfig {
  required: boolean;
  method?: 'api_key' | 'oauth' | 'jwt';
  allowedOrigins?: string[];
  allowedUsers?: string[];
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  burstSize: number;
}

export interface DeploymentConfig {
  environment: DeploymentEnvironment;
  scaling: ScalingConfig;
  authentication: AuthConfig;
  rateLimit?: RateLimitConfig;
  customDomain?: string;
  version: string;
}

export interface Deployment {
  id: string;
  agentId: string;
  status: DeploymentStatus;
  url?: string;
  deployedAt: Date;
  config: DeploymentConfig;
  error?: string;
  metrics?: {
    uptime: number;
    requestCount: number;
    errorCount: number;
    averageLatency: number;
  };
}

export interface IDeploymentService {
  deployAgent(agentId: string, config: Partial<DeploymentConfig>): Promise<Deployment>;
  getDeploymentStatus(agentId: string): Promise<Deployment | null>;
  updateDeployment(deploymentId: string, updates: Partial<DeploymentConfig>): Promise<Deployment>;
  deactivateDeployment(deploymentId: string): Promise<boolean>;
  activateDeployment(deploymentId: string): Promise<boolean>;
  getDeploymentHistory(agentId: string): Promise<Deployment[]>;
  rollbackDeployment(agentId: string, version: string): Promise<Deployment>;
} 