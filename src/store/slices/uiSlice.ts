import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: number;
  persistent?: boolean;
}

interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  loading: Record<string, boolean>;
  modals: Record<string, boolean>;
  fullscreenLoading: boolean;
  currentPage?: string;
}

const initialState: UIState = {
  theme: 'dark',
  sidebarCollapsed: false,
  notifications: [],
  loading: {},
  modals: {},
  fullscreenLoading: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      if (isLoading) {
        state.loading[key] = true;
      } else {
        delete state.loading[key];
      }
    },
    setModal: (state, action: PayloadAction<{ key: string; isOpen: boolean }>) => {
      const { key, isOpen } = action.payload;
      if (isOpen) {
        state.modals[key] = true;
      } else {
        delete state.modals[key];
      }
    },
    setFullscreenLoading: (state, action: PayloadAction<boolean>) => {
      state.fullscreenLoading = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setModal,
  setFullscreenLoading,
  setCurrentPage,
} = uiSlice.actions;

export default uiSlice.reducer;