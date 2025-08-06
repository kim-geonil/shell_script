import React from 'react';
import { cn } from '../../utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
}

const sizeClasses = {
  sm: 'max-w-2xl',     // 32rem (512px)
  md: 'max-w-4xl',     // 56rem (896px) 
  lg: 'max-w-6xl',     // 72rem (1152px)
  xl: 'max-w-7xl',     // 80rem (1280px)
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-4 sm:px-6',      // 1-1.5 grid units
  md: 'px-4 sm:px-6 lg:px-8',  // 1-2 grid units
  lg: 'px-6 sm:px-8 lg:px-12', // 1.5-3 grid units
};

/**
 * Container 컴포넌트
 * 
 * 8pt 그리드 시스템을 기반으로 한 반응형 컨테이너입니다.
 * 다양한 크기와 패딩 옵션을 제공합니다.
 */
export default function Container({
  children,
  className,
  size = 'lg',
  padding = 'md',
  center = true,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        sizeClasses[size],
        paddingClasses[padding],
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

// 특화된 Container 변형들
export function DashboardContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Container size="xl" padding="md" className={cn('py-6', className)}>
      {children}
    </Container>
  );
}

export function EditorContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Container size="full" padding="none" className={cn('h-full', className)}>
      {children}
    </Container>
  );
}

export function SettingsContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Container size="md" padding="md" className={cn('py-8', className)}>
      {children}
    </Container>
  );
}

export function ModalContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Container size="sm" padding="sm" className={className}>
      {children}
    </Container>
  );
}