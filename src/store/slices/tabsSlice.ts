import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Tab {
  id: string;
  title: string;
  content: string;
  type: 'script' | 'template' | 'test';
  resourceId?: string;
  isActive: boolean;
  isDirty: boolean;
  isReadOnly: boolean;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
  maxTabs: number;
}

const initialState: TabsState = {
  tabs: [],
  activeTabId: null,
  maxTabs: 10,
};

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<Omit<Tab, 'isActive'>>) => {
      // Close oldest tab if max limit reached
      if (state.tabs.length >= state.maxTabs) {
        const oldestInactiveTab = state.tabs.find(tab => !tab.isActive);
        if (oldestInactiveTab) {
          state.tabs = state.tabs.filter(tab => tab.id !== oldestInactiveTab.id);
        }
      }
      
      // Set all tabs to inactive
      state.tabs.forEach(tab => { tab.isActive = false; });
      
      // Add new tab as active
      const newTab = { ...action.payload, isActive: true };
      state.tabs.push(newTab);
      state.activeTabId = newTab.id;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const tabIndex = state.tabs.findIndex(tab => tab.id === action.payload);
      if (tabIndex !== -1) {
        const wasActive = state.tabs[tabIndex].isActive;
        state.tabs.splice(tabIndex, 1);
        
        if (wasActive && state.tabs.length > 0) {
          // Activate next tab or previous if at end
          const newActiveIndex = tabIndex < state.tabs.length ? tabIndex : tabIndex - 1;
          if (newActiveIndex >= 0) {
            state.tabs[newActiveIndex].isActive = true;
            state.activeTabId = state.tabs[newActiveIndex].id;
          }
        } else if (state.tabs.length === 0) {
          state.activeTabId = null;
        }
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.tabs.forEach(tab => {
        tab.isActive = tab.id === action.payload;
      });
      state.activeTabId = action.payload;
    },
    updateTab: (state, action: PayloadAction<{ id: string; changes: Partial<Tab> }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.id);
      if (tab) {
        Object.assign(tab, action.payload.changes);
      }
    },
    updateTabTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.id);
      if (tab) {
        tab.title = action.payload.title;
      }
    },
    setTabDirty: (state, action: PayloadAction<{ id: string; isDirty: boolean }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.id);
      if (tab) {
        tab.isDirty = action.payload.isDirty;
      }
    },
  },
});

export const {
  addTab,
  removeTab,
  setActiveTab,
  updateTab,
  updateTabTitle,
  setTabDirty,
} = tabsSlice.actions;

export default tabsSlice.reducer;