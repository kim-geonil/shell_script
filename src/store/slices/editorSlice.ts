import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { EditorTab, EditorSettings } from '../../types/editor';

interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  isFullscreen: boolean;
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
  settings: EditorSettings;
  isLoading: boolean;
  error: string | null;
}

const defaultSettings: EditorSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'SF Mono, Monaco, Consolas, monospace',
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'on',
  minimap: {
    enabled: true,
    side: 'right',
    showSlider: 'mouseover'
  },
  lineNumbers: 'on',
  renderWhitespace: 'selection',
  rulers: [80, 120],
  autoIndent: 'full',
  formatOnSave: true,
  formatOnPaste: true,
  cursorStyle: 'line',
  cursorBlinking: 'blink'
};

const initialState: EditorState = {
  tabs: [],
  activeTabId: null,
  isFullscreen: false,
  theme: 'dark',
  fontSize: 14,
  wordWrap: true,
  minimap: true,
  lineNumbers: true,
  autoSave: true,
  autoSaveDelay: 2000,
  settings: defaultSettings,
  isLoading: false,
  error: null
};

// Async thunks
export const saveTabToServer = createAsyncThunk(
  'editor/saveTabToServer',
  async ({ tabId, content }: { tabId: string; content: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { tabId, savedAt: new Date().toISOString() };
  }
);

export const loadScriptFromServer = createAsyncThunk(
  'editor/loadScriptFromServer',
  async (scriptId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: scriptId,
      title: `Script ${scriptId}`,
      content: '#!/bin/bash\n\n# Loaded script content\necho "Hello World"\n',
      language: 'bash',
      isDirty: false,
      isActive: false,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };
  }
);

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Tab management
    createTab: (state, action: PayloadAction<Omit<EditorTab, 'id'>>) => {
      const newTabId = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Set all existing tabs as inactive
      state.tabs.forEach(tab => {
        tab.isActive = false;
      });

      const newTab: EditorTab = {
        ...action.payload,
        id: newTabId,
        isActive: true
      };

      state.tabs.push(newTab);
      state.activeTabId = newTabId;
    },

    closeTab: (state, action: PayloadAction<string>) => {
      const tabIndex = state.tabs.findIndex(tab => tab.id === action.payload);
      
      if (tabIndex !== -1) {
        const wasActive = state.tabs[tabIndex].isActive;
        state.tabs.splice(tabIndex, 1);

        // If the closed tab was active, activate another tab
        if (wasActive && state.tabs.length > 0) {
          // Activate the previous tab or the first tab if it was the first tab
          const newActiveIndex = tabIndex > 0 ? tabIndex - 1 : 0;
          state.tabs[newActiveIndex].isActive = true;
          state.activeTabId = state.tabs[newActiveIndex].id;
        } else if (state.tabs.length === 0) {
          state.activeTabId = null;
        }
      }
    },

    closeAllTabs: (state) => {
      state.tabs = [];
      state.activeTabId = null;
    },

    setActiveTab: (state, action: PayloadAction<string>) => {
      // Set all tabs as inactive
      state.tabs.forEach(tab => {
        tab.isActive = false;
      });

      // Set the specified tab as active
      const targetTab = state.tabs.find(tab => tab.id === action.payload);
      if (targetTab) {
        targetTab.isActive = true;
        state.activeTabId = action.payload;
      }
    },

    updateTabContent: (state, action: PayloadAction<{
      id: string;
      content: string;
      isDirty?: boolean;
    }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.id);
      if (tab) {
        tab.content = action.payload.content;
        tab.isDirty = action.payload.isDirty ?? true;
        tab.modifiedAt = new Date().toISOString();
      }
    },

    updateTabTitle: (state, action: PayloadAction<{
      id: string;
      title: string;
    }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.id);
      if (tab) {
        tab.title = action.payload.title;
        tab.modifiedAt = new Date().toISOString();
      }
    },

    saveTab: (state, action: PayloadAction<string>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload);
      if (tab) {
        tab.isDirty = false;
        tab.modifiedAt = new Date().toISOString();
      }
    },

    saveAllTabs: (state) => {
      state.tabs.forEach(tab => {
        if (tab.isDirty) {
          tab.isDirty = false;
          tab.modifiedAt = new Date().toISOString();
        }
      });
    },

    duplicateTab: (state, action: PayloadAction<string>) => {
      const sourceTab = state.tabs.find(tab => tab.id === action.payload);
      if (sourceTab) {
        const newTabId = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Set all existing tabs as inactive
        state.tabs.forEach(tab => {
          tab.isActive = false;
        });

        const duplicatedTab: EditorTab = {
          ...sourceTab,
          id: newTabId,
          title: `${sourceTab.title} (복사본)`,
          isActive: true,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        };

        state.tabs.push(duplicatedTab);
        state.activeTabId = newTabId;
      }
    },

    // Editor settings
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },

    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'high-contrast'>) => {
      state.theme = action.payload;
      state.settings.theme = action.payload === 'dark' ? 'vs-dark' : 'vs';
    },

    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
      state.settings.fontSize = action.payload;
    },

    setWordWrap: (state, action: PayloadAction<boolean>) => {
      state.wordWrap = action.payload;
      state.settings.wordWrap = action.payload ? 'on' : 'off';
    },

    setMinimap: (state, action: PayloadAction<boolean>) => {
      state.minimap = action.payload;
      state.settings.minimap.enabled = action.payload;
    },

    setLineNumbers: (state, action: PayloadAction<boolean>) => {
      state.lineNumbers = action.payload;
      state.settings.lineNumbers = action.payload ? 'on' : 'off';
    },

    setAutoSave: (state, action: PayloadAction<boolean>) => {
      state.autoSave = action.payload;
    },

    setAutoSaveDelay: (state, action: PayloadAction<number>) => {
      state.autoSaveDelay = action.payload;
    },

    updateSettings: (state, action: PayloadAction<Partial<EditorSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    // Utility actions
    reorderTabs: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedTab] = state.tabs.splice(fromIndex, 1);
      state.tabs.splice(toIndex, 0, movedTab);
    },

    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // Save tab to server
      .addCase(saveTabToServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveTabToServer.fulfilled, (state, action) => {
        state.isLoading = false;
        const tab = state.tabs.find(tab => tab.id === action.payload.tabId);
        if (tab) {
          tab.isDirty = false;
          tab.modifiedAt = action.payload.savedAt;
        }
      })
      .addCase(saveTabToServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to save tab';
      })

      // Load script from server
      .addCase(loadScriptFromServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadScriptFromServer.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Set all existing tabs as inactive
        state.tabs.forEach(tab => {
          tab.isActive = false;
        });

        const loadedTab: EditorTab = {
          ...action.payload,
          isActive: true
        };

        state.tabs.push(loadedTab);
        state.activeTabId = loadedTab.id;
      })
      .addCase(loadScriptFromServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load script';
      });
  }
});

export const {
  createTab,
  closeTab,
  closeAllTabs,
  setActiveTab,
  updateTabContent,
  updateTabTitle,
  saveTab,
  saveAllTabs,
  duplicateTab,
  setFullscreen,
  toggleFullscreen,
  setTheme,
  setFontSize,
  setWordWrap,
  setMinimap,
  setLineNumbers,
  setAutoSave,
  setAutoSaveDelay,
  updateSettings,
  reorderTabs,
  clearError
} = editorSlice.actions;

export default editorSlice.reducer;