import { api } from './api';
import type { Script } from '../store/slices/scriptsSlice';

export interface CreateScriptRequest {
  name: string;
  description: string;
  content: string;
  templateId?: string;
  templateType?: 'U-102' | 'U-103' | 'U-106' | 'U-107' | 'U-301';
  language: 'bash' | 'bats';
  tags: string[];
}

export interface UpdateScriptRequest extends Partial<CreateScriptRequest> {
  id: string;
}

export interface ScriptsResponse {
  scripts: Script[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ScriptTestRequest {
  scriptId: string;
  environment?: string;
  parameters?: Record<string, any>;
}

export interface ScriptTestResult {
  id: string;
  scriptId: string;
  status: 'pass' | 'fail' | 'pending';
  output: string;
  errors: string[];
  coverage: number;
  duration: number;
  timestamp: string;
}

export const scriptsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getScripts: builder.query<ScriptsResponse, {
      page?: number;
      pageSize?: number;
      search?: string;
      status?: string[];
      templateType?: string[];
      tags?: string[];
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>({
      query: (params) => ({
        url: '/scripts',
        params,
      }),
      providesTags: ['Scripts'],
    }),
    
    getScriptById: builder.query<Script, string>({
      query: (id) => `/scripts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Scripts', id }],
    }),
    
    createScript: builder.mutation<Script, CreateScriptRequest>({
      query: (script) => ({
        url: '/scripts',
        method: 'POST',
        body: script,
      }),
      invalidatesTags: ['Scripts'],
    }),
    
    updateScript: builder.mutation<Script, UpdateScriptRequest>({
      query: ({ id, ...script }) => ({
        url: `/scripts/${id}`,
        method: 'PUT',
        body: script,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Scripts',
        { type: 'Scripts', id },
      ],
    }),
    
    deleteScript: builder.mutation<void, string>({
      query: (id) => ({
        url: `/scripts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        'Scripts',
        { type: 'Scripts', id },
      ],
    }),
    
    duplicateScript: builder.mutation<Script, { id: string; name?: string }>({
      query: ({ id, name }) => ({
        url: `/scripts/${id}/duplicate`,
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Scripts'],
    }),
    
    testScript: builder.mutation<ScriptTestResult, ScriptTestRequest>({
      query: (testRequest) => ({
        url: '/scripts/test',
        method: 'POST',
        body: testRequest,
      }),
    }),
    
    getScriptVersions: builder.query<Script['versions'], string>({
      query: (scriptId) => `/scripts/${scriptId}/versions`,
      providesTags: (result, error, scriptId) => [
        { type: 'Scripts', id: `${scriptId}-versions` },
      ],
    }),
    
    restoreScriptVersion: builder.mutation<Script, { scriptId: string; versionId: string }>({
      query: ({ scriptId, versionId }) => ({
        url: `/scripts/${scriptId}/versions/${versionId}/restore`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { scriptId }) => [
        'Scripts',
        { type: 'Scripts', id: scriptId },
      ],
    }),
    
    exportScript: builder.query<Blob, { id: string; format: 'bash' | 'zip' }>({
      query: ({ id, format }) => ({
        url: `/scripts/${id}/export`,
        params: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    importScript: builder.mutation<Script, { file: File; name?: string }>({
      query: ({ file, name }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (name) formData.append('name', name);
        
        return {
          url: '/scripts/import',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['Scripts'],
    }),
  }),
});

export const {
  useGetScriptsQuery,
  useGetScriptByIdQuery,
  useCreateScriptMutation,
  useUpdateScriptMutation,
  useDeleteScriptMutation,
  useDuplicateScriptMutation,
  useTestScriptMutation,
  useGetScriptVersionsQuery,
  useRestoreScriptVersionMutation,
  useLazyExportScriptQuery,
  useImportScriptMutation,
} = scriptsApi;