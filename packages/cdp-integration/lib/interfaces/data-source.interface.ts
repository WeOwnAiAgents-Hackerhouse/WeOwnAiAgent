export enum DataSourceType {
  DOCUMENT = 'document',
  DATABASE = 'database',
  API = 'api',
  VECTOR_STORE = 'vector_store',
  WEB_CONTENT = 'web_content'
}

export interface DataSourceMetadata {
  id: string;
  name: string;
  description?: string;
  type: DataSourceType;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  size?: number; // in bytes if applicable
  format?: string; // file type or data format
  status: 'processing' | 'ready' | 'error';
  error?: string;
}

export interface DataSourceConfig {
  // Base config all sources share
  connectionSettings: Record<string, any>;
  
  // Optional configurations
  authentication?: {
    type: 'none' | 'basic' | 'oauth' | 'api_key';
    credentials?: Record<string, string>;
  };
  refreshSettings?: {
    enabled: boolean;
    interval?: number; // in minutes
    lastRefreshed?: Date;
  };
}

export interface IDataSource {
  getMetadata(): DataSourceMetadata;
  getConfig(): DataSourceConfig;
  validate(): Promise<boolean>;
  refresh(): Promise<boolean>;
  delete(): Promise<boolean>;
}

export interface IDocumentDataSource extends IDataSource {
  getContent(): Promise<string>;
  getChunks(): Promise<string[]>;
}

export interface IDatabaseDataSource extends IDataSource {
  query(query: string): Promise<Record<string, any>[]>;
  getTables(): Promise<string[]>;
  getSchema(table: string): Promise<Record<string, string>>;
}

export interface IVectorDataSource extends IDataSource {
  search(query: string, limit?: number): Promise<any[]>;
  getNamespace(): string;
}

export interface IDataSourceService {
  createSource(data: Partial<DataSourceMetadata>, config: Partial<DataSourceConfig>): Promise<IDataSource>;
  getSourceById(id: string): Promise<IDataSource | null>;
  getAllSources(ownerId: string): Promise<DataSourceMetadata[]>;
  deleteSource(id: string): Promise<boolean>;
  uploadFile(file: File, name: string, description?: string): Promise<IDataSource>;
  addUrlSource(url: string, name: string, options?: any): Promise<IDataSource>;
  addDatabaseSource(connectionString: string, name: string, options?: any): Promise<IDataSource>;
  addVectorStore(config: any, name: string): Promise<IDataSource>;
} 