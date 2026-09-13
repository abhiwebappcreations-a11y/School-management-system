import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:from-indigo-400 disabled:to-indigo-400 dark:disabled:from-indigo-900/50 dark:disabled:to-indigo-900/50 disabled:shadow-none disabled:transform-none',
    secondary:
      'bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 active:bg-slate-300 dark:active:bg-slate-600 border border-slate-200/70 dark:border-slate-700/70 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-xs',
    outline:
      'border border-slate-300/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 active:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-xs',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 active:from-rose-700 active:to-red-700 shadow-md shadow-rose-600/25 hover:shadow-rose-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:from-rose-400 disabled:to-rose-400 disabled:shadow-none disabled:transform-none',
    success:
      'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:from-emerald-400 disabled:to-emerald-400 disabled:shadow-none disabled:transform-none',
    ghost:
      'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:bg-slate-200/80',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5 font-medium tracking-tight',
    md: 'text-sm px-4 py-2 rounded-xl gap-2 font-medium tracking-tight',
    lg: 'text-base px-6 py-2.5 rounded-2xl gap-2.5 font-semibold tracking-tight',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
