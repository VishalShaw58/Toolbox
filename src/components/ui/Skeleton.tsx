import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'rounded' | 'circular' | 'card' | 'input' | 'button';
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  shimmer = true,
  ...props
}) => {
  const variantStyles = {
    default: 'rounded-md',
    rounded: 'rounded-xl',
    circular: 'rounded-full',
    card: 'rounded-2xl border border-white/5 bg-white/[0.02]',
    input: 'rounded-xl h-11 border border-white/10 bg-white/[0.03]',
    button: 'rounded-full h-10 border border-white/10 bg-white/[0.04]',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/[0.05] backdrop-blur-sm',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      )}
    </div>
  );
};
