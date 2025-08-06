import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StatusIndicatorProps {
  status: 'success' | 'error' | 'warning' | 'pending' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  error: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  pending: {
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  info: {
    icon: AlertCircle,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
    borderColor: 'border-gray-200 dark:border-gray-800',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    container: 'px-3 py-2 text-sm',
    icon: 'h-4 w-4',
  },
  lg: {
    container: 'px-4 py-3 text-base',
    icon: 'h-5 w-5',
  },
};

export function StatusIndicator({
  status,
  size = 'md',
  showIcon = true,
  children,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border',
        config.color,
        config.bgColor,
        config.borderColor,
        sizeStyles.container,
        className
      )}
    >
      {showIcon && <Icon className={sizeStyles.icon} />}
      {children}
    </div>
  );
}