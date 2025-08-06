import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/redux';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute 컴포넌트
 * 
 * 인증된 사용자만 접근할 수 있는 라우트를 보호합니다.
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useAuth();
  const location = useLocation();

  console.log('🔐 PrivateRoute check:', {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user?.name || 'none',
    currentPath: location.pathname,
    isLoading: auth.isLoading
  });

  // 인증 상태를 확인하는 중이면 로딩 표시
  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">인증 상태를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  // 현재 위치를 state로 전달하여 로그인 후 원래 페이지로 돌아갈 수 있도록 함
  if (!auth.isAuthenticated || !auth.user) {
    console.log('🚫 User not authenticated, redirecting to login');
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // 토큰이 만료된 경우 체크 (토큰이 있는 경우)
  if (auth.tokens?.expiresAt && new Date(auth.tokens.expiresAt) < new Date()) {
    console.log('⏰ Token expired, redirecting to login');
    return (
      <Navigate 
        to="/login" 
        state={{ from: location, reason: 'token_expired' }} 
        replace 
      />
    );
  }

  console.log('✅ User authenticated, rendering protected content');
  
  // 인증된 사용자에게 보호된 콘텐츠 표시
  return <>{children}</>;
}