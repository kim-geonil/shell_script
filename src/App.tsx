import React, { useEffect, useState } from 'react';

console.log('✅ /src/App.tsx loading...');

// 매우 간단한 기본 테스트
function SimpleTest() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold text-primary">NcuScript Automator</h1>
        <p className="text-muted-foreground">✅ 기본 렌더링 성공!</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-xs text-muted-foreground">올바른 /src/App.tsx 로드됨</p>
      </div>
    </div>
  );
}

// Store 테스트
function StoreTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 Testing store import...');
    
    import('./store/index')
      .then((storeModule) => {
        console.log('✅ Store loaded:', storeModule.store);
        setStatus('success');
      })
      .catch((err) => {
        console.error('❌ Store loading failed:', err);
        setError(err.message);
        setStatus('error');
      });
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-500">Store 로딩 실패</h1>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Store 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold text-primary">NcuScript Automator</h1>
        <p className="text-green-400">✅ Store 로드 성공!</p>
        <button 
          onClick={() => window.location.href = '?full=1'}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          전체 앱 로드
        </button>
      </div>
    </div>
  );
}

// 전체 애플리케이션 로더
function FullAppLoader() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    console.log('🔄 Loading full application...');
    
    Promise.all([
      import('react-redux'),
      import('./store/index'),
      import('./router/SimpleRouter'),
      import('./components/theme/ThemeProvider'),
    ]).then(async ([
      { Provider },
      { store },
      { default: SimpleRouter },
      { ThemeProvider }
    ]) => {
      console.log('✅ All core modules loaded');
      
      // 전체 앱 컴포넌트 구성
      const FullApp = () => (
        <Provider store={store}>
          <ThemeProvider defaultTheme="dark" storageKey="ncuscript-theme">
            <div className="app min-h-screen bg-background">
              <SimpleRouter />
            </div>
          </ThemeProvider>
        </Provider>
      );
      
      setAppComponent(() => FullApp);
      setStatus('success');
      
    }).catch((err) => {
      console.error('❌ Module loading failed:', err);
      setError(err.message);
      setStatus('error');
    });
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-500">모듈 로딩 실패</h1>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-2xl font-bold text-primary">NcuScript Automator</h1>
          <p className="text-muted-foreground">전체 애플리케이션을 로딩하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return AppComponent ? <AppComponent /> : <SimpleTest />;
}

export default function App() {
  console.log('🚀 NcuScript Automator starting from /src/App.tsx');
  console.log('🌍 Environment:', import.meta.env.MODE);
  
  const urlParams = new URLSearchParams(window.location.search);
  const testMode = urlParams.get('test');
  const fullMode = urlParams.get('full');
  
  // URL 파라미터에 따른 모드 선택
  if (testMode === 'simple') {
    return <SimpleTest />;
  }
  
  if (testMode === 'store') {
    return <StoreTest />;
  }
  
  if (fullMode === '1') {
    return <FullAppLoader />;
  }
  
  // 기본값: Store 테스트부터 시작
  return <StoreTest />;
}