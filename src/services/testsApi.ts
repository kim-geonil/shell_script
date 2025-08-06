import { api } from './api';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  scriptId: string;
  input: Record<string, any>;
  expectedOutput?: string;
  expectedExitCode?: number;
  timeout?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  scriptId: string;
  testCases: TestCase[];
  schedule?: {
    enabled: boolean;
    cron: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TestExecution {
  id: string;
  testSuiteId: string;
  scriptId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    coverage: number;
  };
  environment: string;
  triggeredBy: string;
  logs: string[];
}

export interface TestResult {
  id: string;
  testCaseId: string;
  status: 'pass' | 'fail' | 'skip';
  output: string;
  errorMessage?: string;
  actualExitCode: number;
  duration: number;
  assertions: {
    name: string;
    status: 'pass' | 'fail';
    message?: string;
  }[];
}

export interface CreateTestCaseRequest {
  name: string;
  description: string;
  scriptId: string;
  input: Record<string, any>;
  expectedOutput?: string;
  expectedExitCode?: number;
  timeout?: number;
  tags: string[];
}

export interface CreateTestSuiteRequest {
  name: string;
  description: string;
  scriptId: string;
  testCaseIds: string[];
  schedule?: TestSuite['schedule'];
}

export interface RunTestRequest {
  testSuiteId?: string;
  testCaseIds?: string[];
  scriptId: string;
  environment?: string;
  parameters?: Record<string, any>;
}

export const testsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTestSuites: builder.query<{
      testSuites: TestSuite[];
      total: number;
      page: number;
      pageSize: number;
    }, {
      page?: number;
      pageSize?: number;
      scriptId?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/tests/suites',
        params,
      }),
      providesTags: ['Tests'],
    }),
    
    getTestSuiteById: builder.query<TestSuite, string>({
      query: (id) => `/tests/suites/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tests', id }],
    }),
    
    createTestSuite: builder.mutation<TestSuite, CreateTestSuiteRequest>({
      query: (testSuite) => ({
        url: '/tests/suites',
        method: 'POST',
        body: testSuite,
      }),
      invalidatesTags: ['Tests'],
    }),
    
    updateTestSuite: builder.mutation<TestSuite, { id: string } & Partial<CreateTestSuiteRequest>>({
      query: ({ id, ...testSuite }) => ({
        url: `/tests/suites/${id}`,
        method: 'PUT',
        body: testSuite,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Tests',
        { type: 'Tests', id },
      ],
    }),
    
    deleteTestSuite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tests/suites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        'Tests',
        { type: 'Tests', id },
      ],
    }),
    
    getTestCases: builder.query<{
      testCases: TestCase[];
      total: number;
    }, {
      scriptId?: string;
      testSuiteId?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/tests/cases',
        params,
      }),
      providesTags: ['Tests'],
    }),
    
    createTestCase: builder.mutation<TestCase, CreateTestCaseRequest>({
      query: (testCase) => ({
        url: '/tests/cases',
        method: 'POST',
        body: testCase,
      }),
      invalidatesTags: ['Tests'],
    }),
    
    updateTestCase: builder.mutation<TestCase, { id: string } & Partial<CreateTestCaseRequest>>({
      query: ({ id, ...testCase }) => ({
        url: `/tests/cases/${id}`,
        method: 'PUT',
        body: testCase,
      }),
      invalidatesTags: ['Tests'],
    }),
    
    deleteTestCase: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tests/cases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tests'],
    }),
    
    runTests: builder.mutation<TestExecution, RunTestRequest>({
      query: (request) => ({
        url: '/tests/run',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Tests'],
    }),
    
    getTestExecutions: builder.query<{
      executions: TestExecution[];
      total: number;
      page: number;
      pageSize: number;
    }, {
      page?: number;
      pageSize?: number;
      scriptId?: string;
      status?: TestExecution['status'][];
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: '/tests/executions',
        params,
      }),
      providesTags: ['Tests'],
    }),
    
    getTestExecutionById: builder.query<TestExecution, string>({
      query: (id) => `/tests/executions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tests', id: `execution-${id}` }],
    }),
    
    cancelTestExecution: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tests/executions/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        'Tests',
        { type: 'Tests', id: `execution-${id}` },
      ],
    }),
    
    getTestLogs: builder.query<{ logs: string[] }, string>({
      query: (executionId) => `/tests/executions/${executionId}/logs`,
    }),
    
    getTestMetrics: builder.query<{
      totalTests: number;
      passRate: number;
      failRate: number;
      avgDuration: number;
      trendsData: {
        date: string;
        passed: number;
        failed: number;
        total: number;
      }[];
      coverageData: {
        scriptId: string;
        scriptName: string;
        coverage: number;
      }[];
    }, {
      scriptId?: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: '/tests/metrics',
        params,
      }),
    }),
    
    downloadTestReport: builder.query<Blob, {
      executionId: string;
      format: 'pdf' | 'html' | 'json';
    }>({
      query: ({ executionId, format }) => ({
        url: `/tests/executions/${executionId}/report`,
        params: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetTestSuitesQuery,
  useGetTestSuiteByIdQuery,
  useCreateTestSuiteMutation,
  useUpdateTestSuiteMutation,
  useDeleteTestSuiteMutation,
  useGetTestCasesQuery,
  useCreateTestCaseMutation,
  useUpdateTestCaseMutation,
  useDeleteTestCaseMutation,
  useRunTestsMutation,
  useGetTestExecutionsQuery,
  useGetTestExecutionByIdQuery,
  useCancelTestExecutionMutation,
  useGetTestLogsQuery,
  useGetTestMetricsQuery,
  useLazyDownloadTestReportQuery,
} = testsApi;