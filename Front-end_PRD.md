# **NcuScript Automator 프론트엔드 개발 PRD**

## **Frontend Development Product Requirements Document - Complete Version**

### **1. 프로젝트 개요**

NcuScript Automator의 프론트엔드는 보안 전문가를 위한 신뢰성 있고 효율적인 웹 애플리케이션입니다. 사용자가 자연어로 보안 요구사항을 입력하면 AI가 생성한 스크립트와 테스트 코드를 확인, 편집, 실행할 수 있는 통합 환경을 제공합니다.

#### **1.1 핵심 가치**
- **전문성**: 보안 업계의 신뢰를 얻을 수 있는 안정적이고 정교한 UI/UX
- **효율성**: 스크립트 생성부터 실행까지 원스톱 워크플로우
- **접근성**: 주니어 엔지니어도 쉽게 사용할 수 있는 직관적인 인터페이스
- **확장성**: 미래 기능 추가를 고려한 모듈식 아키텍처

### **2. 디자인 원칙 및 비전**

#### **2.1 보안 업계 신뢰성을 위한 디자인 철학**

**색상 팔레트**
```css
/* Primary Colors */
--primary-dark: #0A1628;      /* 깊은 네이비 - 메인 배경 */
--primary-blue: #1E3A5F;      /* 신뢰의 파란색 - 주요 액션 */
--accent-cyan: #00D4FF;       /* 하이라이트 시안 */
--success-green: #00C851;     /* 성공 상태 */
--warning-amber: #FFB300;     /* 경고 상태 */
--danger-red: #D32F2F;        /* 위험/오류 상태 */

/* Neutral Colors */
--neutral-900: #0F172A;       /* 가장 어두운 */
--neutral-700: #334155;       /* 어두운 회색 */
--neutral-500: #64748B;       /* 중간 회색 */
--neutral-300: #CBD5E1;       /* 밝은 회색 */
--neutral-100: #F1F5F9;       /* 가장 밝은 */
```

**디자인 특징**
- **다크 테마 기본**: 장시간 모니터링 작업을 고려한 눈의 피로 최소화
- **고대비**: WCAG 2.1 AAA 기준 충족으로 가독성 극대화
- **미니멀리즘**: 불필요한 장식 요소 배제, 기능에 집중
- **데이터 중심**: 정보의 계층 구조를 명확히 표현
- **일관성**: 모든 컴포넌트에 통일된 디자인 언어 적용

#### **2.2 타이포그래피**
```css
/* Font System */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;

/* Font Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 32px;

/* Font Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### **3. 기술 스택**

```javascript
{
  "core": {
    "framework": "React 18.2+",
    "language": "TypeScript 5.0+",
    "bundler": "Vite 4.0+",
    "packageManager": "pnpm"
  },
  "stateManagement": {
    "global": "Redux Toolkit + RTK Query",
    "local": "React Hook Form + Zod",
    "server": "React Query (TanStack Query)"
  },
  "styling": {
    "cssFramework": "Tailwind CSS 3.3+",
    "components": "Headless UI + Radix UI",
    "animations": "Framer Motion",
    "cssInJs": "Styled Components (선택적)"
  },
  "codeDisplay": {
    "editor": "CodeMirror 6",
    "syntax": "Prism.js",
    "diff": "diff2html"
  },
  "utilities": {
    "http": "Axios + Interceptors",
    "websocket": "Socket.io-client",
    "clipboard": "react-copy-to-clipboard",
    "virtualization": "react-window",
    "datetime": "date-fns",
    "icons": "Lucide React"
  },
  "testing": {
    "unit": "Jest + React Testing Library",
    "e2e": "Cypress",
    "visual": "Chromatic"
  },
  "development": {
    "linting": "ESLint + Prettier",
    "preCommit": "Husky + lint-staged",
    "storybook": "Storybook 7.0+"
  }
}
```

### **4. 핵심 페이지 및 컴포넌트 구조**

#### **4.1 페이지 계층 구조**

```
/
├── /auth
│   ├── /login                    # 로그인
│   ├── /register                 # 회원가입
│   └── /forgot-password          # 비밀번호 찾기
├── /dashboard                    # 대시보드
├── /script-generator             # 스크립트 생성 (메인)
├── /scripts
│   ├── /                        # 스크립트 목록
│   ├── /:id                     # 스크립트 상세/편집
│   └── /:id/versions            # 버전 히스토리
├── /templates                    # 템플릿 라이브러리
├── /analytics                    # 사용 통계
├── /settings                     # 설정
│   ├── /profile                 # 프로필
│   ├── /security                # 보안 설정
│   └── /api-keys                # API 키 관리
└── /help                        # 도움말 센터
```

#### **4.2 레이아웃 구조**

```jsx
<AppLayout>
  <Header>
    <Logo />
    <Navigation />
    <SearchBar />
    <NotificationBell />
    <UserMenu />
  </Header>
  
  <MainContent>
    <Sidebar collapsible={true}>
      <MenuItems />
      <RecentScripts />
      <QuickActions />
    </Sidebar>
    
    <ContentArea>
      <Breadcrumb />
      <PageHeader />
      <WorkSpace />
    </ContentArea>
    
    <RightPanel toggleable={true}>
      <ContextualInfo />
      <ExecutionLog />
      <CollaborationPanel />
    </RightPanel>
  </MainContent>
  
  <StatusBar>
    <NetworkStatus />
    <SyncStatus />
    <PerformanceMetrics />
  </StatusBar>
