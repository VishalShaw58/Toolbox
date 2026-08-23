import React from 'react';
import { SearchX, FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'folder';
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'search',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-zinc-800/80 rounded-2xl bg-zinc-900/30 backdrop-blur-sm max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-2xl bg-zinc-850 border border-zinc-750 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
        {icon === 'search' ? <SearchX className="w-6 h-6" /> : <FolderOpen className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-semibold text-zinc-200 mb-1.5">{title}</h4>
      <p className="text-xs text-zinc-400 max-w-xs mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
