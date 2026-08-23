import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'purple' | 'cyan' | 'emerald' | 'amber' | 'red';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'sm',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full whitespace-nowrap transition-colors';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  const variantStyles = {
    default: 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/60',
    outline: 'border border-zinc-700 text-zinc-400',
    purple: 'bg-purple-950/60 text-purple-300 border border-purple-800/50 shadow-sm shadow-purple-900/20',
    cyan: 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50',
    emerald: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50',
    amber: 'bg-amber-950/60 text-amber-300 border border-amber-800/50',
    red: 'bg-rose-950/60 text-rose-300 border border-rose-800/50',
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};
