import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { cn } from '../../utils/cn';
import { VStack } from '../layout/Flex';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'w-8 h-8',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'w-12 h-12',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    container: 'py-16',
    icon: 'w-16 h-16',
    title: 'text-2xl',
    description: 'text-lg',
  },
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClass = sizeClasses[size];

  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className={cn('text-center', sizeClass.container)}>
        <VStack spacing="md">
          {icon && (
            <div className={cn('text-muted-foreground mx-auto', sizeClass.icon)}>
              {icon}
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className={cn('font-semibold text-foreground', sizeClass.title)}>
              {title}
            </h3>
            {description && (
              <p className={cn('text-muted-foreground max-w-md mx-auto', sizeClass.description)}>
                {description}
              </p>
            )}
          </div>

          {action && (
            <Button 
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size={size === 'sm' ? 'sm' : 'default'}
            >
              {action.label}
            </Button>
          )}
        </VStack>
      </CardContent>
    </Card>
  );
}

// 특화된 Empty State 컴포넌트들
export function ScriptsEmptyState({ onCreateScript }: { onCreateScript: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
      title="아직 스크립트가 없습니다"
      description="첫 번째 보안 검사 스크립트를 생성하여 시작해보세요."
      action={{
        label: "새 스크립트 생성",
        onClick: onCreateScript,
      }}
    />
  );
}

export function TemplatesEmptyState() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      }
      title="검색 결과가 없습니다"
      description="다른 검색어를 시도하거나 필터를 조정해보세요."
    />
  );
}

export function SearchEmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title={`"${searchQuery}"에 대한 검색 결과가 없습니다`}
      description="검색어를 확인하고 다시 시도해보세요."
      size="sm"
    />
  );
}