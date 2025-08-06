import { api } from './api';
import type { Template } from '../store/slices/templatesSlice';

export interface CreateTemplateRequest {
  name: string;
  description: string;
  type: 'U-102' | 'U-103' | 'U-106' | 'U-107' | 'U-301';
  category: 'security-compliance' | 'system-audit' | 'user-management';
  content: string;
  fields: Template['fields'];
  tags: string[];
}

export interface UpdateTemplateRequest extends Partial<CreateTemplateRequest> {
  id: string;
}

export interface TemplatesResponse {
  templates: Template[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GenerateScriptRequest {
  templateId: string;
  fields: Record<string, any>;
  options?: {
    includeComments?: boolean;
    includeValidation?: boolean;
    outputFormat?: 'bash' | 'bats';
  };
}

export interface GenerateScriptResponse {
  script: string;
  metadata: {
    templateName: string;
    templateVersion: string;
    generatedAt: string;
    fields: Record<string, any>;
  };
}

export const templatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query<TemplatesResponse, {
      page?: number;
      pageSize?: number;
      search?: string;
      type?: string[];
      category?: string[];
      isOfficial?: boolean;
      tags?: string[];
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>({
      query: (params) => ({
        url: '/templates',
        params,
      }),
      providesTags: ['Templates'],
    }),
    
    getTemplateById: builder.query<Template, string>({
      query: (id) => `/templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Templates', id }],
    }),
    
    createTemplate: builder.mutation<Template, CreateTemplateRequest>({
      query: (template) => ({
        url: '/templates',
        method: 'POST',
        body: template,
      }),
      invalidatesTags: ['Templates'],
    }),
    
    updateTemplate: builder.mutation<Template, UpdateTemplateRequest>({
      query: ({ id, ...template }) => ({
        url: `/templates/${id}`,
        method: 'PUT',
        body: template,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Templates',
        { type: 'Templates', id },
      ],
    }),
    
    deleteTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        'Templates',
        { type: 'Templates', id },
      ],
    }),
    
    generateScript: builder.mutation<GenerateScriptResponse, GenerateScriptRequest>({
      query: (request) => ({
        url: '/templates/generate',
        method: 'POST',
        body: request,
      }),
    }),
    
    validateTemplate: builder.mutation<{ isValid: boolean; errors: string[] }, string>({
      query: (templateId) => ({
        url: `/templates/${templateId}/validate`,
        method: 'POST',
      }),
    }),
    
    getTemplatePreview: builder.query<{ preview: string }, { templateId: string; fields: Record<string, any> }>({
      query: ({ templateId, fields }) => ({
        url: `/templates/${templateId}/preview`,
        method: 'POST',
        body: { fields },
      }),
    }),
    
    duplicateTemplate: builder.mutation<Template, { id: string; name?: string }>({
      query: ({ id, name }) => ({
        url: `/templates/${id}/duplicate`,
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Templates'],
    }),
    
    rateTemplate: builder.mutation<void, { templateId: string; rating: number; comment?: string }>({
      query: ({ templateId, rating, comment }) => ({
        url: `/templates/${templateId}/rate`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { templateId }) => [
        'Templates',
        { type: 'Templates', id: templateId },
      ],
    }),
    
    getTemplateUsageStats: builder.query<{
      usageCount: number;
      rating: number;
      reviews: Template['reviews'];
      recentUsage: { date: string; count: number }[];
    }, string>({
      query: (templateId) => `/templates/${templateId}/stats`,
    }),
    
    exportTemplate: builder.query<Blob, { id: string; format: 'json' | 'yaml' }>({
      query: ({ id, format }) => ({
        url: `/templates/${id}/export`,
        params: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    importTemplate: builder.mutation<Template, { file: File; name?: string }>({
      query: ({ file, name }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (name) formData.append('name', name);
        
        return {
          url: '/templates/import',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['Templates'],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useGenerateScriptMutation,
  useValidateTemplateMutation,
  useGetTemplatePreviewQuery,
  useDuplicateTemplateMutation,
  useRateTemplateMutation,
  useGetTemplateUsageStatsQuery,
  useLazyExportTemplateQuery,
  useImportTemplateMutation,
} = templatesApi;