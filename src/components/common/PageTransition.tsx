import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// 기본 페이지 전환 애니메이션
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1], // easeOutCubic
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 슬라이드 전환 (좌우)
export function SlideTransition({ 
  children, 
  direction = 'right',
  className 
}: PageTransitionProps & { direction?: 'left' | 'right' }) {
  const slideDistance = direction === 'right' ? 50 : -50;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: slideDistance }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -slideDistance }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 스케일 전환
export function ScaleTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 에디터용 빠른 전환
export function EditorTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.15,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 대시보드용 상향 슬라이드
export function DashboardTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 모달/다이얼로그용 전환
export function ModalTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 리스트 아이템용 staggered 애니메이션
export function StaggeredList({ 
  children, 
  className,
  staggerDelay = 0.1 
}: PageTransitionProps & { staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredItem({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}