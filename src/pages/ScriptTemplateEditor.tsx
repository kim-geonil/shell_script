import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Server,
  Settings,
  CheckCircle,
  Code,
  Save,
  Play,
  Square,
  ArrowLeft,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';
import MonacoEditor from '../components/editor/MonacoEditor';
import { AIService, TestRequest, TestResponse } from '../services/aiService';
import LoadingOverlay from '../components/ui/LoadingOverlay';

// 템플릿별 스크립트 내용
const TEMPLATE_SCRIPTS: Record<string, string> = {
  'u102': `#!/bin/bash
# U-102: 시스템 계정 쉘 검사
# 시스템 계정들이 안전한 쉘을 사용하는지 확인

LOG_FILE="/var/log/security_check_u102.log"
echo "=== U-102 시스템 계정 쉘 검사 시작 ===" | tee "$LOG_FILE"

# 검사 대상 계정들
ACCOUNTS=("bin" "daemon" "adm" "mail" "operator" "games" "gopher" "nobody" "dbus" "vcsa" "abrt" "tcpdump" "uuidd" "haldaemon" "tss" "saslauth" "postfix" "sshd" "ntp" "rpc" "rpcuser" "nfsnobody")

# 허용되는 안전한 쉘
ALLOWED_SHELLS=("/bin/false" "/sbin/nologin" "/usr/sbin/nologin")

fail=false

for account in "\${ACCOUNTS[@]}"; do
    if getent passwd "$account" > /dev/null 2>&1; then
        shell=$(getent passwd "$account" | awk -F: '{print $7}')
        
        # 허용된 쉘인지 확인
        allowed=false
        for allowed_shell in "\${ALLOWED_SHELLS[@]}"; do
            if [[ "$shell" == "$allowed_shell" ]]; then
                allowed=true
                break
            fi
        done
        
        if [[ "$allowed" == false ]]; then
            echo "Fail: [$account] has shell [$shell]" | tee -a "$LOG_FILE"
            fail=true
        fi
    fi
done

if [[ "$fail" == true ]]; then
    echo "Fail" | tee -a "$LOG_FILE"
else
    echo "Pass" | tee -a "$LOG_FILE"
fi`,

  'u103': `#!/bin/bash
# U-103: 패스워드 반복 문자 제한 검사
# maxrepeat 값이 1 또는 2로 설정되어 있는지 확인

LOG_FILE="/var/log/security_check_u103.log"
echo "=== U-103 패스워드 반복 문자 제한 검사 시작 ===" | tee "$LOG_FILE"

# OS 식별
if [[ -f /etc/os-release ]]; then
    OS_ID=$(grep "^ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
    OS_VERSION=$(grep "^VERSION_ID=" /etc/os-release | cut -d= -f2 | tr -d '"' | cut -d. -f1)
else
    OS_ID=$(cat /etc/redhat-release | awk '{print tolower($1)}')
    OS_VERSION=$(cat /etc/redhat-release | grep -oP '\\d+' | head -n1)
fi

MAXREPEAT=""

# OS별 설정 파일에서 maxrepeat 값 추출
case "$OS_ID" in
    "ubuntu"|"debian")
        # PAM 파일에서 우선 검색
        MAXREPEAT=$(grep -oP 'pam_pwquality.*maxrepeat=\\s*\\K\\d+' /etc/pam.d/common-password 2>/dev/null | head -n1)
        # 설정 파일에서 검색
        if [[ -z "$MAXREPEAT" ]]; then
            MAXREPEAT=$(grep -oP '^\\s*maxrepeat\\s*=\\s*\\K\\d+' /etc/security/pwquality.conf 2>/dev/null | head -n1)
        fi
        ;;
    "rhel"|"centos"|"rocky"|"red")
        if [[ "$OS_VERSION" -ge 7 ]]; then
            MAXREPEAT=$(grep -oP '^\\s*maxrepeat\\s*=\\s*\\K\\d+' /etc/security/pwquality.conf 2>/dev/null | head -n1)
        else
            MAXREPEAT=$(grep -oP 'pam_cracklib.*maxrepeat=\\s*\\K\\d+' /etc/pam.d/system-auth 2>/dev/null | head -n1)
            if [[ -z "$MAXREPEAT" ]]; then
                MAXREPEAT=$(grep -oP 'pam_cracklib.*maxrepeat=\\s*\\K\\d+' /etc/pam.d/passwd 2>/dev/null | head -n1)
            fi
        fi
        ;;
esac

# 검증
if [[ -n "$MAXREPEAT" && ("$MAXREPEAT" == "1" || "$MAXREPEAT" == "2") ]]; then
    echo "Pass" | tee -a "$LOG_FILE"
else
    echo "Fail : MAXREPEAT=\${MAXREPEAT:-Not_Set} (Allowed: 1 or 2)" | tee -a "$LOG_FILE"
fi`,

  'u106': `#!/bin/bash
# U-106: 패스워드 복잡성 정책 검사
# 4가지 문자 종류가 모두 -1로 설정되어 있는지 확인

LOG_FILE="/var/log/security_check_u106.log"
echo "=== U-106 패스워드 복잡성 정책 검사 시작 ===" | tee "$LOG_FILE"

# OS 식별
if [[ -f /etc/os-release ]]; then
    OS_ID=$(grep "^ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
    OS_VERSION=$(grep "^VERSION_ID=" /etc/os-release | cut -d= -f2 | tr -d '"' | cut -d. -f1)
else
    OS_ID=$(cat /etc/redhat-release | awk '{print tolower($1)}')
    OS_VERSION=$(cat /etc/redhat-release | grep -oP '\\d+' | head -n1)
fi

# 검사할 파일들 결정
case "$OS_ID" in
    "ubuntu"|"debian")
        FILES=("/etc/pam.d/common-password")
        ;;
    "rhel"|"centos"|"rocky"|"red")
        if [[ "$OS_VERSION" -ge 7 ]]; then
            FILES=("/etc/security/pwquality.conf")
        else
            FILES=("/etc/pam.d/system-auth")
        fi
        ;;
esac

final_result="Fail"

for file in "\${FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "=================================================================================================" | tee -a "$LOG_FILE"
        echo "Checking file: $file" | tee -a "$LOG_FILE"
        
        # 설정값 추출 및 표시
        lcredit=$(grep -oP 'lcredit\\s*=\\s*\\K-?\\d+' "$file" 2>/dev/null | head -n1)
        ucredit=$(grep -oP 'ucredit\\s*=\\s*\\K-?\\d+' "$file" 2>/dev/null | head -n1)
        dcredit=$(grep -oP 'dcredit\\s*=\\s*\\K-?\\d+' "$file" 2>/dev/null | head -n1)
        ocredit=$(grep -oP 'ocredit\\s*=\\s*\\K-?\\d+' "$file" 2>/dev/null | head -n1)
        
        echo "lcredit: \${lcredit:-Not set}" | tee -a "$LOG_FILE"
        echo "ucredit: \${ucredit:-Not set}" | tee -a "$LOG_FILE"
        echo "dcredit: \${dcredit:-Not set}" | tee -a "$LOG_FILE"
        echo "ocredit: \${ocredit:-Not set}" | tee -a "$LOG_FILE"
        echo "" | tee -a "$LOG_FILE"
        
        # 검증: 모든 credit 값이 -1인지 확인
        if grep -q 'lcredit\\s*=\\s*-1' "$file" && \\
           grep -q 'ucredit\\s*=\\s*-1' "$file" && \\
           grep -q 'dcredit\\s*=\\s*-1' "$file" && \\
           grep -q 'ocredit\\s*=\\s*-1' "$file"; then
            echo "Status: Pass" | tee -a "$LOG_FILE"
            final_result="Pass"
        else
            echo "Status: Fail" | tee -a "$LOG_FILE"
            echo "Reason: Required settings not found in $file" | tee -a "$LOG_FILE"
        fi
    else
        echo "File not found: $file" | tee -a "$LOG_FILE"
    fi
done

echo "========================================================" | tee -a "$LOG_FILE"
echo "Final Result: $final_result" | tee -a "$LOG_FILE"`,

  'u107': `#!/bin/bash
# U-107: 패스워드 복잡성 강화 검사
# 패스워드 복잡성 정책의 4가지 credit 값이 모두 -1로 설정되었는지 검증

LOG_FILE="/var/log/security_check_u107.log"
echo "=== U-107 패스워드 복잡성 강화 검사 시작 ===" | tee "$LOG_FILE"

# OS 식별
if [[ -f /etc/os-release ]]; then
    OS_ID=$(grep "^ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
    OS_VERSION=$(grep "^VERSION_ID=" /etc/os-release | cut -d= -f2 | tr -d '"' | cut -d. -f1)
else
    OS_ID=$(cat /etc/redhat-release | awk '{print tolower($1)}')
    OS_VERSION=$(cat /etc/redhat-release | grep -oP '\\d+' | head -n1)
fi

# 검사할 파일들 결정
case "$OS_ID" in
    "ubuntu"|"debian")
        FILES=("/etc/pam.d/common-password")
        ;;
    "rhel"|"centos"|"rocky"|"red")
        if [[ "$OS_VERSION" -ge 7 ]]; then
            FILES=("/etc/security/pwquality.conf")
        else
            FILES=("/etc/pam.d/system-auth")
        fi
        ;;
esac

check_password_complexity() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        echo "File not found: $file" | tee -a "$LOG_FILE"
        return 1
    fi
    
    echo "=================================================================================================" | tee -a "$LOG_FILE"
    echo "Checking file: $file" | tee -a "$LOG_FILE"
    
    # 파일 내용에 따른 처리
    if [[ "$file" == *"pwquality.conf" ]]; then
        content=$(grep -v '^#' "$file" 2>/dev/null)
    else
        content=$(grep -v '^#' "$file" | grep -E 'pam_pwquality\\.so|pam_cracklib\\.so' 2>/dev/null)
    fi
    
    # 설정값 추출 및 표시
    lcredit=$(echo "$content" | grep -oP 'lcredit\\s*=\\s*\\K-?\\d+' | head -n1)
    ucredit=$(echo "$content" | grep -oP 'ucredit\\s*=\\s*\\K-?\\d+' | head -n1)
    dcredit=$(echo "$content" | grep -oP 'dcredit\\s*=\\s*\\K-?\\d+' | head -n1)
    ocredit=$(echo "$content" | grep -oP 'ocredit\\s*=\\s*\\K-?\\d+' | head -n1)
    
    echo "lcredit: \${lcredit:-Not set}" | tee -a "$LOG_FILE"
    echo "ucredit: \${ucredit:-Not set}" | tee -a "$LOG_FILE"
    echo "dcredit: \${dcredit:-Not set}" | tee -a "$LOG_FILE"
    echo "ocredit: \${ocredit:-Not set}" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    
    # 검증: 모든 credit 값이 -1인지 확인
    if echo "$content" | grep -q 'lcredit\\s*=\\s*-1' && \\
       echo "$content" | grep -q 'ucredit\\s*=\\s*-1' && \\
       echo "$content" | grep -q 'dcredit\\s*=\\s*-1' && \\
       echo "$content" | grep -q 'ocredit\\s*=\\s*-1'; then
        echo "Status: Pass" | tee -a "$LOG_FILE"
        return 0
    else
        echo "Status: Fail" | tee -a "$LOG_FILE"
        echo "Reason: Required settings not found in $file" | tee -a "$LOG_FILE"
        return 1
    fi
}

final_result="Fail"

for file in "\${FILES[@]}"; do
    if check_password_complexity "$file"; then
        final_result="Pass"
    fi
done

echo "========================================================" | tee -a "$LOG_FILE"
echo "Final Result: $final_result" | tee -a "$LOG_FILE"`,

  'u301': `#!/bin/bash
# U-301: 계정 잠금 임계값 검사
# deny=4, unlock_time=120으로 설정되어 있는지 확인

LOG_FILE="/var/log/security_check_u301.log"
echo "=== U-301 계정 잠금 임계값 검사 시작 ===" | tee "$LOG_FILE"

# OS 식별
if [[ -f /etc/os-release ]]; then
    OS_ID=$(grep "^ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
    OS_VERSION=$(grep "^VERSION_ID=" /etc/os-release | cut -d= -f2 | tr -d '"' | cut -d. -f1)
else
    OS_ID=$(cat /etc/redhat-release | awk '{print tolower($1)}')
    OS_VERSION=$(cat /etc/redhat-release | grep -oP '\\d+' | head -n1)
fi

# OS별 PAM 파일과 모듈 결정
case "$OS_ID" in
    "ubuntu"|"debian")
        PAM_FILES=("/etc/pam.d/common-auth")
        PAM_MODULES=("pam_tally2.so")
        ;;
    "rhel"|"centos"|"rocky"|"red")
        PAM_FILES=("/etc/pam.d/system-auth" "/etc/pam.d/password-auth")
        if [[ "$OS_VERSION" -ge 8 ]]; then
            PAM_MODULES=("pam_faillock.so")
        elif [[ "$OS_VERSION" -eq 7 ]]; then
            PAM_MODULES=("pam_faillock.so" "pam_tally2.so")
        else
            PAM_MODULES=("pam_tally2.so")
        fi
        ;;
    *)
        echo "Unsupported OS: $OS_ID" | tee -a "$LOG_FILE"
        exit 1
        ;;
esac

CURRENT_DENY=""
CURRENT_UNLOCK_TIME=""

# 설정값 추출
for pam_file in "\${PAM_FILES[@]}"; do
    if [[ -f "$pam_file" ]]; then
        for module in "\${PAM_MODULES[@]}"; do
            if grep -q "$module" "$pam_file"; then
                # deny 값 추출
                if [[ -z "$CURRENT_DENY" ]]; then
                    CURRENT_DENY=$(grep "$module" "$pam_file" | grep -oP '\\bdeny=\\K\\d+' | head -n1)
                fi
                
                # unlock_time 값 추출
                if [[ -z "$CURRENT_UNLOCK_TIME" ]]; then
                    CURRENT_UNLOCK_TIME=$(grep "$module" "$pam_file" | grep -oP '\\bunlock_time=\\K\\d+' | head -n1)
                fi
            fi
        done
    fi
done

# 검증
if [[ "$CURRENT_DENY" == "4" && "$CURRENT_UNLOCK_TIME" == "120" ]]; then
    echo "Pass : deny=$CURRENT_DENY unlock_time=$CURRENT_UNLOCK_TIME" | tee -a "$LOG_FILE"
else
    echo "Fail : deny=\${CURRENT_DENY:-Not_Set} unlock_time=\${CURRENT_UNLOCK_TIME:-Not_Set} (Required: deny=4 unlock_time=120)" | tee -a "$LOG_FILE"
fi`
};

