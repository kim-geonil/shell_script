import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/redux'

// Import animation components
import { RouteTransition, DashboardRouteTransition, EditorRouteTransition } from '../components/common/RouteTransition'
import { ErrorBoundary, FeatureErrorBoundary } from '../components/common/ErrorBoundary'

// Import pages
import SimpleLogin from '../pages/SimpleLogin'
import Layout from '../components/layout/Layout'
import NotFound from '../pages/NotFound'

// Import page components with Layout
import SimpleDashboard from '../pages/SimpleDashboard'
import ScriptsList from '../pages/ScriptsList'
import ScriptDetail from '../pages/ScriptDetail'
import ScriptNew from '../pages/ScriptNew'
import ScriptTemplateEditor from '../pages/ScriptTemplateEditor'
import TemplatesList from '../pages/TemplatesList'
import TemplateDetail from '../pages/TemplateDetail'
import PromptEditor from '../pages/PromptEditor';
import Settings from '../pages/Settings'
import RecentActivity from '../pages/RecentActivity'
import Bookmarks from '../pages/Bookmarks'
import ExecutionHistory from '../pages/ExecutionHistory'
import TestResults from '../pages/TestResults'
import Admin from '../pages/Admin'

export default function SimpleRouter() {
  console.log('🧭 SimpleRouter rendering...');
  
  const auth = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // 경로 변경 감지
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 인증된 사용자의 경우 루트 경로를 대시보드로 리다이렉트
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      if (currentPath === '/') {
        console.log('🔄 Redirecting from root to dashboard');
        window.history.replaceState({}, '', '/dashboard');
        setCurrentPath('/dashboard');
      }
    }
  }, [auth.isAuthenticated, auth.user, currentPath]);

  console.log('📡 Current auth state:', {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user?.name || 'none',
    isLoading: auth.isLoading,
    error: auth.error,
    currentPath
  });

  // 인증되지 않은 사용자 - 로그인 페이지
  if (!auth.isAuthenticated || !auth.user) {
    console.log('🔓 User not authenticated, showing Login');
    return (
      <RouteTransition mode="page" routeKey="login">
        <SimpleLogin />
      </RouteTransition>
    );
  }

  // 인증된 사용자 - 라우팅 처리
  console.log('✅ User authenticated, routing to:', currentPath);

  const renderPage = () => {
    // 경로에 따라 적절한 페이지 컴포넌트와 애니메이션 반환
    if (currentPath === '/' || currentPath === '/dashboard') {
      return (
        <DashboardRouteTransition>
          <FeatureErrorBoundary featureName="대시보드">
            <SimpleDashboard />
          </FeatureErrorBoundary>
        </DashboardRouteTransition>
      );
    } else if (currentPath === '/scripts') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="scripts">
          <FeatureErrorBoundary featureName="스크립트 목록">
            <ScriptsList />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/scripts/new') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="scripts-new">
          <FeatureErrorBoundary featureName="새 스크립트">
            <ScriptNew />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/scripts/template-editor') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="scripts-template-editor">
          <FeatureErrorBoundary featureName="템플릿 에디터">
            <ScriptTemplateEditor />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath.startsWith('/scripts/')) {
      const scriptId = currentPath.split('/scripts/')[1];
      return (
        <EditorRouteTransition>
          <FeatureErrorBoundary featureName="스크립트 편집기">
            <ScriptDetail />
          </FeatureErrorBoundary>
        </EditorRouteTransition>
      );
    } else if (currentPath === '/templates') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="templates">
          <FeatureErrorBoundary featureName="템플릿 라이브러리">
            <TemplatesList />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath.startsWith('/templates/')) {
      const templateId = currentPath.split('/templates/')[1];
      return (
        <RouteTransition mode="page" routeKey={`template-${templateId}`}>
          <FeatureErrorBoundary featureName="템플릿 상세보기">
            <TemplateDetail />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/settings') {
      return (
        <RouteTransition mode="slide" direction="left" routeKey="settings">
          <FeatureErrorBoundary featureName="설정">
            <Settings />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/activity') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="activity">
          <FeatureErrorBoundary featureName="최근 활동">
            <RecentActivity />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/bookmarks') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="bookmarks">
          <FeatureErrorBoundary featureName="북마크">
            <Bookmarks />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/history') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="history">
          <FeatureErrorBoundary featureName="실행 이력">
            <ExecutionHistory />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/test-results') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="test-results">
          <FeatureErrorBoundary featureName="테스트 결과">
            <TestResults />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/prompt-editor') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="prompt-editor">
          <FeatureErrorBoundary featureName="프롬프트 에디터">
            <PromptEditor />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else if (currentPath === '/admin') {
      return (
        <RouteTransition mode="slide" direction="right" routeKey="admin">
          <FeatureErrorBoundary featureName="관리자 페이지">
            <Admin />
          </FeatureErrorBoundary>
        </RouteTransition>
      );
    } else {
      // 404 처리
      return (
        <RouteTransition mode="page" routeKey="notfound">
          <NotFound />
        </RouteTransition>
      );
    }
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('🚨 Router Error:', error, errorInfo);
        // TODO: 에러 리포팅 서비스에 전송
      }}
    >
      <Layout>
        {renderPage()}
      </Layout>
    </ErrorBoundary>
  );
}