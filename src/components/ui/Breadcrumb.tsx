import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigateHome?: () => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigateHome }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-zinc-400 mb-6 overflow-x-auto py-1" aria-label="Breadcrumb">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-zinc-200 transition-colors shrink-0 text-zinc-400"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            {isLast ? (
              <span className="font-medium text-zinc-200 truncate shrink-0 max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="hover:text-zinc-200 transition-colors truncate shrink-0 max-w-[150px]"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
