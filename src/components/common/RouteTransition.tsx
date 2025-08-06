import React from 'react';
import { AnimatePresence } from 'motion/react';
import { PageTransition, SlideTransition, DashboardTransition, EditorTransition } from './PageTransition';

interface RouteTransitionProps {
  children: React.ReactNode;
  mode?: 'page' | 'slide' | 'dashboard' | 'editor';
  direction?: 'left' | 'right';
  routeKey?: string; // Manual key for transitions instead of location.pathname
}

export function RouteTransition({ 
  children, 
  mode = 'page',
  direction = 'right',
  routeKey 
}: RouteTransitionProps) {
  // Use the current path as the key, or fallback to a provided routeKey
  const transitionKey = routeKey || window.location.pathname;

  // 페이지 유형에 따라 다른 전환 애니메이션 사용
  const getTransitionComponent = () => {
    switch (mode) {
      case 'slide':
        return SlideTransition;
      case 'dashboard':
        return DashboardTransition;
      case 'editor':
        return EditorTransition;
      default:
        return PageTransition;
    }
  };

  const TransitionComponent = getTransitionComponent();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <TransitionComponent key={transitionKey} className="w-full">
        {children}
      </TransitionComponent>
    </AnimatePresence>
  );
}

// 특정 라우트에 최적화된 전환 컴포넌트들
export function DashboardRouteTransition({ children }: { children: React.ReactNode }) {
  return (
    <RouteTransition mode="dashboard" routeKey="dashboard">
      {children}
    </RouteTransition>
  );
}

export function EditorRouteTransition({ children }: { children: React.ReactNode }) {
  return (
    <RouteTransition mode="editor" routeKey="editor">
      {children}
    </RouteTransition>
  );
}

export function SlideRouteTransition({ 
  children, 
  direction = 'right',
  routeKey 
}: { 
  children: React.ReactNode;
  direction?: 'left' | 'right';
  routeKey?: string;
}) {
  return (
    <RouteTransition mode="slide" direction={direction} routeKey={routeKey}>
      {children}
    </RouteTransition>
  );
}