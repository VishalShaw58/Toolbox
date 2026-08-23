import React from 'react';
import { History } from 'lucide-react';
import { TOOLS } from '../../data/toolsRegistry';
import { ToolCard } from '../ui/ToolCard';

interface RecentlyUsedSectionProps {
  onNavigate: (path: string) => void;
  recentIds: string[];
  onToggleFavorite: (slug: string, e?: React.MouseEvent) => void;
  isFavorite: (slug: string) => boolean;
}

export const RecentlyUsedSection: React.FC<RecentlyUsedSectionProps> = ({
  onNavigate,
  recentIds,
  onToggleFavorite,
  isFavorite,
}) => {
  const recentTools = TOOLS.filter(
    (tool) => recentIds.includes(tool.slug) || recentIds.includes(tool.id)
  );

  if (recentTools.length === 0) return null;

  return (
    <section className="scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-purple-400" />
          <span>Recently Used</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentTools.slice(0, 4).map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isFavorite={isFavorite(tool.slug)}
            onToggleFavorite={(slug, e) => onToggleFavorite(slug, e)}
            onClick={() => onNavigate(`/${tool.slug}`)}
          />
        ))}
      </div>
    </section>
  );
};
