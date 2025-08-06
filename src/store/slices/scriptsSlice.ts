import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Script {
  id: string;
  title: string;
  description?: string;
  content: string;
  templateType: 'U-102' | 'U-103' | 'U-106' | 'U-107' | 'U-301';
  status: 'draft' | 'testing' | 'approved' | 'failed';
  version: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
}

interface ScriptsState {
  scripts: Script[];
  currentScript: Script | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    templateType?: string;
    status?: string;
    tags?: string[];
  };
  searchQuery: string;
}

const initialState: ScriptsState = {
  scripts: [],
  currentScript: null,
  isLoading: false,
  error: null,
  filters: {},
  searchQuery: '',
};

export const scriptsSlice = createSlice({
  name: 'scripts',
  initialState,
  reducers: {
    setScripts: (state, action: PayloadAction<Script[]>) => {
      state.scripts = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addScript: (state, action: PayloadAction<Script>) => {
      state.scripts.unshift(action.payload);
    },
    updateScript: (state, action: PayloadAction<Script>) => {
      const index = state.scripts.findIndex(script => script.id === action.payload.id);
      if (index !== -1) {
        state.scripts[index] = action.payload;
      }
      if (state.currentScript?.id === action.payload.id) {
        state.currentScript = action.payload;
      }
    },
    deleteScript: (state, action: PayloadAction<string>) => {
      state.scripts = state.scripts.filter(script => script.id !== action.payload);
      if (state.currentScript?.id === action.payload) {
        state.currentScript = null;
      }
    },
    setCurrentScript: (state, action: PayloadAction<Script | null>) => {
      state.currentScript = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ScriptsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setScripts,
  addScript,
  updateScript,
  deleteScript,
  setCurrentScript,
  setLoading,
  setError,
  clearError,
  setFilters,
  setSearchQuery,
} = scriptsSlice.actions;

export default scriptsSlice.reducer;