</AppLayout>
```

### **5. 주요 기능별 상세 사양**

#### **5.1 스크립트 생성 페이지 (핵심 기능)**

**컴포넌트 구조**
```jsx
<ScriptGeneratorPage>
  <RequirementInput>
    <NaturalLanguageInput 
      placeholder="보안 점검 요구사항을 자연어로 입력하세요"
      maxLength={2000}
      autoFocus={true}
    />
    <AdvancedOptions collapsible={true}>
      <TargetOSSelector multiple={true} />
      <SecurityLevelSelector />
      <TemplateSelector />
      <ComplianceSelector />
    </AdvancedOptions>
    <ActionButtons>
      <GenerateButton loading={isGenerating} />
      <SaveDraftButton />
      <ImportButton />
    </ActionButtons>
  </RequirementInput>
  
  <GenerationProgress visible={isGenerating}>
    <ProgressSteps current={currentStep} />
    <StreamingPreview content={partialContent} />
    <EstimatedTime remaining={timeRemaining} />
    <CancelButton />
  </GenerationProgress>
  
  <ScriptOutput>
    <TabContainer>
      <Tab name="Script" badge={hasErrors ? errorCount : null}>
        <SecurityValidator code={generatedScript} />
        <CodeViewer 
          code={generatedScript}
          language="bash"
          editable={true}
          lineNumbers={true}
          onCodeChange={handleCodeChange}
        />
        <ActionBar>
          <CopyButton onClick={handleCopy} />
          <DownloadButton onClick={handleDownload} />
          <RunButton onClick={handleRun} />
          <ShareButton onClick={handleShare} />
        </ActionBar>
      </Tab>
      
      <Tab name="Test Code">
        <CodeViewer 
          code={testCode}
          language="bash"
          editable={true}
          lineNumbers={true}
        />
      </Tab>
      
      <Tab name="Documentation">
        <MarkdownViewer content={documentation} />
      </Tab>
      
      <Tab name="Remediation Guide">
        <RemediationGuide items={remediationSteps} />
      </Tab>
    </TabContainer>
  </ScriptOutput>
</ScriptGeneratorPage>
```

**UI/UX 요구사항**
- 입력 영역은 화면 상단 1/3 차지
- 코드 출력 영역은 하단 2/3 차지
- 생성 중 실시간 진행 상태 표시 (스트리밍)
- 단축키 지원: Ctrl+Enter (생성), Ctrl+S (저장)
- 자동 저장: 30초마다 드래프트 저장
- 실행 취소/재실행: Ctrl+Z / Ctrl+Shift+Z

#### **5.2 코드 뷰어/편집기 컴포넌트**

**기능 요구사항**
```typescript
interface CodeViewerProps {
  code: string;
  language: 'bash' | 'bats' | 'json' | 'yaml';
  editable?: boolean;
  lineNumbers?: boolean;
  highlightLines?: number[];
  errorLines?: number[];
  warningLines?: number[];
  onCodeChange?: (code: string) => void;
  theme?: 'dark' | 'light';
  height?: string | number;
}

