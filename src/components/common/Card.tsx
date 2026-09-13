import React from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'default' | 'glass' | 'gradient' | 'glow';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  variant = 'default',
}) => {
  const variantStyles = {
    default:
      'bg-white dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/90 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.4)]',
    glass:
      'glass-card',
    gradient:
      'bg-gradient-to-br from-white via-indigo-50/25 to-white dark:from-slate-900 dark:via-indigo-950/25 dark:to-slate-900 border border-indigo-100/80 dark:border-indigo-900/50 shadow-md shadow-indigo-500/5',
    glow:
      'bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-800/80 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-900/20',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl p-5 sm:p-6 transition-all duration-200 relative overflow-hidden',
        variantStyles[variant],
        hoverable &&
          'hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/25 hover:border-indigo-300/80 dark:hover:border-indigo-600/60 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={clsx('flex items-start justify-between gap-4 mb-4 sm:mb-5', className)}>
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight font-display">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
