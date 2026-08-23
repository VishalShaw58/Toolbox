import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { TOOLS } from '../../data/toolsRegistry';
import { ToolCard } from '../ui/ToolCard';

interface PopularToolsProps {
  onNavigate: (path: string) => void;
  favorites?: string[];
  onToggleFavorite?: (slug: string, e: React.MouseEvent) => void;
}

export const PopularTools: React.FC<PopularToolsProps> = ({
  onNavigate,
  favorites = [],
  onToggleFavorite,
}) => {
  const popularTools = TOOLS.filter((t) => t.popular);

  return (
    <section id="popular" className="scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>Popular Tools</span>
          </h3>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('categories');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer transition-colors"
        >
          View all {TOOLS.length} tools &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularTools.slice(0, 8).map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isFavorite={favorites.includes(tool.slug)}
            onToggleFavorite={onToggleFavorite}
            onClick={() => onNavigate(`/${tool.slug}`)}
          />
        ))}
      </div>
    </section>
  );
};
