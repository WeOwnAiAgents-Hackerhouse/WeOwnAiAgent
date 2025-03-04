export enum TimeRange {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

export interface UsageMetrics {
  requestCount: number;
  uniqueUsers: number;
  averageLatency: number;
  errorRate: number;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
  costEstimate?: number;
}

export interface UserFeedback {
  id: string;
  agentId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  interactionId?: string;
  createdAt: Date;
}

export interface MonitoringStats {
  agentId: string;
  period: TimeRange;
  timestamp: Date;
  metrics: UsageMetrics;
}

export interface IMonitoringService {
  getAgentStats(agentId: string, period: TimeRange): Promise<MonitoringStats>;
  getAgentHistory(agentId: string, startDate: Date, endDate: Date): Promise<MonitoringStats[]>;
  getAgentFeedback(agentId: string, limit?: number): Promise<UserFeedback[]>;
  submitFeedback(agentId: string, userId: string, rating: number, comment?: string): Promise<UserFeedback>;
  getErrorLogs(agentId: string, limit?: number): Promise<any[]>;
  getPerformanceAlerts(agentId: string): Promise<any[]>;
} 