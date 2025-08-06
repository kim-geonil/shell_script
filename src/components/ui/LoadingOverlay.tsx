import React from 'react';
import { cn } from '../../utils/cn';
import { Center } from '../layout/Flex';

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  overlay?: boolean;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
}

export default function LoadingOverlay({
  isLoading,
  children,
  loadingText = '로딩 중...',
  className,
  overlay = true,
}: LoadingOverlayProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (!overlay) {
    return (
      <Center className={cn('py-12', className)}>
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">{loadingText}</p>
        </div>
      </Center>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center space-y-4 p-6 bg-card rounded-lg border shadow-lg">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    </div>
  );
}

// 특화된 Loading 컴포넌트들
export function PageLoading({ text = '페이지를 불러오고 있습니다...' }: { text?: string }) {
  return (
    <Center className="min-h-96">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </Center>
  );
}

export function InlineLoading({ text = '로딩 중...', size = 'sm' }: { text?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={size} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

export function ButtonLoading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      {children}
    </div>
  );
}