import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  permissions?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt?: string;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
};

// localStorage 안전하게 사용하는 헬퍼 함수
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch {
      // 무시
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch {
      // 무시
    }
  },
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const storedTokens = safeLocalStorage.getItem('auth_tokens');
      const storedUser = safeLocalStorage.getItem('auth_user');
      
      if (storedTokens && storedUser) {
        const tokens = JSON.parse(storedTokens);
        const user = JSON.parse(storedUser);
        
        // 토큰 만료 확인
        if (tokens.expiresAt && new Date(tokens.expiresAt) < new Date()) {
          safeLocalStorage.removeItem('auth_tokens');
          safeLocalStorage.removeItem('auth_user');
          throw new Error('Token expired');
        }
        
        return { user, tokens };
      }
      
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Auth initialization failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      const { user, tokens } = action.payload;
      state.user = user;
      state.tokens = tokens;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.loginAttempts = 0;
      
      // 로컬 스토리지에 안전하게 저장
      safeLocalStorage.setItem('auth_tokens', JSON.stringify(tokens));
      safeLocalStorage.setItem('auth_user', JSON.stringify(user));
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        safeLocalStorage.setItem('auth_user', JSON.stringify(state.user));
      }
    },
    
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      safeLocalStorage.setItem('auth_tokens', JSON.stringify(action.payload));
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.loginAttempts += 1;
      state.lastLoginAttempt = new Date().toISOString();
    },
    
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.loginAttempts = 0;
      state.lastLoginAttempt = undefined;
      
      // 로컬 스토리지 안전하게 정리
      safeLocalStorage.removeItem('auth_tokens');
      safeLocalStorage.removeItem('auth_user');
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = undefined;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.tokens = action.payload.tokens;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const {
  setCredentials,
  updateUser,
  updateTokens,
  setLoading,
  setError,
  logout,
  clearError,
  resetLoginAttempts,
} = authSlice.actions;

export default authSlice.reducer;