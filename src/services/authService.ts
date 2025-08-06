import { api } from './api';

// 인증 관련 API 타입 정의
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    permissions?: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
  };
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
  };
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// Auth API endpoints
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: ({ refreshToken }) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),

    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),

    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: ({ token, ...passwords }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: passwords,
      }),
    }),

    getCurrentUser: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    updateProfile: builder.mutation<LoginResponse['user'], Partial<LoginResponse['user']>>({
      query: (updates) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Auth'],
    }),

    changePassword: builder.mutation<{ message: string }, { 
      currentPassword: string; 
      newPassword: string; 
      confirmPassword: string; 
    }>({
      query: (passwords) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),

    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: ({ token }) => ({
        url: `/auth/verify-email/${token}`,
        method: 'POST',
      }),
    }),

    resendVerification: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/resend-verification',
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;

// Auth utility functions
export const authService = {
  // 로컬 스토리지에서 토큰 가져오기
  getStoredTokens: () => {
    try {
      const tokens = localStorage.getItem('auth_tokens');
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  },

  // 로컬 스토리지에서 사용자 정보 가져오기
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // 토큰 만료 확인
  isTokenExpired: (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) <= new Date();
  },

  // 자동 로그인 가능 여부 확인
  canAutoLogin: () => {
    const tokens = authService.getStoredTokens();
    const user = authService.getStoredUser();
    
    return !!(
      tokens && 
      user && 
      tokens.accessToken && 
      !authService.isTokenExpired(tokens.expiresAt)
    );
  },

  // 인증 데이터 정리
  clearAuthData: () => {
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_session');
  },

  // 권한 확인
  hasPermission: (user: LoginResponse['user'] | null, permission: string) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  },

  // 역할 확인
  hasRole: (user: LoginResponse['user'] | null, role: string) => {
    if (!user) return false;
    return user.role === role;
  },
};