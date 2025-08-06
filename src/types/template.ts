export interface SecurityTemplate {
  id: string;
  name: string;
  description: string;
  category: SecurityCategory;
  type: SecurityCheckType;
  content: string;
  variables: TemplateVariable[];
  tags: string[];
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  isOfficial: boolean;
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  requirements: string[];
  references: string[];
  changelog?: TemplateChangelog[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'select';
  description: string;
  defaultValue?: any;
  required: boolean;
  options?: string[]; // for select type
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export interface TemplateChangelog {
  version: string;
  date: string;
  changes: string[];
  author: string;
}

export enum SecurityCategory {
  USER_ACCOUNT = 'user_account',
  SYSTEM_SECURITY = 'system_security',
  FILE_PERMISSIONS = 'file_permissions',
  NETWORK_SECURITY = 'network_security',
  SERVICE_CONFIGURATION = 'service_configuration',
  LOG_AUDIT = 'log_audit',
  LOG_MONITORING = 'log_monitoring',
  PASSWORD_POLICY = 'password_policy',
  ACCESS_CONTROL = 'access_control'
}

export enum SecurityCheckType {
  U_102 = 'U-102', // 사용자 계정 보안
  U_103 = 'U-103', // 패스워드 정책
  U_106 = 'U-106', // 파일 권한 설정
  U_107 = 'U-107', // 접근 제어 보안
  U_301 = 'U-301', // 시스템 보안 설정
  CUSTOM = 'CUSTOM'  // 사용자 정의
}

export interface TemplateFilter {
  category?: SecurityCategory;
  type?: SecurityCheckType;
  difficulty?: 'easy' | 'medium' | 'hard';
  isOfficial?: boolean;
  tags?: string[];
  search?: string;
}

export interface TemplateUsage {
  templateId: string;
  usedAt: string;
  userId: string;
  variables: Record<string, any>;
  executionTime?: number;
  success?: boolean;
  errors?: string[];
}

export interface TemplateLibraryState {
  templates: SecurityTemplate[];
  filteredTemplates: SecurityTemplate[];
  filter: TemplateFilter;
  selectedTemplate: SecurityTemplate | null;
  isLoading: boolean;
  error: string | null;
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'usage';
  sortOrder: 'asc' | 'desc';
  usage: TemplateUsage[];
}

// Template generation result
export interface TemplateGenerationResult {
  success: boolean;
  scriptContent: string;
  variables: Record<string, any>;
  warnings?: string[];
  errors?: string[];
}

// Template validation result
export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  missingVariables: string[];
  syntaxErrors: string[];
}