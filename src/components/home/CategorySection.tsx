import React from 'react';
import { CATEGORIES, getToolsByCategory } from '../../data/toolsRegistry';
import { ToolCard } from '../ui/ToolCard';
import { IconRenderer } from '../ui/IconRenderer';

interface CategorySectionProps {
  onNavigate: (path: string) => void;
  favorites?: string[];
  onToggleFavorite?: (slug: string, e: React.MouseEvent) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onNavigate,
  favorites = [],
  onToggleFavorite,
}) => {
  return (
    <section id="categories" className="space-y-16 scroll-mt-24">
      {CATEGORIES.map((category) => {
        const categoryTools = getToolsByCategory(category.name);

        return (
          <div key={category.slug} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10"
                  style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                  <IconRenderer name={category.icon} className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {category.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {category.description}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {categoryTools.length} tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favorites.includes(tool.slug)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={() => onNavigate(`/${tool.slug}`)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};
