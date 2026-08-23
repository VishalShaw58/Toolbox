import React from 'react';
import { Heart } from 'lucide-react';
import { TOOLS } from '../../data/toolsRegistry';
import { ToolCard } from '../ui/ToolCard';

interface FavoritesSectionProps {
  onNavigate: (path: string) => void;
  favoriteIds: string[];
  onToggleFavorite: (slug: string, e?: React.MouseEvent) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  onNavigate,
  favoriteIds,
  onToggleFavorite,
}) => {
  const favoriteTools = TOOLS.filter(
    (tool) => favoriteIds.includes(tool.slug) || favoriteIds.includes(tool.id)
  );

  if (favoriteTools.length === 0) return null;

  return (
    <section className="scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Pinned Favorites ({favoriteTools.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {favoriteTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isFavorite={true}
            onToggleFavorite={(slug, e) => onToggleFavorite(slug, e)}
            onClick={() => onNavigate(`/${tool.slug}`)}
          />
        ))}
      </div>
    </section>
  );
};
