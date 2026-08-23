import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'toolbox_favorite_tools';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['qr-generator', 'image-compressor', 'pdf-merger', 'password-generator'];
    } catch {
      return ['qr-generator', 'image-compressor', 'pdf-merger', 'password-generator'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((id) => id !== slug);
      } else {
        return [...prev, slug];
      }
    });
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
