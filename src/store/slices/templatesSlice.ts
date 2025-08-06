import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  SecurityTemplate,
  TemplateFilter,
  TemplateLibraryState,
  TemplateUsage,
  SecurityCategory,
  SecurityCheckType,
  TemplateGenerationResult,
  TemplateValidationResult
} from '../../types/template';

const initialState: TemplateLibraryState = {
  templates: [],
  filteredTemplates: [],
  filter: {},
  selectedTemplate: null,
  isLoading: false,
  error: null,
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  usage: []
};

// Mock data for templates
const mockTemplates: SecurityTemplate[] = [
  {
    id: 'u102-user-account-security',
    name: 'U-102 사용자 계정 보안 검사',
    description: 'Linux 시스템의 사용자 계정 보안 설정을 검사하는 스크립트입니다. 패스워드 정책, 계정 잠금, 권한 설정 등을 확인합니다.',
    category: SecurityCategory.USER_ACCOUNT,
    type: SecurityCheckType.U_102,
    content: `#!/bin/bash
# U-102 사용자 계정 보안 검사 스크립트
# 변수: {{CHECK_USERS}} {{MIN_PASSWORD_LENGTH}} {{MAX_LOGIN_FAILURES}}

echo "=== U-102 사용자 계정 보안 검사 시작 ==="

# 검사할 사용자 목록
USERS="\${CHECK_USERS:-root,admin,user}"
MIN_PWD_LEN="\${MIN_PASSWORD_LENGTH:-8}"
MAX_FAILURES="\${MAX_LOGIN_FAILURES:-5}"

# 사용자 계정 상태 검사
check_user_accounts() {
    echo "사용자 계정 상태 검사 중..."
    
    IFS=',' read -ra USER_ARRAY <<< "$USERS"
    for user in "\${USER_ARRAY[@]}"; do
        if id "$user" &>/dev/null; then
            # 계정 잠금 상태 확인
            if passwd -S "$user" | grep -q " L "; then
                echo "경고: 사용자 $user 계정이 잠겨 있습니다"
            else
                echo "정상: 사용자 $user 계정이 활성화되어 있습니다"
            fi
            
            # 마지막 로그인 확인
            lastlog -u "$user"
        else
            echo "오류: 사용자 $user가 존재하지 않습니다"
        fi
    done
}

# 패스워드 정책 검사
check_password_policy() {
    echo "패스워드 정책 검사 중..."
    
    if [ -f /etc/login.defs ]; then
        pwd_min_len=$(grep "^PASS_MIN_LEN" /etc/login.defs | awk '{print $2}')
        if [ "$pwd_min_len" -ge "$MIN_PWD_LEN" ]; then
            echo "정상: 최소 패스워드 길이가 $pwd_min_len 자로 설정됨"
        else
            echo "경고: 최소 패스워드 길이가 $pwd_min_len 자로 너무 짧음 (권장: $MIN_PWD_LEN 자 이상)"
        fi
    fi
}

# 로그인 실패 제한 검사
check_login_failures() {
    echo "로그인 실패 제한 검사 중..."
    
    if [ -f /etc/security/faillock.conf ]; then
        deny_count=$(grep "^deny" /etc/security/faillock.conf | awk '{print $3}')
        if [ "$deny_count" -le "$MAX_FAILURES" ]; then
            echo "정상: 로그인 실패 제한이 $deny_count 회로 설정됨"
        else
            echo "경고: 로그인 실패 제한이 $deny_count 회로 너무 높음"
        fi
    fi
}

# 메인 실행
main() {
    check_user_accounts
    check_password_policy
    check_login_failures
    echo "=== U-102 사용자 계정 보안 검사 완료 ==="
}

main "$@"`,
    variables: [
      {
        name: 'CHECK_USERS',
        type: 'string',
        description: '검사할 사용자 계정 목록 (쉼표로 구분)',
        defaultValue: 'root,admin,user',
        required: true
      },
      {
        name: 'MIN_PASSWORD_LENGTH',
        type: 'number',
        description: '최소 패스워드 길이',
        defaultValue: 8,
        required: true,
        validation: { min: 4, max: 32 }
      },
      {
        name: 'MAX_LOGIN_FAILURES',
        type: 'number',
        description: '허용 가능한 최대 로그인 실패 횟수',
        defaultValue: 5,
        required: true,
        validation: { min: 1, max: 20 }
      }
    ],
    tags: ['계정보안', '패스워드', '로그인', 'U-102'],
    version: '1.0.0',
    author: 'NcuScript Team',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    isOfficial: true,
    isActive: true,
    difficulty: 'medium',
    estimatedTime: 10,
    requirements: ['Linux 시스템', 'root 권한', 'passwd 명령어'],
    references: [
      'https://cyber.go.kr/cmmn/main.do',
      'https://www.kisa.or.kr/'
    ],
    downloadCount: 1247,
    rating: 4.8
  },
  {
    id: 'u106-file-permissions',
    name: 'U-106 파일 및 디렉터리 권한 검사',
    description: '중요한 시스템 파일과 디렉터리의 권한 설정을 검사합니다.',
    category: SecurityCategory.FILE_PERMISSIONS,
    type: SecurityCheckType.U_106,
    content: `#!/bin/bash
# U-106 파일 및 디렉터리 권한 검사 스크립트
# 변수: {{CHECK_PATHS}} {{EXPECTED_PERMISSIONS}}

echo "=== U-106 파일 권한 검사 시작 ==="

CHECK_PATHS="\${CHECK_PATHS:-/etc/passwd,/etc/shadow,/etc/hosts}"
EXPECTED_PERMS="\${EXPECTED_PERMISSIONS:-644,600,644}"

check_file_permissions() {
    echo "파일 권한 검사 중..."
    
    IFS=',' read -ra PATH_ARRAY <<< "$CHECK_PATHS"
    IFS=',' read -ra PERM_ARRAY <<< "$EXPECTED_PERMS"
    
    for i in "\${!PATH_ARRAY[@]}"; do
        file="\${PATH_ARRAY[i]}"
        expected="\${PERM_ARRAY[i]}"
        
        if [ -f "$file" ] || [ -d "$file" ]; then
            actual=$(stat -c "%a" "$file")
            if [ "$actual" = "$expected" ]; then
                echo "정상: $file 권한이 $expected 로 올바르게 설정됨"
            else
                echo "경고: $file 권한이 $actual 로 설정됨 (권장: $expected)"
            fi
        else
            echo "오류: $file 이 존재하지 않습니다"
        fi
    done
}

main() {
    check_file_permissions
    echo "=== U-106 파일 권한 검사 완료 ==="
}

main "$@"`,
    variables: [
      {
        name: 'CHECK_PATHS',
        type: 'string',
        description: '검사할 파일/디렉터리 경로 (쉼표로 구분)',
        defaultValue: '/etc/passwd,/etc/shadow,/etc/hosts',
        required: true
      },
      {
        name: 'EXPECTED_PERMISSIONS',
        type: 'string',
        description: '기대하는 권한 (3자리 숫자, 쉼표로 구분)',
        defaultValue: '644,600,644',
        required: true,
        validation: { pattern: '^[0-7]{3}(,[0-7]{3})*$' }
      }
    ],
    tags: ['파일권한', '시스템보안', 'U-106'],
    version: '1.2.1',
    author: 'NcuScript Team',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    isOfficial: true,
    isActive: true,
    difficulty: 'easy',
    estimatedTime: 5,
    requirements: ['Linux 시스템', 'stat 명령어'],
    references: ['https://linux.die.net/man/1/stat'],
    downloadCount: 892,
    rating: 4.5
  },
  {
    id: 'u103-password-policy',
    name: 'U-103 패스워드 정책 검사',
    description: '시스템의 패스워드 정책 설정을 검사하여 보안 규칙 준수를 확인합니다.',
    category: SecurityCategory.PASSWORD_POLICY,
    type: SecurityCheckType.U_103,
    content: `#!/bin/bash
# U-103 패스워드 정책 검사 스크립트
# 변수: {{MIN_LENGTH}} {{REQUIRE_SPECIAL}} {{REQUIRE_NUMBERS}}

echo "=== U-103 패스워드 정책 검사 시작 ==="

MIN_LENGTH="\${MIN_LENGTH:-8}"
REQUIRE_SPECIAL="\${REQUIRE_SPECIAL:-yes}"
REQUIRE_NUMBERS="\${REQUIRE_NUMBERS:-yes}"

check_password_policy() {
    echo "패스워드 정책 검사 중..."
    
    # /etc/login.defs 검사
    if [ -f /etc/login.defs ]; then
        pwd_min_len=$(grep "^PASS_MIN_LEN" /etc/login.defs | awk '{print $2}')
        if [ "$pwd_min_len" -ge "$MIN_LENGTH" ]; then
            echo "정상: 최소 패스워드 길이가 $pwd_min_len 자로 설정됨"
        else
            echo "경고: 최소 패스워드 길이가 $pwd_min_len 자로 너무 짧음"
        fi
    fi
    
    # PAM 설정 검사
    if [ -f /etc/pam.d/common-password ]; then
        if grep -q "pam_pwquality.so" /etc/pam.d/common-password; then
            echo "정상: PAM 패스워드 품질 모듈이 활성화됨"
        else
            echo "경고: PAM 패스워드 품질 모듈이 비활성화됨"
        fi
    fi
}

main() {
    check_password_policy
    echo "=== U-103 패스워드 정책 검사 완료 ==="
}

main "$@"`,
    variables: [
      {
        name: 'MIN_LENGTH',
        type: 'number',
        description: '최소 패스워드 길이',
        defaultValue: 8,
        required: true,
        validation: { min: 4, max: 32 }
      },
      {
        name: 'REQUIRE_SPECIAL',
        type: 'string',
        description: '특수문자 포함 필수 여부 (yes/no)',
        defaultValue: 'yes',
        required: true
      },
      {
        name: 'REQUIRE_NUMBERS',
        type: 'string',
        description: '숫자 포함 필수 여부 (yes/no)',
        defaultValue: 'yes',
        required: true
      }
    ],
    tags: ['패스워드', '보안정책', 'U-103', 'PAM'],
    version: '1.1.0',
    author: 'NcuScript Team',
    createdAt: '2024-01-12T10:30:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    isOfficial: true,
    isActive: true,
    difficulty: 'medium',
    estimatedTime: 8,
    requirements: ['Linux 시스템', 'PAM 모듈', '/etc/login.defs'],
    references: [
      'https://linux.die.net/man/8/pam_pwquality',
      'https://www.cyberciti.biz/tips/linux-check-passwords.html'
    ],
    downloadCount: 634,
    rating: 4.3
  },
  {
    id: 'u107-network-security',
    name: 'U-107 네트워크 보안 설정 검사',
    description: '네트워크 인터페이스와 방화벽 설정을 검사하여 보안 취약점을 확인합니다.',
    category: SecurityCategory.NETWORK_SECURITY,
    type: SecurityCheckType.U_107,
    content: `#!/bin/bash
# U-107 네트워크 보안 설정 검사 스크립트
# 변수: {{CHECK_INTERFACES}} {{ALLOWED_PORTS}}

echo "=== U-107 네트워크 보안 설정 검사 시작 ==="

CHECK_INTERFACES="\${CHECK_INTERFACES:-eth0,lo}"
ALLOWED_PORTS="\${ALLOWED_PORTS:-22,80,443}"

check_network_interfaces() {
    echo "네트워크 인터페이스 검사 중..."
    
    IFS=',' read -ra INTERFACE_ARRAY <<< "$CHECK_INTERFACES"
    for interface in "\${INTERFACE_ARRAY[@]}"; do
        if ip link show "$interface" &>/dev/null; then
            status=$(ip link show "$interface" | grep -o "state [A-Z]*" | awk '{print $2}')
            echo "정보: 인터페이스 $interface 상태: $status"
        else
            echo "경고: 인터페이스 $interface가 존재하지 않습니다"
        fi
    done
}

check_firewall_rules() {
    echo "방화벽 규칙 검사 중..."
    
    if command -v ufw &> /dev/null; then
        ufw_status=$(ufw status | head -n 1)
        echo "정보: UFW 상태 - $ufw_status"
    elif command -v iptables &> /dev/null; then
        rule_count=$(iptables -L | grep -c "Chain")
        echo "정보: iptables 체인 수: $rule_count"
    else
        echo "경고: 방화벽 도구를 찾을 수 없습니다"
    fi
}

main() {
    check_network_interfaces
    check_firewall_rules
    echo "=== U-107 네트워크 보안 설정 검사 완료 ==="
}

main "$@"`,
    variables: [
      {
        name: 'CHECK_INTERFACES',
        type: 'string',
        description: '검사할 네트워크 인터페이스 (쉼표로 구분)',
        defaultValue: 'eth0,lo',
        required: true
      },
      {
        name: 'ALLOWED_PORTS',
        type: 'string',
        description: '허용된 포트 목록 (쉼표로 구분)',
        defaultValue: '22,80,443',
        required: true
      }
    ],
    tags: ['네트워크', '방화벽', 'U-107', '인터페이스'],
    version: '1.0.2',
    author: 'NcuScript Team',
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-26T11:45:00Z',
    isOfficial: true,
    isActive: true,
    difficulty: 'hard',
    estimatedTime: 15,
    requirements: ['Linux 시스템', 'iptables 또는 ufw', 'ip 명령어'],
    references: [
      'https://linux.die.net/man/8/iptables',
      'https://wiki.ubuntu.com/UncomplicatedFirewall'
    ],
    downloadCount: 458,
    rating: 4.6
  },
  {
    id: 'u301-log-monitoring',
    name: 'U-301 로그 모니터링 검사',
    description: '시스템 로그 파일의 보안 이벤트를 모니터링하고 분석합니다.',
    category: SecurityCategory.LOG_MONITORING,
    type: SecurityCheckType.U_301,
    content: `#!/bin/bash
# U-301 로그 모니터링 검사 스크립트
# 변수: {{LOG_FILES}} {{SEARCH_PATTERNS}} {{TIME_RANGE}}

echo "=== U-301 로그 모니터링 검사 시작 ==="

LOG_FILES="\${LOG_FILES:-/var/log/auth.log,/var/log/syslog}"
SEARCH_PATTERNS="\${SEARCH_PATTERNS:-Failed password,Invalid user,sudo}"
TIME_RANGE="\${TIME_RANGE:-24}"

check_security_logs() {
    echo "보안 로그 검사 중..."
    
    IFS=',' read -ra LOG_ARRAY <<< "$LOG_FILES"
    IFS=',' read -ra PATTERN_ARRAY <<< "$SEARCH_PATTERNS"
    
    for log_file in "\${LOG_ARRAY[@]}"; do
        if [ -f "$log_file" ]; then
            echo "로그 파일 분석: $log_file"
            
            for pattern in "\${PATTERN_ARRAY[@]}"; do
                count=$(grep -c "$pattern" "$log_file" 2>/dev/null || echo 0)
                if [ "$count" -gt 0 ]; then
                    echo "발견: '$pattern' 패턴이 $count 회 발견됨"
                    
                    # 최근 발생 시간 표시
                    recent=$(grep "$pattern" "$log_file" | tail -n 1 | cut -d' ' -f1-3)
                    echo "  최근 발생: $recent"
                fi
            done
        else
            echo "경고: 로그 파일 $log_file이 존재하지 않습니다"
        fi
    done
}

generate_summary() {
    echo "로그 분석 요약 생성 중..."
    
    total_events=0
    for log_file in "\${LOG_ARRAY[@]}"; do
        if [ -f "$log_file" ]; then
            for pattern in "\${PATTERN_ARRAY[@]}"; do
                count=$(grep -c "$pattern" "$log_file" 2>/dev/null || echo 0)
                total_events=$((total_events + count))
            done
        fi
    done
    
    echo "총 보안 이벤트 수: $total_events"
    
    if [ "$total_events" -gt 100 ]; then
        echo "경고: 높은 수준의 보안 이벤트가 감지되었습니다"
    elif [ "$total_events" -gt 10 ]; then
        echo "주의: 중간 수준의 보안 이벤트가 감지되었습니다"
    else
        echo "정상: 낮은 수준의 보안 이벤트입니다"
    fi
}

main() {
    check_security_logs
    generate_summary
    echo "=== U-301 로그 모니터링 검사 완료 ==="
}

main "$@"`,
    variables: [
      {
        name: 'LOG_FILES',
        type: 'string',
        description: '검사할 로그 파일 경로 (쉼표로 구분)',
        defaultValue: '/var/log/auth.log,/var/log/syslog',
        required: true
      },
      {
        name: 'SEARCH_PATTERNS',
        type: 'string',
        description: '검색할 보안 패턴 (쉼표로 구분)',
        defaultValue: 'Failed password,Invalid user,sudo',
        required: true
      },
      {
        name: 'TIME_RANGE',
        type: 'number',
        description: '검사할 시간 범위 (시간)',
        defaultValue: 24,
        required: true,
        validation: { min: 1, max: 168 }
      }
    ],
    tags: ['로그', '모니터링', 'U-301', '보안이벤트'],
    version: '2.1.0',
    author: 'NcuScript Team',
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-28T13:20:00Z',
    isOfficial: true,
    isActive: true,
    difficulty: 'medium',
    estimatedTime: 12,
    requirements: ['Linux 시스템', 'grep 명령어', '로그 파일 접근 권한'],
    references: [
      'https://linux.die.net/man/1/grep',
      'https://www.rsyslog.com/'
    ],
    downloadCount: 723,
    rating: 4.4
  }
];

