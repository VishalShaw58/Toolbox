import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft, Sparkles, History, Star } from 'lucide-react';
import { getAllTools, CATEGORIES } from '../../data/toolsRegistry';
import { ToolDefinition } from '../../types/tools';
import { IconRenderer } from '../ui/IconRenderer';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allTools = getAllTools();

  const adminToolStub: ToolDefinition = {
    id: 'admin-studio',
    slug: 'admin',
    name: 'Admin Studio & Vercel Publisher',
    shortDescription: 'Create new tools, generate React code, and publish directly to Vercel.',
    fullDescription: 'Visual tool creator and Vercel edge deployment hub.',
    category: 'Developer Tools',
    icon: 'Rocket',
    badge: 'Admin',
    keywords: ['admin', 'publish', 'vercel', 'deploy', 'create', 'new tool', 'developer'],
    metaTitle: 'Admin Studio',
    metaDescription: 'Manage tools and publish to Vercel',
  };

  const pool = [adminToolStub, ...allTools];

  const filteredTools = query.trim()
    ? pool.filter((tool) => {
        const q = query.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : [adminToolStub, ...allTools.slice(0, 7)];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
      } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
        e.preventDefault();
        onNavigate(`/${filteredTools[selectedIndex].slug}`);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onClose, onNavigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Bar Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-black/40">
          <Search className="w-5 h-5 text-purple-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, actions, formats (e.g. compress, qr, json, pdf)..."
            className="w-full bg-transparent text-white placeholder:text-slate-600 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-white p-1 mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 flex-1 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center justify-between">
            <span>
              {query ? `Search Results (${filteredTools.length})` : 'Popular Tools'}
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">No tools found for "{query}"</p>
              <p className="text-xs text-slate-600 mt-1">Try searching for keywords like "resize", "pdf", or "converter"</p>
            </div>
          ) : (
            filteredTools.map((tool, index) => {
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onNavigate(`/${tool.slug}`);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-500/10 text-white border border-purple-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      <IconRenderer name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate text-white">{tool.name}</span>
                        {tool.badge && (
                          <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.2 rounded-full">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                      {tool.category}
                    </span>
                    {isSelected && (
                      <div className="flex items-center gap-1 text-xs text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40 font-mono">
                        <span>Open</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-white/5 bg-black/40 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-slate-400 font-mono">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-slate-400 font-mono">↵</kbd> Open Tool
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[10px] uppercase">100% Client-Side</span>
        </div>
      </div>
    </div>
  );
};
