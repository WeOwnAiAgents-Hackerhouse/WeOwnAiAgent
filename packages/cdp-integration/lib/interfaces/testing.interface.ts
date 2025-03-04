export interface TestCase {
  id: string;
  agentId: string;
  input: string;
  expectedOutput?: string;
  tags: string[];
  createdAt: Date;
}

export interface TestResult {
  id: string;
  testCaseId: string;
  agentId: string;
  output: string;
  success: boolean;
  similarity?: number; // Similarity score between expected and actual output
  latency?: number; // Response time in ms
  feedback?: string;
  metrics?: Record<string, number>;
  createdAt: Date;
}

export interface TestOptions {
  timeout?: number; // Timeout in ms
  similarityThreshold?: number; // Threshold for determining success based on similarity
  saveHistory?: boolean;
}

export interface TestSuite {
  id: string;
  agentId: string;
  name: string;
  description?: string;
  testCaseIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestingService {
  createTestCase(agentId: string, input: string, expectedOutput?: string, tags?: string[]): Promise<TestCase>;
  getTestCases(agentId: string): Promise<TestCase[]>;
  deleteTestCase(testCaseId: string): Promise<boolean>;
  runTest(agentId: string, input: string, options?: TestOptions): Promise<TestResult>;
  runTestCase(testCaseId: string, options?: TestOptions): Promise<TestResult>;
  runTestSuite(testSuiteId: string, options?: TestOptions): Promise<TestResult[]>;
  getTestResults(agentId: string, limit?: number): Promise<TestResult[]>;
  createTestSuite(agentId: string, name: string, testCaseIds: string[]): Promise<TestSuite>;
  getTestSuites(agentId: string): Promise<TestSuite[]>;
} 