import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 기본 쿼리 함수
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    headers.set('content-type', 'application/json');
    
    // 토큰이 있으면 추가
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    
    return headers;
  },
});

// API 정의
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Scripts', 'Templates', 'Tests', 'Auth', 'User', 'AssetTypes', 'Products', 'InspectionItems', 'AdminStats'],
  endpoints: (builder) => ({
    // Health check
    ping: builder.query<{ message: string; timestamp: string }, void>({
      query: () => '/ping',
    }),
    
    // Auth endpoints - 추후 구현 예정
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    // Scripts endpoints - 추후 구현 예정
    getScripts: builder.query<any[], void>({
      query: () => '/scripts',
      providesTags: ['Scripts'],
    }),
    
    // Templates endpoints - 추후 구현 예정
    getTemplates: builder.query<any[], void>({
      query: () => '/templates',
      providesTags: ['Templates'],
    }),
  }),
});

// Export hooks
export const { 
  usePingQuery,
  useLoginMutation,
  useGetScriptsQuery,
  useGetTemplatesQuery,
} = api;

// Export default
export default api;