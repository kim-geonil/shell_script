import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { addTab, setActiveTab, updateTab } from '../store/slices/tabsSlice';
import { toast } from 'sonner';
import MonacoEditor from '../components/editor/MonacoEditor';
import { Shield, Play, Square, Save, Upload, Plus, Terminal, FileText, Clock } from 'lucide-react';

// 기본 스크립트 템플릿
const DEFAULT_TEMPLATES: Record<string, string> = {
  'basic': `#!/bin/bash
# 기본 보안 검사 스크립트 템플릿

# 설정
LOG_FILE="/var/log/security_check.log"
SCRIPT_NAME="$(basename "$0")"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "=== $SCRIPT_NAME 실행 시작 ($DATE) ===" | tee "$LOG_FILE"

# 공통 함수 정의
log_result() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    echo "[$test_name] $result: $details" | tee -a "$LOG_FILE"
}

check_file_permission() {
    local file="$1"
    local expected_perm="$2"
    
    if [[ -f "$file" ]]; then
        actual_perm=$(stat -c "%a" "$file")
        if [[ "$actual_perm" == "$expected_perm" ]]; then
            log_result "FILE_PERMISSION" "PASS" "$file has correct permissions ($actual_perm)"
            return 0
        else
            log_result "FILE_PERMISSION" "FAIL" "$file has incorrect permissions (actual: $actual_perm, expected: $expected_perm)"
            return 1
        fi
    else
        log_result "FILE_PERMISSION" "FAIL" "$file does not exist"
        return 1
    fi
}

# 메인 검사 로직
main() {
    echo "보안 검사를 시작합니다..."
    
    # 여기에 검사 로직을 추가하세요
    
    echo "보안 검사가 완료되었습니다."
}

# 스크립트 실행
main "$@"

echo "=== $SCRIPT_NAME 실행 완료 ($DATE) ===" | tee -a "$LOG_FILE"
`,
  'u102': `#!/bin/bash
# U-102: 패스워드 복잡성 설정 검사

LOG_FILE="/var/log/security_check_u102.log"

echo "=== U-102 패스워드 복잡성 설정 검사 시작 ===" | tee "$LOG_FILE"

check_password_policy() {
    echo "패스워드 정책 검사 중..." | tee -a "$LOG_FILE"
    
    # /etc/pam.d/common-password 검사
    if grep -q "pam_pwquality.so" /etc/pam.d/common-password; then
        echo "PASS: pam_pwquality 모듈이 설정되어 있습니다" | tee -a "$LOG_FILE"
        
        # 구체적인 정책 확인
        if grep -q "minlen=" /etc/security/pwquality.conf; then
            minlen=$(grep "^minlen" /etc/security/pwquality.conf | cut -d'=' -f2 | tr -d ' ')
            echo "INFO: 최소 길이 설정: $minlen" | tee -a "$LOG_FILE"
        fi
        
        if grep -q "minclass=" /etc/security/pwquality.conf; then
            minclass=$(grep "^minclass" /etc/security/pwquality.conf | cut -d'=' -f2 | tr -d ' ')
            echo "INFO: 최소 문자 클래스: $minclass" | tee -a "$LOG_FILE"
        fi
        
    else
        echo "FAIL: pam_pwquality 모듈이 설정되어 있지 않습니다" | tee -a "$LOG_FILE"
    fi
}

check_password_policy

echo "=== U-102 검사 완료 ===" | tee -a "$LOG_FILE"
`,
  'u103': `#!/bin/bash
# U-103: 계정 잠금 임계값 설정 검사

LOG_FILE="/var/log/security_check_u103.log"

echo "=== U-103 계정 잠금 임계값 설정 검사 시작 ===" | tee "$LOG_FILE"

check_account_lockout() {
    echo "계정 잠금 정책 검사 중..." | tee -a "$LOG_FILE"
    
    # pam_tally2 또는 pam_faillock 설정 검사
    if grep -E "(pam_tally2|pam_faillock)" /etc/pam.d/common-auth; then
        echo "PASS: 계정 잠금 모듈이 설정되어 있습니다" | tee -a "$LOG_FILE"
        
        # pam_tally2 설정 확인
        if grep -q "pam_tally2" /etc/pam.d/common-auth; then
            tally_config=$(grep "pam_tally2" /etc/pam.d/common-auth)
            echo "INFO: pam_tally2 설정: $tally_config" | tee -a "$LOG_FILE"
        fi
        
        # pam_faillock 설정 확인
        if grep -q "pam_faillock" /etc/pam.d/common-auth; then
            faillock_config=$(grep "pam_faillock" /etc/pam.d/common-auth)
            echo "INFO: pam_faillock 설정: $faillock_config" | tee -a "$LOG_FILE"
        fi
        
    else
        echo "FAIL: 계정 잠금 모듈이 설정되어 있지 않습니다" | tee -a "$LOG_FILE"
    fi
}

check_account_lockout

echo "=== U-103 검사 완료 ===" | tee -a "$LOG_FILE"
`
};

