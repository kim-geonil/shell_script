import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useTheme } from '../../hooks/redux';
import { setTheme } from '../../store/slices/uiSlice';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'dark', // Force dark theme
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark', // Force dark theme as default
  storageKey = 'ncuscript-ui-theme',
  ...props
}: ThemeProviderProps) {
  const dispatch = useAppDispatch();
  const reduxTheme = useTheme();
  
  // Always use dark theme for cyber/security aesthetic
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Always set dark theme
    root.classList.remove('light', 'system');
    root.classList.add('dark');
    
    // Also set data attribute for better compatibility
    root.setAttribute('data-theme', 'dark');
    
    // Update Redux store
    dispatch(setTheme('dark'));
    
    // Force body background for consistency
    document.body.className = 'dark bg-background text-foreground';
    
  }, [dispatch]);

  const value = {
    theme: 'dark' as Theme,
    setTheme: (newTheme: Theme) => {
      // Always enforce dark theme for this app
      console.log('Theme change requested but enforcing dark theme for cyber aesthetic');
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div className="dark min-h-screen bg-background text-foreground">
        {children}
      </div>
    </ThemeProviderContext.Provider>
  );
}

export const useThemeProvider = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};