// 주요 기능
- Syntax highlighting (언어별 문법 강조)
- 줄 번호 표시
- 검색/바꾸기 (Ctrl+F / Ctrl+H)
- 코드 접기/펼치기
- 에러/경고 라인 강조
- 읽기 전용/편집 모드 전환
- 자동 들여쓰기
- 괄호 매칭
- 자동 완성 (선택적)
```

**디자인 사양**
```css
.code-viewer {
  background: var(--neutral-900);
  border: 1px solid var(--neutral-700);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  position: relative;
}

.line-number {
  color: var(--neutral-500);
  user-select: none;
  padding-right: 16px;
  text-align: right;
  min-width: 50px;
}

.error-line {
  background: rgba(211, 47, 47, 0.1);
  border-left: 3px solid var(--danger-red);
}

.warning-line {
  background: rgba(255, 179, 0, 0.1);
  border-left: 3px solid var(--warning-amber);
}

/* Syntax Highlighting */
.syntax-keyword { color: #FF79C6; }
.syntax-string { color: #F1FA8C; }
.syntax-comment { color: #6272A4; }
.syntax-function { color: #50FA7B; }
.syntax-variable { color: #8BE9FD; }
.syntax-operator { color: #FFB86C; }
```

#### **5.3 클립보드 복사 기능**

**컴포넌트 구조**
```jsx
<CopyButton 
  content={code}
  onCopy={handleCopySuccess}
  tooltip="클립보드에 복사 (Ctrl+C)"
>
  {({ copied }) => (
    <>
      {copied ? <IconCheck /> : <IconCopy />}
      <span>{copied ? '복사됨' : '복사'}</span>
    </>
  )}
</CopyButton>
```

**복사 옵션**
```typescript
interface CopyOptions {
  format: 'plain' | 'markdown' | 'rich';
  includeLineNumbers?: boolean;
  includeComments?: boolean;
  selection?: {
    start: number;
    end: number;
  };
}

// 복사 성공 시 피드백
<Toast 
  message="클립보드에 복사되었습니다"
  type="success"
  duration={2000}
  position="bottom-right"
  action={{
    label: "실행 취소",
    onClick: handleUndo
  }}
/>
```



#### **5.5 대시보드**

**대시보드 구성**
```jsx
<Dashboard>
  <WelcomeHeader user={currentUser} />
  
  <StatsGrid>
    <StatCard 
      title="생성된 스크립트"
      value={stats.totalScripts}
      trend={{
        value: 12,
        direction: 'up',
        period: '지난주 대비'
      }}
      icon={<IconScript />}
      color="primary"
    />
    <StatCard 
      title="실행 성공률"
      value={`${stats.successRate}%`}
      trend={{
        value: 2.1,
        direction: 'up'
      }}
      icon={<IconCheckCircle />}
      color="success"
    />
    <StatCard 
      title="절약된 시간"
      value={`${stats.timeSaved}시간`}
      trend={{
        value: 18,
        direction: 'up'
      }}
      icon={<IconClock />}
      color="info"
    />
    <StatCard 
      title="활성 템플릿"
      value={stats.activeTemplates}
      icon={<IconTemplate />}
      color="secondary"
    />
  </StatsGrid>
  
  <DashboardContent>
    <RecentActivity>
      <SectionHeader>
        <h3>최근 활동</h3>
        <ViewAllLink to="/scripts" />
      </SectionHeader>
      <ActivityList items={recentActivities} />
    </RecentActivity>
    
    <QuickActions>
      <SectionHeader>
        <h3>빠른 실행</h3>
      </SectionHeader>
      <ActionGrid>
        <QuickActionCard
          icon={<IconPlus />}
          title="새 스크립트 생성"
          description="보안 점검 스크립트를 생성합니다"
          onClick={() => navigate('/script-generator')}
        />
        <QuickActionCard
          icon={<IconSearch />}
          title="템플릿 찾아보기"
          description="사전 정의된 템플릿을 탐색합니다"
          onClick={() => navigate('/templates')}
        />
        <QuickActionCard
          icon={<IconHistory />}
          title="실행 이력"
          description="과거 실행 결과를 확인합니다"
          onClick={() => navigate('/execution?view=history')}
        />
      </ActionGrid>
    </QuickActions>
  </DashboardContent>
  
  <PerformanceWidget>
    <MiniChart
      title="API 사용량"
      data={apiUsageData}
      type="area"
    />
  </PerformanceWidget>
</Dashboard>
```

#### **5.6 실시간 협업 기능**

```jsx
<CollaborationPanel>
  <ActiveUsersBar>
    <UserAvatarGroup users={activeUsers} max={5} />
    <PresenceCursor users={activeUsers} />
  </ActiveUsersBar>
  
  <ShareControls>
    <ShareButton onClick={generateShareLink}>
      링크 공유
    </ShareButton>
    <PermissionSelector
      options={['view', 'edit', 'admin']}
      onChange={handlePermissionChange}
    />
  </ShareControls>
  
  <EditingIndicator visible={hasActiveEditors}>
    {activeEditors.map(editor => (
      <EditorStatus key={editor.id}>
        <UserAvatar user={editor} size="sm" />
        <span>{editor.name}님이 편집 중...</span>
        <CursorPosition line={editor.cursor.line} />
      </EditorStatus>
    ))}
  </EditingIndicator>
</CollaborationPanel>
```

### **6. UI 컴포넌트 디자인 시스템**

#### **6.1 버튼 (Buttons)**

**버튼 종류 및 스타일**
```css
/* Primary Button - 주요 액션 */
.btn-primary {
  background: linear-gradient(135deg, #1E3A5F 0%, #2B4C7E 100%);
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
  transition: all 0.2s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2B4C7E 0%, #3A5F8F 100%);
  box-shadow: 0 6px 20px rgba(30, 58, 95, 0.35);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.25);
}

/* Secondary Button - 보조 액션 */
.btn-secondary {
  background: transparent;
  color: #1E3A5F;
  padding: 12px 24px;
  border: 2px solid #1E3A5F;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #1E3A5F;
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
}

/* Danger Button - 위험한 액션 */
.btn-danger {
  background: #D32F2F;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;
}

/* Icon Button - 아이콘 전용 */
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 58, 95, 0.1);
  color: #1E3A5F;
  transition: all 0.2s ease;
}

/* Loading State */
.btn-loading {
  pointer-events: none;
  opacity: 0.7;
  position: relative;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}
```

#### **6.2 모달 (Modal)**

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 22, 40, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

/* Modal Container */
.modal {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(10, 22, 40, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

/* Modal Header */
.modal-header {
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Modal Body */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 180px);
}

/* Modal Footer */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  background: #F9FAFB;
}
```

#### **6.3 입력 필드 (Input Fields)**

```css
/* Base Input */
.input {
  width: 100%;
  padding: 12px 16px;
  background: #FFFFFF;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #0F172A;
  transition: all 0.2s ease;
  outline: none;
}

.input:focus {
  border-color: #1E3A5F;
  box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
}

/* Dark Theme Input */
.input-dark {
  background: #1E293B;
  border: 2px solid #334155;
  color: #F1F5F9;
}

/* Error State */
.input-error {
  border-color: #D32F2F;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}
```

#### **6.4 토스트 알림 (Toast Notifications)**

```css
/* Toast Container */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Toast Base */
.toast {
  min-width: 300px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease;
  backdrop-filter: blur(10px);
}

/* Toast Types */
.toast-success {
  background: rgba(0, 200, 81, 0.95);
  color: #FFFFFF;
}

.toast-error {
  background: rgba(211, 47, 47, 0.95);
  color: #FFFFFF;
}

.toast-warning {
  background: rgba(255, 179, 0, 0.95);
  color: #FFFFFF;
}

.toast-info {
  background: rgba(30, 58, 95, 0.95);
  color: #FFFFFF;
}
```

### **7. 반응형 디자인**

#### **7.1 브레이크포인트**
```css
/* Tailwind CSS 기준 */
sm: 640px   /* 태블릿 세로 */
md: 768px   /* 태블릿 가로 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 대형 데스크톱 */
2xl: 1536px /* 초대형 모니터 */
```

#### **7.2 모바일 최적화**
- 좌측 사이드바 → 하단 네비게이션 바
- 우측 패널 → 스와이프 가능한 서랍(drawer)
- 코드 에디터 → 가로 스크롤 + 핀치 줌
- 버튼 크기 → 최소 44x44px (터치 타겟)

### **8. 접근성 (A11y)**

#### **8.1 ARIA 레이블링**
```jsx
<button
  aria-label="스크립트 생성"
  aria-describedby="script-gen-help"
  aria-busy={isGenerating}
  aria-live="polite"
>
  {isGenerating ? '생성 중...' : '스크립트 생성'}
</button>

<div role="region" aria-label="스크립트 출력">
  <div role="status" aria-live="assertive" aria-atomic="true">
    {statusMessage}
  </div>
</div>
```

#### **8.2 키보드 네비게이션**
- Tab 순서 논리적 구성
- 모든 인터랙티브 요소 포커스 가능
- Escape 키로 모달/드롭다운 닫기
- 화살표 키로 메뉴 탐색
- 포커스 트랩 (모달, 드롭다운)

#### **8.3 스크린 리더 지원**
```jsx
{/* Skip Links */}
<SkipLinks>
  <a href="#main-content" className="sr-only focus:not-sr-only">
    메인 콘텐츠로 이동
  </a>
  <a href="#navigation" className="sr-only focus:not-sr-only">
    네비게이션으로 이동
  </a>
</SkipLinks>

{/* Live Regions */}
<div className="sr-only" role="log" aria-live="polite" aria-relevant="additions">
  {announcements}
</div>
```

### **9. 성능 최적화**

#### **9.1 코드 분할**
```javascript
// 라우트 기반 코드 분할
const ScriptGenerator = lazy(() => import('./pages/ScriptGenerator'));
const Templates = lazy(() => import('./pages/Templates'));

// 컴포넌트 레벨 코드 분할
const CodeEditor = lazy(() => import('./components/CodeEditor'));
```

#### **9.2 상태 관리 최적화**
```javascript
// RTK Query로 서버 상태 캐싱
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Script', 'Template', 'User'],
  endpoints: (builder) => ({
    generateScript: builder.mutation({
      query: (requirements) => ({
        url: '/scripts/generate',
        method: 'POST',
        body: requirements,
      }),
      // 낙관적 업데이트
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getScripts', undefined, (draft) => {
            draft.unshift({ id: 'temp', status: 'generating', ...arg });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});
```

#### **9.3 메모이제이션 및 최적화**
```javascript
// 무거운 계산 메모이제이션
const memoizedScriptAnalysis = useMemo(() => {
  return analyzeScript(script);
}, [script]);

// 콜백 최적화
const handleScriptChange = useCallback((newScript: string) => {
  setScript(newScript);
  debouncedSave(newScript);
}, [debouncedSave]);

// Virtual Scrolling for long lists
<VirtualList
  height={600}
  itemCount={scripts.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <ScriptListItem
      key={scripts[index].id}
      script={scripts[index]}
      style={style}
    />
  )}
</VirtualList>
```

### **10. 추가 핵심 기능**

#### **10.1 실시간 스트리밍 처리**
```typescript
// SSE (Server-Sent Events) 기반 스트리밍
const useScriptGeneration = () => {
  const [stream, setStream] = useState<string>('');
  const [progress, setProgress] = useState<Progress>({
    step: 'analyzing',
    percentage: 0
  });

  const generateScript = async (requirements: string) => {
    const eventSource = new EventSource('/api/v1/scripts/generate-stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch(data.type) {
        case 'progress':
          setProgress(data.progress);
          break;
        case 'chunk':
          setStream(prev => prev + data.content);
          break;
        case 'complete':
          eventSource.close();
          break;
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // 에러 처리
    };
  };

  return { stream, progress, generateScript };
};
```

#### **10.2 오프라인 지원**
```javascript
// Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

// 오프라인 데이터 동기화
const useOfflineSync = () => {
  const [pendingSync, setPendingSync] = useState<QueuedAction[]>([]);
  
  useEffect(() => {
    const handleOnline = async () => {
      if (pendingSync.length > 0) {
        for (const action of pendingSync) {
          await syncAction(action);
        }
        setPendingSync([]);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [pendingSync]);

  const queueAction = (action: QueuedAction) => {
    if (navigator.onLine) {
      return performAction(action);
    } else {
      setPendingSync(prev => [...prev, action]);
      localStorage.setItem('offline_queue', JSON.stringify(pendingSync));
    }
  };

  return { queueAction, pendingCount: pendingSync.length };
};
```

#### **10.3 보안 검증 UI**
```typescript
const SecurityValidator: React.FC<{ code: string }> = ({ code }) => {
  const violations = useSecurityCheck(code);
  
  return (
    <SecurityPanel show={violations.length > 0}>
      <SecurityHeader severity={getMaxSeverity(violations)}>
        <WarningIcon />
        <span>{violations.length}개의 보안 경고</span>
      </SecurityHeader>
      
      <ViolationList>
        {violations.map((violation, index) => (
          <ViolationItem key={index} severity={violation.severity}>
            <LineNumber>라인 {violation.line}</LineNumber>
            <ViolationMessage>
              {violation.message}
              <CodeSnippet>{violation.snippet}</CodeSnippet>
            </ViolationMessage>
            <QuickFix onClick={() => applyFix(violation)}>
              자동 수정
            </QuickFix>
          </ViolationItem>
        ))}
      </ViolationList>
    </SecurityPanel>
  );
};
```

#### **10.4 성능 모니터링**
```typescript
const PerformanceMonitor: React.FC = () => {
  const metrics = usePerformanceMetrics();
  
  return (
    <PerformanceWidget>
      <MetricsGrid>
        <Metric
          label="API 응답 시간"
          value={metrics.apiLatency}
          unit="ms"
          threshold={1000}
          trend={metrics.apiLatencyTrend}
        />
        <Metric
          label="스크립트 생성 시간"
          value={metrics.generationTime}
          unit="s"
          threshold={60}
        />
        <Metric
          label="일일 API 사용량"
          value={metrics.apiUsage}
          max={metrics.apiLimit}
          showProgress={true}
        />
      </MetricsGrid>
      
      <PerformanceChart
        data={metrics.history}
        timeRange="24h"
        type="line"
      />
    </PerformanceWidget>
  );
};
```

#### **10.5 버전 비교 뷰**
```typescript
const VersionDiff: React.FC<{ v1: string, v2: string }> = ({ v1, v2 }) => {
  const diff = useMemo(() => createDiff(v1, v2), [v1, v2]);
  
  return (
    <DiffContainer>
      <DiffHeader>
        <VersionSelector value={v1} onChange={setV1} />
        <ArrowIcon />
        <VersionSelector value={v2} onChange={setV2} />
      </DiffHeader>
      
      <DiffView>
        {diff.chunks.map((chunk, index) => (
          <DiffChunk key={index}>
            {chunk.changes.map((change, idx) => (
              <DiffLine
                key={idx}
                type={change.type}
                lineNumberOld={change.oldLine}
                lineNumberNew={change.newLine}
              >
                <LineContent>{change.content}</LineContent>
              </DiffLine>
            ))}
          </DiffChunk>
        ))}
      </DiffView>
      
      <DiffStats>
        <Stat type="addition">+{diff.additions}</Stat>
        <Stat type="deletion">-{diff.deletions}</Stat>
      </DiffStats>
    </DiffContainer>
  );
};
```

### **11. 에러 처리 및 복구**

```typescript
// 전역 에러 바운더리
export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅
    console.error('UI Error:', error, errorInfo);
    
    // Sentry 등 에러 추적 서비스에 전송
    if (process.env.NODE_ENV === 'production') {
      captureException(error, {
        contexts: {
          react: { componentStack: errorInfo.componentStack }
        }
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// 에러 폴백 UI
const ErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError
}) => (
  <ErrorContainer>
    <ErrorIcon />
    <ErrorTitle>예기치 않은 오류가 발생했습니다</ErrorTitle>
    <ErrorMessage>{error.message}</ErrorMessage>
    <ErrorActions>
      <Button onClick={resetError}>다시 시도</Button>
      <Button variant="link" onClick={() => window.location.href = '/'}>
        홈으로 이동
      </Button>
    </ErrorActions>
    {process.env.NODE_ENV === 'development' && (
      <ErrorDetails>
        <pre>{error.stack}</pre>
      </ErrorDetails>
    )}
  </ErrorContainer>
);
```

### **12. 보안 고려사항**

#### **12.1 XSS 방지**
```javascript
// DOMPurify를 사용한 HTML sanitization
import DOMPurify from 'dompurify';

const SafeHTML: React.FC<{ html: string }> = ({ html }) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'],
    ALLOWED_ATTR: ['class']
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

#### **12.2 CSRF 보호**
```javascript
// CSRF 토큰 관리
const useCSRFToken = () => {
  const [csrfToken, setCSRFToken] = useState<string>('');
  
  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch('/api/csrf-token');
      const data = await response.json();
      setCSRFToken(data.token);
    };
    fetchToken();
  }, []);
  
  return csrfToken;
};

// Axios 인터셉터에 CSRF 토큰 추가
axios.interceptors.request.use((config) => {
  const token = getCSRFToken();
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});
```

### **13. 배포 및 환경 설정**

#### **13.1 환경 변수**
```javascript
// .env.example
VITE_API_URL=https://api.secuscript.com
VITE_WS_URL=wss://ws.secuscript.com
VITE_SENTRY_DSN=
VITE_GA_TRACKING_ID=
VITE_ENABLE_MOCK=false
VITE_MAX_FILE_SIZE=10485760
```

#### **13.2 빌드 최적화**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', '@radix-ui/react'],
          'editor': ['codemirror', '@codemirror/lang-bash'],
          'utils': ['axios', 'date-fns', 'lodash-es'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

### **14. 테스팅 전략**

#### **14.1 단위 테스트**
```javascript
// 컴포넌트 테스트 예시
describe('ScriptGenerator', () => {
  it('should generate script on submit', async () => {
    const { getByLabelText, getByText } = render(<ScriptGenerator />);
    
    const input = getByLabelText('요구사항 입력');
    await userEvent.type(input, 'SSH 접근 제한 스크립트');
    
    const generateButton = getByText('스크립트 생성');
    await userEvent.click(generateButton);
    
    await waitFor(() => {
      expect(getByText(/생성 중/)).toBeInTheDocument();
    });
  });
  
  it('should show error on invalid input', async () => {
    const { getByText } = render(<ScriptGenerator />);
    
    const generateButton = getByText('스크립트 생성');
    await userEvent.click(generateButton);
    
    expect(getByText('요구사항을 입력해주세요')).toBeInTheDocument();
  });
});
```

#### **14.2 통합 테스트**
```javascript
// Cypress E2E 테스트
describe('Script Generation Flow', () => {
  it('should complete full script generation workflow', () => {
    cy.visit('/script-generator');
    cy.get('[data-testid="requirements-input"]').type('파일 권한 검사 스크립트');
    cy.get('[data-testid="os-selector"]').select('Ubuntu 20.04');
    cy.get('[data-testid="generate-button"]').click();
    
    cy.get('[data-testid="generation-progress"]').should('be.visible');
    cy.get('[data-testid="script-output"]', { timeout: 60000 }).should('be.visible');
    
    cy.get('[data-testid="copy-button"]').click();
    cy.get('.toast-success').should('contain', '복사되었습니다');
  });
});
```

### **15. 문서화 및 스토리북**

```javascript
// Button.stories.tsx
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'danger'] }
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] }
    }
  }
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: '스크립트 생성',
  variant: 'primary',
  size: 'md'
};

export const Loading = Template.bind({});
Loading.args = {
  children: '처리 중...',
  variant: 'primary',
  loading: true
};
```

---

이 PRD는 SecuScript Automator 프론트엔드의 완전한 구현을 위한 포괄적인 가이드를 제공합니다. GPT-4 기반 스크립트 생성부터 실시간 실행, 협업 기능까지 모든 필수 기능을 다루며, 보안 업계의 신뢰성과 전문성을 반영한 디자인 시스템을 포함합니다. 개발 과정에서 이 문서를 지속적으로 참조하고 업데이트하여 일관성 있는 사용자 경험을 제공할 수 있습니다.