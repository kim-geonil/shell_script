import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo?: React.ErrorInfo;
  resetError: () => void;
  errorId: string;
}

// Safe environment check function
function isDevelopmentMode(): boolean {
  try {
    // Check if we're in a Vite environment with import.meta
    if (typeof window !== 'undefined' && 'import' in window && (window as any).import?.meta?.env) {
      return (window as any).import.meta.env.DEV || (window as any).import.meta.env.MODE === 'development';
    }
    
    // Try to access import.meta directly (this works in ES modules)
    try {
      // @ts-ignore - We're checking if this exists at runtime
      if (import.meta && import.meta.env) {
        // @ts-ignore
        return import.meta.env.DEV || import.meta.env.MODE === 'development';
      }
    } catch (e) {
      // import.meta not available, continue to other checks
    }
    
    // Fallback checks
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NODE_ENV === 'development';
    }
    
    // Check for localhost or development hostname
    if (typeof window !== 'undefined' && window.location) {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.includes('local') ||
             window.location.port === '5173' || // Vite default port
             window.location.port === '3000';   // Common dev port
    }
    
    // Default to false for safety
    return false;
  } catch (e) {
    console.warn('Could not determine environment mode:', e);
    return false;
  }
}

// 기본 에러 폴백 컴포넌트
function DefaultErrorFallback({ error, errorInfo, resetError, errorId }: ErrorFallbackProps) {
  const isDevelopment = isDevelopmentMode();
  
  const handleReportError = () => {
    // TODO: 실제 에러 리포팅 서비스에 전송
    console.log('Error reported:', { error, errorInfo, errorId });
    
    // 개발 모드에서는 콘솔에 자세한 정보 출력
    if (isDevelopment) {
      console.group('🚨 Error Boundary Triggered');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error ID:', errorId);
      console.groupEnd();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleHardRefresh = () => {
    // 로컬 스토리지 정리 후 페이지 새로고침
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Storage clear failed:', e);
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">애플리케이션 오류가 발생했습니다</CardTitle>
          <CardDescription>
            예상치 못한 오류로 인해 애플리케이션이 중단되었습니다. 
            아래 옵션을 통해 문제를 해결해보세요.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 에러 정보 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">오류 정보</h3>
              <Badge variant="outline" className="text-xs">
                ID: {errorId}
              </Badge>
            </div>
            
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium text-destructive mb-1">
                {error.name}: {error.message}
              </p>
              {isDevelopment && error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    스택 트레이스 보기
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-32 text-muted-foreground">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>

          <Separator />

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">문제 해결 방법</h3>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <Button 
                onClick={resetError}
                variant="default"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </Button>
              
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                홈으로 이동
              </Button>
            </div>
            
            <Button 
              onClick={handleHardRefresh}
              variant="destructive"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              전체 새로고침 (데이터 초기화)
            </Button>
          </div>

          <Separator />

          {/* 에러 리포팅 */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              이 문제가 계속 발생한다면 개발팀에 신고해주세요.
            </p>
            <Button 
              onClick={handleReportError}
              variant="ghost"
              size="sm"
            >
              <Bug className="w-4 h-4 mr-2" />
              오류 신고하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 에러 바운더리 클래스 컴포넌트
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 고유한 에러 ID 생성
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 정보를 state에 저장
    this.setState({ errorInfo });

    // 부모 컴포넌트의 onError 콜백 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 에러 로깅
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);
    
    // 에러 리포팅 서비스에 전송 (실제 구현 시)
    // this.reportErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          errorId={this.state.errorId || 'unknown'}
        />
      );
    }

    return this.props.children;
  }
}

// 특정 기능을 위한 경량 에러 바운더리
export function FeatureErrorBoundary({ 
  children, 
  featureName 
}: { 
  children: React.ReactNode;
  featureName: string;
}) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
              <div>
                <h3 className="font-medium">{featureName} 오류</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {error.message}
                </p>
              </div>
              <Button onClick={resetError} size="sm">
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;