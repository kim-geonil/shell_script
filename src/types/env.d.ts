/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application Information
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';

  // API Configuration
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // Authentication
  readonly VITE_JWT_SECRET: string;
  readonly VITE_JWT_EXPIRES_IN: string;
  readonly VITE_REFRESH_TOKEN_EXPIRES_IN: string;

  // Features
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_DEBUG_MODE: string;
  readonly VITE_ENABLE_REDUX_DEVTOOLS: string;

  // External Services
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ANALYTICS_ID: string;

  // File Upload Configuration
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_ALLOWED_FILE_TYPES: string;

  // Security Compliance Templates
  readonly VITE_ENABLE_U102_TEMPLATE: string;
  readonly VITE_ENABLE_U103_TEMPLATE: string;
  readonly VITE_ENABLE_U106_TEMPLATE: string;
  readonly VITE_ENABLE_U107_TEMPLATE: string;
  readonly VITE_ENABLE_U301_TEMPLATE: string;

  // Monaco Editor Configuration
  readonly VITE_MONACO_CDN_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Environment configuration helper
export interface AppConfig {
  app: {
    name: string;
    version: string;
    env: 'development' | 'staging' | 'production';
  };
  api: {
    url: string;
    timeout: number;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenExpiresIn: string;
  };
  features: {
    enableMockApi: boolean;
    enableDebugMode: boolean;
    enableReduxDevtools: boolean;
  };
  external: {
    sentryDsn: string;
    analyticsId: string;
  };
  upload: {
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  templates: {
    enableU102: boolean;
    enableU103: boolean;
    enableU106: boolean;
    enableU107: boolean;
    enableU301: boolean;
  };
  monaco: {
    cdnUrl: string;
  };
}