import React from 'react';
import { ArrowUpRight, Heart, Sparkles } from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import { IconRenderer } from './IconRenderer';
import { Badge } from './Badge';
import { cn } from '../../lib/utils';

interface ToolCardProps {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string, e: React.MouseEvent) => void;
  onClick?: () => void;
  featured?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite = false,
  onToggleFavorite,
  onClick,
  featured = false,
}) => {
  // Category-specific subtle accent colors
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'QR & Barcode':
        return {
          iconBg: 'bg-purple-500/20 border-purple-500/30 text-purple-400 group-hover:border-purple-500/50',
          hoverTitle: 'group-hover:text-purple-400',
        };
      case 'Image Tools':
        return {
          iconBg: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-500/50',
          hoverTitle: 'group-hover:text-cyan-400',
        };
      case 'PDF Tools':
        return {
          iconBg: 'bg-blue-500/20 border-blue-500/30 text-blue-400 group-hover:border-blue-500/50',
          hoverTitle: 'group-hover:text-blue-400',
        };
      case 'Text Tools':
        return {
          iconBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-500/50',
          hoverTitle: 'group-hover:text-emerald-400',
        };
      case 'Developer Tools':
        return {
          iconBg: 'bg-amber-500/20 border-amber-500/30 text-amber-400 group-hover:border-amber-500/50',
          hoverTitle: 'group-hover:text-amber-400',
        };
      default:
        return {
          iconBg: 'bg-purple-500/20 border-purple-500/30 text-purple-400 group-hover:border-purple-500/50',
          hoverTitle: 'group-hover:text-purple-400',
        };
    }
  };

  const style = getCategoryStyles(tool.category);

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-5 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200 cursor-pointer group flex flex-col justify-between select-none relative backdrop-blur-sm',
        featured && 'border-purple-500/40 bg-purple-950/10'
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200',
              style.iconBg
            )}
          >
            <IconRenderer name={tool.icon} className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                {tool.badge}
              </span>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(tool.slug, e);
                }}
                className={cn(
                  'p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-all',
                  isFavorite && 'text-rose-400 bg-rose-950/40 border border-rose-900/50'
                )}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={cn('w-3.5 h-3.5', isFavorite && 'fill-rose-400')} />
              </button>
            )}
          </div>
        </div>

        <h4 className={cn('text-white font-semibold mb-1 transition-colors text-base tracking-tight', style.hoverTitle)}>
          {tool.name}
        </h4>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-400 transition-colors uppercase tracking-wider">
          {tool.category}
        </span>
        <div className="flex items-center gap-1 text-xs font-medium text-purple-400 opacity-70 group-hover:opacity-100 transition-all">
          <span>Open</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
};
