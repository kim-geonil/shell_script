import React from 'react';
import { cn } from '../../utils/cn';

interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  grow?: boolean;
  shrink?: boolean;
}

const directionClasses = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const wrapClasses = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const itemsClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',   // 8px (1 grid unit)
  md: 'gap-4',   // 16px (2 grid units)
  lg: 'gap-6',   // 24px (3 grid units)
  xl: 'gap-8',   // 32px (4 grid units)
};

/**
 * Flex 컴포넌트
 * 
 * 8pt 그리드 시스템을 사용한 Flexbox 레이아웃 컴포넌트입니다.
 */
export default function Flex({
  children,
  className,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  items = 'center',
  gap = 'md',
  grow = false,
  shrink = true,
}: FlexProps) {
  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        wrapClasses[wrap],
        justifyClasses[justify],
        itemsClasses[items],
        gapClasses[gap],
        grow && 'flex-grow',
        !shrink && 'flex-shrink-0',
        className
      )}
    >
      {children}
    </div>
  );
}

// 일반적인 Flex 레이아웃들
export function HStack({ 
  children, 
  className, 
  spacing = 'md',
  justify = 'start',
  items = 'center',
}: { 
  children: React.ReactNode; 
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
}) {
  return (
    <Flex
      direction="row"
      gap={spacing}
      justify={justify}
      items={items}
      className={className}
    >
      {children}
    </Flex>
  );
}

export function VStack({ 
  children, 
  className, 
  spacing = 'md',
  items = 'stretch',
}: { 
  children: React.ReactNode; 
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
}) {
  return (
    <Flex
      direction="col"
      gap={spacing}
      items={items}
      className={className}
    >
      {children}
    </Flex>
  );
}

export function Center({ 
  children, 
  className,
  minHeight,
}: { 
  children: React.ReactNode; 
  className?: string;
  minHeight?: string;
}) {
  return (
    <Flex
      justify="center"
      items="center"
      className={cn(minHeight && `min-h-[${minHeight}]`, className)}
    >
      {children}
    </Flex>
  );
}

export function SpaceBetween({ 
  children, 
  className,
  items = 'center',
}: { 
  children: React.ReactNode; 
  className?: string;
  items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
}) {
  return (
    <Flex
      justify="between"
      items={items}
      className={className}
    >
      {children}
    </Flex>
  );
}

// 특정 용도의 Flex 컴포넌트들
export function PageHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <SpaceBetween items="start" className={cn('mb-6', className)}>
      {children}
    </SpaceBetween>
  );
}

export function CardActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <HStack spacing="sm" justify="end" className={cn('pt-4 border-t', className)}>
      {children}
    </HStack>
  );
}

export function ToolbarActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <HStack spacing="sm" className={className}>
      {children}
    </HStack>
  );
}

export function StatusBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <SpaceBetween className={cn('py-2 px-4 border-t bg-muted/50', className)}>
      {children}
    </SpaceBetween>
  );
}