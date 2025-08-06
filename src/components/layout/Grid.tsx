import React from 'react';
import { cn } from '../../utils/cn';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  items?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',   // 8px (1 grid unit)
  md: 'gap-4',   // 16px (2 grid units)
  lg: 'gap-6',   // 24px (3 grid units)
  xl: 'gap-8',   // 32px (4 grid units)
};

const itemsClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

/**
 * Grid 컴포넌트
 * 
 * 8pt 그리드 시스템을 사용한 반응형 CSS Grid 컴포넌트입니다.
 */
export default function Grid({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  items = 'stretch',
  justify = 'start',
}: GridProps) {
  const gridCols = Object.entries(cols)
    .map(([breakpoint, colCount]) => {
      if (breakpoint === 'default') {
        return `grid-cols-${colCount}`;
      }
      return `${breakpoint}:grid-cols-${colCount}`;
    })
    .join(' ');

  return (
    <div
      className={cn(
        'grid',
        gridCols,
        gapClasses[gap],
        itemsClasses[items],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}

// 일반적인 Grid 레이아웃들
export function StatsGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Grid
      cols={{ default: 1, sm: 2, lg: 4 }}
      gap="md"
      className={className}
    >
      {children}
    </Grid>
  );
}

export function CardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Grid
      cols={{ default: 1, md: 2, xl: 3 }}
      gap="lg"
      className={className}
    >
      {children}
    </Grid>
  );
}

export function TwoColumnGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Grid
      cols={{ default: 1, lg: 2 }}
      gap="lg"
      items="start"
      className={className}
    >
      {children}
    </Grid>
  );
}

export function ThreeColumnGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Grid
      cols={{ default: 1, md: 2, lg: 3 }}
      gap="md"
      className={className}
    >
      {children}
    </Grid>
  );
}

export function AsymmetricGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
      {children}
    </div>
  );
}

// 특정 용도의 Grid 컴포넌트들
export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}

export function TemplateGrid({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}
      gap="md"
    >
      {children}
    </Grid>
  );
}

export function ScriptGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}