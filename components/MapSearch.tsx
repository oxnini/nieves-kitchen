'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import type { Recipe } from '@/lib/types';

interface SearchResult {
  type: 'country' | 'recipe' | 'ingredient';
  label: string;
  sublabel?: string;
  country: string;
  coordinates: { lng: number; lat: number };
  recipeId?: string;
}

interface MapSearchProps {
  recipes: Recipe[];
  onSelect: (result: {
    country: string;
    coordinates: { lng: number; lat: number };
    recipeId?: string;
  }) => void;
}

export default function MapSearch({ recipes, onSelect }: MapSearchProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus on expand
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // Click outside closes dropdown but keeps search expanded
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
        setQuery('');
      }
    }
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [expanded]);

  function handleClose() {
    setExpanded(false);
    setQuery('');
  }

  if (recipes.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-4 right-4 z-10 flex items-center"
    >
      {expanded ? (
        <div className="relative">
          <div className="flex items-center gap-2 bg-parchment/92 backdrop-blur-sm pl-3 pr-2 py-2 rounded-full shadow-md">
            <Search size={16} className="text-brown-medium shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Country, recipe, ingredient..."
              className="bg-transparent text-sm text-brown-dark placeholder:text-brown-light outline-none w-48 sm:w-56"
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleClose();
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-0.5 rounded-full text-brown-medium hover:text-brown-dark transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Search recipes"
          className="bg-parchment/92 backdrop-blur-sm p-2.5 rounded-full shadow-md text-brown-medium hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <Search size={18} />
        </button>
      )}
    </div>
  );
}
