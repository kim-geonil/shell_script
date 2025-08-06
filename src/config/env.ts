import type { AppConfig } from '../types/env';

const parseBoolean = (value: string | undefined): boolean => {
  return value === 'true';
};

const parseNumber = (value: string | undefined, defaultValue: number): number => {
  const parsed = parseInt(value || '', 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseStringArray = (value: string | undefined): string[] => {
  return value ? value.split(',').map((item) => item.trim()) : [];
};

export const config: AppConfig = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'NcuScript Automator',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    env: (import.meta.env.VITE_APP_ENV as AppConfig['app']['env']) || 'development',
  },
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, 10000),
  },
  auth: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'dev-jwt-secret',
    jwtExpiresIn: import.meta.env.VITE_JWT_EXPIRES_IN || '7d',
    refreshTokenExpiresIn: import.meta.env.VITE_REFRESH_TOKEN_EXPIRES_IN || '30d',
  },
  features: {
    enableMockApi: parseBoolean(import.meta.env.VITE_ENABLE_MOCK_API),
    enableDebugMode: parseBoolean(import.meta.env.VITE_ENABLE_DEBUG_MODE),
    enableReduxDevtools: parseBoolean(import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS),
  },
  external: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
    analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
  },
  upload: {
    maxFileSize: parseNumber(import.meta.env.VITE_MAX_FILE_SIZE, 10485760), // 10MB default
    allowedFileTypes: parseStringArray(import.meta.env.VITE_ALLOWED_FILE_TYPES),
  },
  templates: {
    enableU102: parseBoolean(import.meta.env.VITE_ENABLE_U102_TEMPLATE),
    enableU103: parseBoolean(import.meta.env.VITE_ENABLE_U103_TEMPLATE),
    enableU106: parseBoolean(import.meta.env.VITE_ENABLE_U106_TEMPLATE),
    enableU107: parseBoolean(import.meta.env.VITE_ENABLE_U107_TEMPLATE),
    enableU301: parseBoolean(import.meta.env.VITE_ENABLE_U301_TEMPLATE),
  },
  monaco: {
    cdnUrl: import.meta.env.VITE_MONACO_CDN_URL || 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0',
  },
};

// Development helpers
export const isDevelopment = config.app.env === 'development';
export const isProduction = config.app.env === 'production';
export const isStaging = config.app.env === 'staging';

// Feature flags helper
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return config.features[feature];
};

// Template availability helper
export const isTemplateEnabled = (template: keyof AppConfig['templates']): boolean => {
  return config.templates[template];
};

// Export individual configs for convenience
export const { api, auth, features, upload, templates, monaco } = config;