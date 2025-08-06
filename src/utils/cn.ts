import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * 
 * clsx와 tailwind-merge를 결합하여 조건부 클래스와 
 * Tailwind 클래스 충돌을 모두 처리합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 조건부 클래스 생성을 위한 헬퍼 함수들
 */
export function cva(base: string, variants: Record<string, Record<string, string>> = {}) {
  return function(props: Record<string, any> = {}) {
    const classes = [base];
    
    Object.entries(variants).forEach(([key, values]) => {
      const value = props[key];
      if (value && values[value]) {
        classes.push(values[value]);
      }
    });
    
    if (props.className) {
      classes.push(props.className);
    }
    
    return cn(...classes);
  };
}

/**
 * 반응형 클래스 생성 헬퍼
 */
export function responsive(
  base: string,
  responsive: Partial<{
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  }> = {}
) {
  const classes = [base];
  
  Object.entries(responsive).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  });
  
  return cn(...classes);
}

/**
 * 8pt 그리드 시스템 헬퍼
 */
export function spacing(units: number): string {
  return `${units * 8}px`;
}

export function gridUnits(units: number): string {
  // Tailwind spacing scale (4px base)
  return `${units * 2}`;
}