interface ScriptEditorProps {
  scriptId?: string | null;
}

export default function ScriptEditor({ scriptId: propScriptId }: ScriptEditorProps = {}) {
  const scriptId = propScriptId;
  const dispatch = useAppDispatch();
  
  const { tabs, activeTabId: activeTab } = useAppSelector((state) => state.tabs);
  const { user } = useAppSelector((state) => state.auth);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  // 새 탭 생성
  const createNewTab = (template: keyof typeof DEFAULT_TEMPLATES = 'basic', customContent?: string, customTitle?: string) => {
    const newTabId = `script-${Date.now()}`;
    const newTab = {
      id: newTabId,
      title: customTitle || `새 스크립트 ${tabs.length + 1}`,
      content: customContent || DEFAULT_TEMPLATES[template] || DEFAULT_TEMPLATES['basic'],
      type: 'script' as const,
      isDirty: false,
      isReadOnly: false,
    };
    
    dispatch(addTab(newTab));
    dispatch(setActiveTab(newTabId));
  };

  // 탭 닫기
  const closeTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.isDirty) {
      const confirmed = confirm('저장하지 않은 변경 사항이 있습니다. 정말 닫으시겠습니까?');
      if (!confirmed) return;
    }
    
    console.log('탭 닫기:', tabId);
  };

  // 스크립트 저장
  const handleSave = async (content: string) => {
    if (!activeTab) return;
    
    try {
      console.log('스크립트 저장:', { tabId: activeTab, content });
      
      dispatch(updateTab({
        id: activeTab,
        changes: { content, isDirty: false }
      }));
      
      toast.success('스크립트가 저장되었습니다');
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다');
      throw error;
    }
  };

  // 스크립트 실행
  const handleExecute = async () => {
    if (!activeTab) return;
    
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return;
    
    setIsExecuting(true);
    setShowOutput(true);
    setExecutionOutput('스크립트 실행 중...\n');
    
    try {
      setTimeout(() => {
        const mockOutput = `
=== 스크립트 실행 결과 ===
실행 시간: ${new Date().toLocaleString()}
사용자: ${user?.username || 'test_user'}

스크립트 검증 중...
✓ 구문 검사 완료
✓ 보안 규칙 검사 완료

실행 결과:
[FILE_PERMISSION] PASS: /etc/passwd has correct permissions (644)
[SERVICE_STATUS] PASS: ssh service is active
[PASSWORD_POLICY] PASS: Password complexity is configured

=== 실행 완료 ===
종료 코드: 0
        `;
        
        setExecutionOutput(mockOutput);
        setIsExecuting(false);
        toast.success('스크립트 실행이 완료되었습니다');
      }, 3000);
      
    } catch (error) {
      console.error('실행 실패:', error);
      setExecutionOutput(prev => prev + '\n❌ 실행 중 오류가 발생했습니다: ' + error);
      setIsExecuting(false);
      toast.error('스크립트 실행에 실패했습니다');
    }
  };

  // 실행 중단
  const handleStop = () => {
    setIsExecuting(false);
    setExecutionOutput(prev => prev + '\n\n⏹️ 사용자에 의해 중단됨');
    toast.info('스크립트 실행이 중단되었습니다');
  };

  // 파일 가져오기
  const handleFileImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sh,.bash,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        createNewTab('basic', content, file.name);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // 현재 활성 탭 정보
  const currentTab = tabs.find(t => t.id === activeTab);

  // 초기 탭 생성
  useEffect(() => {
    if (tabs.length === 0) {
      if (scriptId) {
        console.log('스크립트 로드:', scriptId);
        
        if (scriptId === 'u102-template') {
          createNewTab('u102', undefined, 'U-102 패스워드 복잡성 검사');
        } else if (scriptId === 'u103-template') {
          createNewTab('u103', undefined, 'U-103 계정 잠금 임계값 검사');
        } else if (scriptId.startsWith('u102-') || scriptId.startsWith('u103-') || scriptId.startsWith('u106-')) {
          const templateType = scriptId.startsWith('u102-') ? 'u102' : 
                              scriptId.startsWith('u103-') ? 'u103' : 'basic';
          createNewTab(templateType as keyof typeof DEFAULT_TEMPLATES, undefined, `기존 스크립트 (${scriptId})`);
        } else {
          createNewTab('basic');
        }
      } else {
        createNewTab('basic');
      }
    }
  }, [scriptId, tabs.length]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col cyber-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Terminal className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 h-6 w-6 text-primary animate-pulse opacity-30">
                <Terminal className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              스크립트 에디터
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => createNewTab('basic')}
              className="cyber-button px-3 py-1.5 text-sm flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              새 스크립트
            </button>
            
            <button
              onClick={handleFileImport}
              className="cyber-button px-3 py-1.5 text-sm flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              가져오기
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {currentTab && (
            <>
              <button
                onClick={handleExecute}
                disabled={isExecuting || !currentTab.content.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  isExecuting || !currentTab.content.trim()
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 glow-accent'
                }`}
              >
                <Play className="h-4 w-4" />
                {isExecuting ? '실행 중...' : '실행'}
              </button>
              
              {isExecuting && (
                <button
                  onClick={handleStop}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-all duration-300 flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  중단
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex border-b border-border/50 bg-card/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 group ${
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{tab.title}</span>
              {tab.isDirty && (
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive rounded p-1 transition-all duration-200"
              >
                ×
              </button>
            </button>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 flex">
        {tabs.length > 0 ? (
          <>
            {/* Editor */}
            <div className={`${showOutput ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`h-full ${activeTab === tab.id ? 'block' : 'hidden'}`}
                >
                  <MonacoEditor
                    scriptId={tab.id}
                    initialContent={tab.content}
                    readOnly={tab.isReadOnly}
                    height="100%"
                    theme="dark"
                    onChange={(content) => {
                      dispatch(updateTab({
                        id: tab.id,
                        changes: { 
                          content, 
                          isDirty: content !== tab.content 
                        }
                      }));
                    }}
                    onSave={(content) => handleSave(content)}
                  />
                </div>
              ))}
            </div>
            
            {/* Output Panel */}
            {showOutput && (
              <div className="w-1/2 border-l border-border/50 cyber-card rounded-none">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-primary">실행 결과</h3>
                  </div>
                  <button
                    onClick={() => setShowOutput(false)}
                    className="hover:bg-accent rounded p-1 transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <div className="h-[calc(100%-4rem)] overflow-auto p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                    {executionOutput}
                  </pre>
                  
                  {isExecuting && (
                    <div className="flex items-center gap-2 mt-4 text-primary">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">실행 중...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <Terminal className="h-16 w-16 text-primary mx-auto" />
                <div className="absolute inset-0 h-16 w-16 text-primary animate-pulse opacity-30 mx-auto">
                  <Terminal className="h-16 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">스크립트 에디터</h2>
                <p className="text-muted-foreground">
                  새 스크립트를 생성하거나 기존 파일을 가져와 편집을 시작하세요
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => createNewTab('basic')}
                  className="cyber-button px-6 py-3 font-medium flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  새 스크립트
                </button>
                
                <button 
                  onClick={handleFileImport}
                  className="cyber-button px-6 py-3 font-medium flex items-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  파일 가져오기
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">또는 템플릿으로 시작:</p>
                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => createNewTab('u102')}
                    className="cyber-button px-4 py-2 text-sm"
                  >
                    U-102 템플릿
                  </button>
                  <button 
                    onClick={() => createNewTab('u103')}
                    className="cyber-button px-4 py-2 text-sm"
                  >
                    U-103 템플릿
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}