// OS 및 애플리케이션 옵션
const OS_OPTIONS = [
  { value: 'linux', label: 'Linux' },
  { value: 'windows', label: 'Windows' },
  { value: 'macos', label: 'macOS' },
  { value: 'unix', label: 'Unix' }
];

const APPLICATION_OPTIONS = [
  { value: 'apache', label: 'Apache HTTP Server' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'ssh', label: 'SSH' },
  { value: 'ftp', label: 'FTP' },
  { value: 'dns', label: 'DNS' },
  { value: 'dhcp', label: 'DHCP' },
  { value: 'firewall', label: 'Firewall' },
  { value: 'custom', label: '직접 입력' }
];



export default function ScriptTemplateEditor() {
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  // URL에서 템플릿 ID 추출
  const getTemplateId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('template') || 'u102';
  };

  const [templateId] = useState(getTemplateId());
  const [scriptContent, setScriptContent] = useState(TEMPLATE_SCRIPTS[templateId] || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [minimapEnabled] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  
  // 설정 관련 state
  const [selectedOS, setSelectedOS] = useState('linux');
  const [selectedApplication, setSelectedApplication] = useState('');
  
  // 점검 항목 관련 state
  const [selectedInspectionType, setSelectedInspectionType] = useState('config_file');
  const [inspectionConfig, setInspectionConfig] = useState({
    configPath: '',
    processName: '',
    accountName: '',
    permission: '',
    owner: '',
    expectedValue: '',
    failCondition: '',
    passCondition: ''
  });

  // AI 요구사항 관련 state
  const [aiRequirement, setAiRequirement] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleInspectionConfigChange = (field: string, value: string) => {
    setInspectionConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+C로 변경 (기본 Ctrl+C와 충돌 방지)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        handleCopy();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSave = () => {
    // 스크립트 저장 로직
    console.log('스크립트 저장:', scriptContent);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptContent);
      setIsCopied(true);
      console.log('📋 스크립트가 클립보드에 복사되었습니다.');
      
      // 2초 후 복사 완료 상태 초기화
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('❌ 클립보드 복사 실패:', error);
      
      // 폴백: 텍스트 선택 방식
      try {
        const textArea = document.createElement('textarea');
        textArea.value = scriptContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (result) {
          setIsCopied(true);
          console.log('📋 스크립트가 클립보드에 복사되었습니다. (폴백 방식)');
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        } else {
          alert('❌ 클립보드 복사에 실패했습니다.\n\n브라우저에서 클립보드 접근이 제한되어 있습니다.\n수동으로 스크립트를 선택하여 복사해주세요.');
        }
      } catch (fallbackError) {
        console.error('❌ 폴백 복사도 실패:', fallbackError);
        alert('❌ 클립보드 복사에 실패했습니다.\n\n브라우저에서 클립보드 접근이 제한되어 있습니다.\n수동으로 스크립트를 선택하여 복사해주세요.');
      }
    }
  };

  const handleExecute = async () => {
    if (!scriptContent.trim()) {
      alert('테스트할 스크립트를 입력해주세요.');
      return;
    }

    if (!AIService.isConfigured()) {
      alert('AI 서비스가 설정되지 않았습니다. OpenRouter API 키를 확인해주세요.');
      return;
    }

    setIsExecuting(true);
    
    try {
      console.log('🧪 테스트 스크립트 생성 시작...');
      
      // AI를 통해 테스트 스크립트 생성
      const testRequest: TestRequest = {
        script: scriptContent,
        templateId: templateId,
        os: selectedOS,
        application: selectedApplication,
        inspectionConfig: inspectionConfig
      };

      const testResponse: TestResponse = await AIService.generateTestScript(testRequest);
      
      // 테스트 스크립트 실행 시뮬레이션
      console.log('🚀 테스트 스크립트 실행 중...');
      
      // 테스트 결과 생성 (실제로는 서버에서 실행하겠지만 여기서는 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 테스트 결과를 로컬 스토리지에 저장
      const testResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        scriptName: `${templateId} Test`,
        originalScript: scriptContent,
        testScript: testResponse.testScript,
        testCases: testResponse.testCases,
        expectedResults: testResponse.expectedResults,
        explanation: testResponse.explanation,
        status: 'completed',
        templateId: templateId,
        os: selectedOS,
        application: selectedApplication,
        results: testResponse.testCases.map((testCase, index) => ({
          testCase,
          expectedResult: testResponse.expectedResults[index] || '결과 확인 필요',
          actualResult: Math.random() > 0.2 ? '성공' : '실패', // 랜덤 결과 생성
          status: Math.random() > 0.2 ? 'passed' : 'failed'
        }))
      };
      
      // 기존 테스트 결과들 가져오기
      const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]');
      existingResults.unshift(testResult);
      
      // 최대 50개까지만 보관
      if (existingResults.length > 50) {
        existingResults.splice(50);
      }
      
      localStorage.setItem('testResults', JSON.stringify(existingResults));
      
      console.log('✅ 테스트 완료!', testResult);
      console.log('💾 로컬스토리지에 저장된 데이터:', existingResults);
    
      // 데이터 저장 후 약간의 지연을 두고 페이지 이동
      setTimeout(() => {
        console.log('🧭 테스트 결과 페이지로 이동...');
        // 페이지 이동 후 강제 새로고침을 위한 이벤트 발생
        navigate('/test-results');
        // 추가적으로 storage 이벤트를 발생시켜 다른 탭에서도 감지할 수 있도록 함
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'testResults',
          newValue: JSON.stringify(existingResults),
          storageArea: localStorage
        }));
      }, 100);
      
    } catch (error) {
      console.error('❌ 테스트 실행 실패:', error);
      
      let errorMessage = '테스트 실행 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('API 키')) {
          errorMessage = '❌ OpenRouter API 키 문제:\\n\\n' + error.message + '\\n\\n.env 파일을 확인해주세요.';
        } else if (error.message.includes('401')) {
          errorMessage = '❌ 인증 오류:\\nOpenRouter API 키가 유효하지 않습니다.';
        } else if (error.message.includes('429')) {
          errorMessage = '❌ 요청 한도 초과:\\n잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('네트워크')) {
          errorMessage = '❌ 네트워크 오류:\\n인터넷 연결을 확인해주세요.';
        } else {
          errorMessage = '❌ 오류 발생:\n' + error.message;
        }
      }
      
      alert(errorMessage);
      
    } finally {
      setIsExecuting(false);
    }
  };

  const handleImprove = async () => {
    if (!aiRequirement.trim()) {
      alert('AI에게 전달할 요구사항을 입력해주세요.');
      return;
    }

    // API 키 확인
    if (!AIService.isConfigured()) {
      alert('OpenRouter API 키가 설정되지 않았습니다.\n\n.env 파일에 다음 내용을 추가해주세요:\nVITE_OPENROUTER_API_KEY=your_api_key_here');
      return;
    }
    
    setIsAiProcessing(true);
    
    try {

      
      const aiResponse = await AIService.improveScript({
        currentScript: scriptContent,
        requirement: aiRequirement,
        templateId: templateId,
        os: selectedOS,
        application: selectedApplication,
        inspectionConfig: inspectionConfig
      });

      // 개선된 스크립트로 업데이트
      setScriptContent(aiResponse.improvedScript);
      
      // 성공 시 요구사항 초기화
      setAiRequirement('');
      
      // 변경 사항 안내
      const changesList = aiResponse.changes.map(change => '• ' + change).join('\n');
      const message = '🎉 AI가 스크립트를 성공적으로 개선했습니다!\n\n📋 주요 변경사항:\n' + changesList + '\n\n💡 설명:\n' + aiResponse.explanation;
      
      // 알림 대신 콘솔에 상세 정보 출력
      alert(message.length > 200 ? '✅ AI가 스크립트를 성공적으로 개선했습니다!\n' + message : message);
      
    } catch (error) {
      console.error('❌ AI 스크립트 개선 실패:', error);
      
      let errorMessage = 'AI 스크립트 개선 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('API 키')) {
          errorMessage = '❌ OpenRouter API 키 문제:\n\n' + error.message + '\n\n.env 파일을 확인해주세요.';
        } else if (error.message.includes('401')) {
          errorMessage = '❌ 인증 오류:\nOpenRouter API 키가 유효하지 않습니다.';
        } else if (error.message.includes('429')) {
          errorMessage = '❌ 요청 한도 초과:\n잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('네트워크')) {
          errorMessage = '❌ 네트워크 오류:\n인터넷 연결을 확인해주세요.';
        } else {
          errorMessage = '❌ 오류 발생:\n' + error.message;
        }
      }
      
      alert(errorMessage);
      
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <LoadingOverlay 
      isLoading={isExecuting} 
      loadingText="🧪 AI가 테스트 스크립트를 생성하고 실행하고 있습니다..."
      className="h-screen"
    >
      <PageTransition className="h-screen flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/scripts/new')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            새 스크립트로 돌아가기
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">스크립트 에디터</h1>
            <Badge variant="outline" className="px-3 py-1">
              {templateId.toUpperCase()}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Bash Script
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            title="스크립트 복사 (Ctrl+Shift+C)"
            className={isCopied ? 'border-green-500 text-green-600' : ''}
          >
            {isCopied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {isCopied ? '복사됨!' : '복사'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} title="저장 (Ctrl+S)">
            <Save className="h-4 w-4 mr-2" />
            저장
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExecute}
            disabled={isExecuting}
            title="테스트 실행 (F5)"
          >
            {isExecuting ? (
              <Square className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isExecuting ? '테스트 중...' : '테스트 실행'}
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측: 스크립트 에디터 */}
        <div className="flex-1 flex flex-col border-r overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <MonacoEditor
              initialContent={scriptContent}
              onChange={setScriptContent}
              language="bash"
              theme="dark"
              minimapEnabled={minimapEnabled}
              onSave={handleSave}
            />
          </div>
          
          {/* 에디터 상태바 */}
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Bash Script</span>
              <span>UTF-8</span>
              <span>LF</span>
              <span>Spaces: 2</span>
            </div>
            <div className="flex items-center gap-4">
              <span>줄: {scriptContent.split('\n').length}</span>
              <span>문자: {scriptContent.length}</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>준비됨</span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 설정 패널들 */}
        <div className="w-96 flex flex-col bg-background overflow-y-auto">
          {/* 1. 환경설정 */}
          <Card className="m-4 mb-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Server className="h-4 w-4 text-primary" />
                1. 환경설정
              </CardTitle>
              <CardDescription className="text-xs">운영체제, 애플리케이션</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">운영체제</Label>
                <Select value={selectedOS} onValueChange={setSelectedOS}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="OS 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {OS_OPTIONS.map((os) => (
                      <SelectItem key={os.value} value={os.value}>
                        {os.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">애플리케이션</Label>
                <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="애플리케이션 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_OPTIONS.map((app) => (
                      <SelectItem key={app.value} value={app.value}>
                        {app.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 2. 점검항목 설정 */}
          <Card className="m-4 mb-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Settings className="h-4 w-4 text-primary" />
                점검항목 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Tabs value={selectedInspectionType} onValueChange={setSelectedInspectionType}>
                <TabsList className="grid w-full grid-cols-3 h-8">
                  <TabsTrigger value="config_file" className="text-xs">설정파일</TabsTrigger>
                  <TabsTrigger value="process" className="text-xs">프로세스</TabsTrigger>
                  <TabsTrigger value="account" className="text-xs">계정</TabsTrigger>
                </TabsList>
                
                <TabsContent value="config_file" className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Label className="text-xs">설정파일 경로</Label>
                    <Input
                      placeholder="/etc/ssh/sshd_config"
                      value={inspectionConfig.configPath}
                      onChange={(e) => handleInspectionConfigChange('configPath', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">권한</Label>
                    <Input
                      placeholder="644"
                      value={inspectionConfig.permission}
                      onChange={(e) => handleInspectionConfigChange('permission', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="process" className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Label className="text-xs">프로세스 명</Label>
                    <Input
                      placeholder="sshd"
                      value={inspectionConfig.processName}
                      onChange={(e) => handleInspectionConfigChange('processName', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="account" className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Label className="text-xs">계정 명</Label>
                    <Input
                      placeholder="mysql"
                      value={inspectionConfig.accountName}
                      onChange={(e) => handleInspectionConfigChange('accountName', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 3. 검사조건 설정 */}
          <Card className="m-4 mb-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                검사조건 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-green-700">Pass 조건</Label>
                <Textarea
                  placeholder="성공 조건을 입력하세요"
                  value={inspectionConfig.passCondition}
                  onChange={(e) => handleInspectionConfigChange('passCondition', e.target.value)}
                  className="min-h-[60px] text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-red-700">Fail 조건</Label>
                <Textarea
                  placeholder="실패 조건을 입력하세요"
                  value={inspectionConfig.failCondition}
                  onChange={(e) => handleInspectionConfigChange('failCondition', e.target.value)}
                  className="min-h-[60px] text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. 스크립트 도구 */}
          <Card className="m-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                스크립트 도구
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* AI 요구사항 입력 폼 */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-2">
                  AI 개선 요구사항
                  {isAiProcessing && (
                    <span className="text-blue-500 text-xs">
                      (Claude Sonnet 4 처리 중...)
                    </span>
                  )}
                </Label>
                <Textarea
                  placeholder="예: 로그 출력을 더 상세하게 해주세요&#10;예: 에러 처리를 추가해주세요&#10;예: 성능을 최적화해주세요&#10;예: 주석을 한국어로 추가해주세요"
                  value={aiRequirement}
                  onChange={(e) => setAiRequirement(e.target.value)}
                  className="min-h-[80px] text-xs resize-none"
                  disabled={isAiProcessing}
                />
                <div className="text-xs text-muted-foreground">
                  {isAiProcessing 
                    ? '🤖 Claude Sonnet 4가 스크립트를 분석하고 개선하고 있습니다...'
                    : '구체적인 요구사항을 입력하면 AI가 더 정확하게 스크립트를 개선합니다.'
                  }
                </div>
                
                {/* 빠른 요구사항 템플릿 */}
                <div className="flex flex-wrap gap-1">
                  {[
                    '로깅 개선',
                    '에러 처리 강화',
                    '성능 최적화',
                    '보안 강화',
                    '코드 정리',
                    '주석 추가'
                  ].map((template) => (
                    <Button
                      key={template}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setAiRequirement(prev => 
                        prev ? `${prev}\n${template} 해주세요.` : `${template} 해주세요.`
                      )}
                      disabled={isAiProcessing}
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleImprove}
                  className="flex-1 gap-2 text-sm h-8"
                  variant="default"
                  disabled={!aiRequirement.trim() || isAiProcessing}
                >
                  {isAiProcessing ? (
                    <>
                      <div className="flex items-center gap-0.5">
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse delay-100"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
                      </div>
                      <span className="text-xs">AI 처리 중</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      AI 개선
                    </>
                  )}
                </Button>
                
                {aiRequirement.trim() && !isAiProcessing && (
                  <Button 
                    onClick={() => setAiRequirement('')}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    title="요구사항 초기화"
                  >
                    ✕
                  </Button>
                )}
              </div>
              
              <Button 
                onClick={() => console.log('문법 검사')}
                className="w-full gap-2 text-sm h-8"
                variant="outline"
              >
                <CheckCircle className="h-4 w-4" />
                문법 검사
              </Button>
              
              <Button 
                onClick={() => console.log('스크립트 템플릿')}
                className="w-full gap-2 text-sm h-8"
                variant="outline"
              >
                <Code className="h-4 w-4" />
                코드 스니펫
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
    </LoadingOverlay>
  );
}