// Async thunks
export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTemplates;
  }
);

export const fetchTemplateById = createAsyncThunk(
  'templates/fetchTemplateById',
  async (templateId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const template = mockTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }
);

export const generateScript = createAsyncThunk(
  'templates/generateScript',
  async ({ template, variables }: { 
    template: SecurityTemplate; 
    variables: Record<string, any> 
  }): Promise<TemplateGenerationResult> => {
    // Simulate script generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let scriptContent = template.content;
    const warnings: string[] = [];
    const errors: string[] = [];

    // Replace variables in template
    template.variables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue;
      const placeholder = `{{${variable.name}}}`;
      
      if (value === undefined && variable.required) {
        errors.push(`필수 변수 '${variable.name}'이 제공되지 않았습니다.`);
      } else {
        scriptContent = scriptContent.replace(new RegExp(placeholder, 'g'), String(value));
        
        // Validate value if validation rules exist
        if (variable.validation && value !== undefined) {
          const { min, max, minLength, maxLength, pattern } = variable.validation;
          
          if (typeof value === 'number') {
            if (min !== undefined && value < min) {
              warnings.push(`변수 '${variable.name}'의 값 ${value}이 최솟값 ${min}보다 작습니다.`);
            }
            if (max !== undefined && value > max) {
              warnings.push(`변수 '${variable.name}'의 값 ${value}이 최댓값 ${max}보다 큽니다.`);
            }
          }
          
          if (typeof value === 'string') {
            if (minLength !== undefined && value.length < minLength) {
              warnings.push(`변수 '${variable.name}'의 길이가 최소 ${minLength}자보다 짧습니다.`);
            }
            if (maxLength !== undefined && value.length > maxLength) {
              warnings.push(`변수 '${variable.name}'의 길이가 최대 ${maxLength}자를 초과합니다.`);
            }
            if (pattern && !new RegExp(pattern).test(value)) {
              warnings.push(`변수 '${variable.name}'의 형식이 올바르지 않습니다.`);
            }
          }
        }
      }
    });

    return {
      success: errors.length === 0,
      scriptContent,
      variables,
      warnings,
      errors
    };
  }
);

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TemplateFilter>) => {
      state.filter = action.payload;
      state.filteredTemplates = filterTemplates(state.templates, action.payload);
    },

    clearFilter: (state) => {
      state.filter = {};
      state.filteredTemplates = state.templates;
    },

    setSortBy: (state, action: PayloadAction<TemplateLibraryState['sortBy']>) => {
      state.sortBy = action.payload;
      state.filteredTemplates = sortTemplates(state.filteredTemplates, action.payload, state.sortOrder);
    },

    setSortOrder: (state, action: PayloadAction<TemplateLibraryState['sortOrder']>) => {
      state.sortOrder = action.payload;
      state.filteredTemplates = sortTemplates(state.filteredTemplates, state.sortBy, action.payload);
    },

    setSelectedTemplate: (state, action: PayloadAction<SecurityTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },

    addToUsage: (state, action: PayloadAction<TemplateUsage>) => {
      state.usage.push(action.payload);
    },

    incrementDownloadCount: (state, action: PayloadAction<string>) => {
      const templateId = action.payload;
      const template = state.templates.find(t => t.id === templateId);
      if (template) {
        // Add download count to template (we'll add this field to the template type)
        (template as any).downloadCount = ((template as any).downloadCount || 0) + 1;
      }
      // Also update filtered templates
      const filteredTemplate = state.filteredTemplates.find(t => t.id === templateId);
      if (filteredTemplate) {
        (filteredTemplate as any).downloadCount = ((filteredTemplate as any).downloadCount || 0) + 1;
      }
    },

    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch templates
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        state.filteredTemplates = filterTemplates(action.payload, state.filter);
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      })

      // Fetch template by ID
      .addCase(fetchTemplateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch template';
      })

      // Generate script
      .addCase(generateScript.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateScript.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add usage record
        if (state.selectedTemplate) {
          state.usage.push({
            templateId: state.selectedTemplate.id,
            usedAt: new Date().toISOString(),
            userId: 'current-user', // Would come from auth state
            variables: action.payload.variables,
            success: action.payload.success
          });
        }
      })
      .addCase(generateScript.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to generate script';
      });
  }
});

// Helper functions
function filterTemplates(templates: SecurityTemplate[], filter: TemplateFilter): SecurityTemplate[] {
  return templates.filter(template => {
    // Search filter
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      const matchesSearch = 
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filter.category && template.category !== filter.category) {
      return false;
    }

    // Type filter
    if (filter.type && template.type !== filter.type) {
      return false;
    }

    // Difficulty filter
    if (filter.difficulty && template.difficulty !== filter.difficulty) {
      return false;
    }

    // Official filter
    if (filter.isOfficial !== undefined && template.isOfficial !== filter.isOfficial) {
      return false;
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some(tag => 
        template.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}

function sortTemplates(
  templates: SecurityTemplate[], 
  sortBy: TemplateLibraryState['sortBy'], 
  sortOrder: TemplateLibraryState['sortOrder']
): SecurityTemplate[] {
  const sorted = [...templates].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'usage':
        // This would require usage data
        aValue = 0;
        bValue = 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

export const {
  setFilter,
  clearFilter,
  setSortBy,
  setSortOrder,
  setSelectedTemplate,
  addToUsage,
  incrementDownloadCount,
  clearError
} = templatesSlice.actions;

export default templatesSlice.reducer;