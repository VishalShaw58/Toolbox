import { useState, useEffect, useCallback } from 'react';
import { TOOLS } from '../data/toolsRegistry';
import { ToolDefinition } from '../types/tools';

const STORAGE_KEY = 'toolbox_recent_tools';
const MAX_RECENTS = 8;

export function useRecentTools() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSlugs));
    } catch (e) {
      console.error('Failed to save recents', e);
    }
  }, [recentSlugs]);

  const addRecent = useCallback((slug: string) => {
    setRecentSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, MAX_RECENTS);
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecentSlugs([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const recentTools: ToolDefinition[] = recentSlugs
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter((t): t is ToolDefinition => Boolean(t));

  return { recentSlugs, recentTools, addRecent, clearRecents };
}
