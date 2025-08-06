import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "../store";

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth selectors
export const useAuth = () => {
  return useAppSelector((state) => {
    return state?.auth || {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginAttempts: 0
    };
  });
};

// Current user helper
export const useCurrentUser = () => {
  const auth = useAuth();
  return auth.user;
};

// UI selectors  
export const useUI = () => {
  return useAppSelector((state) => state.ui);
};

// Theme selectors
export const useTheme = () => {
  return useAppSelector((state) => state.ui.theme);
};

// Sidebar selectors
export const useSidebarCollapsed = () => {
  return useAppSelector((state) => state.ui.sidebarCollapsed);
};

// Notifications selectors
export const useNotifications = () => {
  return useAppSelector((state) => state.ui.notifications);
};

// Loading selectors
export const useLoading = (key?: string) => {
  return useAppSelector((state) => {
    if (key) {
      return state.ui.loading[key] || false;
    }
    return Object.keys(state.ui.loading).length > 0;
  });
};

// Editor selectors
export const useEditor = () => {
  return useAppSelector((state) => state.editor);
};

// Templates selectors
export const useTemplates = () => {
  return useAppSelector((state) => state.templates);
};

// Scripts selectors
export const useScripts = () => {
  return useAppSelector((state) => state.scripts);
};

// Tabs selectors
export const useTabs = () => {
  return useAppSelector((state) => state.tabs);
};