import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import editorReducer from './slices/editorSlice';
import scriptsReducer from './slices/scriptsSlice';
import tabsReducer from './slices/tabsSlice';
import templatesReducer from './slices/templatesSlice';
import uiReducer from './slices/uiSlice';

console.log('🔧 Configuring Redux Store...');
console.log('🌍 Environment:', import.meta.env.MODE);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    editor: editorReducer,
    scripts: scriptsReducer,
    tabs: tabsReducer,
    templates: templatesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.tokens.expiresAt'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

// Store 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Store 유효성 검증
if (!store) {
  throw new Error('Failed to create Redux store');
}

console.log('✅ Redux Store configured successfully');
console.log('📊 Available reducers:', Object.keys(store.getState()));

export default store;