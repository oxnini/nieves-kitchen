'use client';

import { useState, useEffect } from 'react';

export function useFavorites(): [Set<string>, (id: string) => void] {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nieves-favorites');
      if (raw) setFavorites(new Set(JSON.parse(raw) as string[]));
    } catch {
      // ignore parse errors
    }
  }, []);

  function toggleFavorite(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('nieves-favorites', JSON.stringify([...next]));
      return next;
    });
  }

  return [favorites, toggleFavorite];
}
