'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startsWithRe = new RegExp(`^${escaped}`, 'i');
    const containsRe = new RegExp(escaped, 'i');

    // --- Countries ---
    const countryMap = new Map<string, { count: number; coordinates: { lng: number; lat: number } }>();
    for (const r of recipes) {
      if (containsRe.test(r.country)) {
        const existing = countryMap.get(r.country);
        if (existing) {
          existing.count++;
        } else {
          countryMap.set(r.country, { count: 1, coordinates: r.coordinates });
        }
      }
    }
    const countries: SearchResult[] = Array.from(countryMap.entries())
      .sort((a, b) => {
        const aStarts = startsWithRe.test(a[0]) ? 0 : 1;
        const bStarts = startsWithRe.test(b[0]) ? 0 : 1;
        return aStarts - bStarts || a[0].localeCompare(b[0]);
      })
      .slice(0, 3)
      .map(([country, { count, coordinates }]) => ({
        type: 'country' as const,
        label: country,
        sublabel: `${count} recipe${count !== 1 ? 's' : ''}`,
        country,
        coordinates,
      }));

    // --- Recipes ---
    const recipeMatches: SearchResult[] = recipes
      .filter(r => containsRe.test(r.name))
      .sort((a, b) => {
        const aStarts = startsWithRe.test(a.name) ? 0 : 1;
        const bStarts = startsWithRe.test(b.name) ? 0 : 1;
        return aStarts - bStarts || a.name.localeCompare(b.name);
      })
      .slice(0, 3)
      .map(r => ({
        type: 'recipe' as const,
        label: r.name,
        sublabel: r.country,
        country: r.country,
        coordinates: r.coordinates,
        recipeId: r.id,
      }));

    // --- Ingredients --- (deduplicated against recipe matches)
    const recipeIds = new Set(recipeMatches.map(r => r.recipeId));
    const ingredientMatches: SearchResult[] = [];
    for (const r of recipes) {
      if (recipeIds.has(r.id)) continue;
      const matchedIng = r.ingredients.find(ing => containsRe.test(ing.name));
      if (matchedIng) {
        ingredientMatches.push({
          type: 'ingredient' as const,
          label: r.name,
          sublabel: matchedIng.name,
          country: r.country,
          coordinates: r.coordinates,
          recipeId: r.id,
        });
        if (ingredientMatches.length >= 3) break;
      }
    }
    // Sort ingredient matches: starts-with first
    ingredientMatches.sort((a, b) => {
      const aStarts = startsWithRe.test(a.sublabel!) ? 0 : 1;
      const bStarts = startsWithRe.test(b.sublabel!) ? 0 : 1;
      return aStarts - bStarts;
    });

    return [...countries, ...recipeMatches, ...ingredientMatches];
  }, [query, recipes]);

  const [activeIndex, setActiveIndex] = useState(-1);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  function handleSelect(result: SearchResult) {
    onSelect({
      country: result.country,
      coordinates: result.coordinates,
      recipeId: result.recipeId,
    });
    handleClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
      return;
    }
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  }

  if (recipes.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-4 right-4 z-10 flex items-center"
    >
      {expanded ? (
        <div className="relative">
          <div className="flex items-center gap-2 bg-parchment border border-brown-light/20 pl-3 pr-2 py-2 rounded-full shadow-sm">
            <Search size={16} className="text-brown-medium shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Country, recipe, ingredient..."
              className="bg-transparent text-sm text-brown-dark placeholder:text-brown-light outline-none w-48 sm:w-56"
              onKeyDown={handleKeyDown}
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

          {/* Dropdown */}
          {query.trim() && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-parchment border border-brown-light/20 rounded-xl shadow-xl overflow-hidden z-20">
              {results.length === 0 ? (
                <p className="px-4 py-3 text-sm text-brown-medium">No matches found</p>
              ) : (
                <div className="py-1">
                  {/* Countries group */}
                  {results.some(r => r.type === 'country') && (
                    <>
                      <p className="px-4 py-1.5 text-[11px] font-semibold text-brown-medium uppercase tracking-wider bg-parchment-dark">Countries</p>
                      {results.filter(r => r.type === 'country').map((result) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={`country-${result.label}`}
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${globalIndex === activeIndex ? 'bg-sage/20 text-brown-dark' : 'text-brown-dark hover:bg-terracotta/20'}`}
                          >
                            <span className="font-medium">{result.label}</span>
                            <span className="ml-2 text-xs text-brown-medium">{result.sublabel}</span>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Recipes group */}
                  {results.some(r => r.type === 'recipe') && (
                    <>
                      <p className="px-4 py-1.5 text-[11px] font-semibold text-brown-medium uppercase tracking-wider bg-parchment-dark">Recipes</p>
                      {results.filter(r => r.type === 'recipe').map((result) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={`recipe-${result.recipeId}`}
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${globalIndex === activeIndex ? 'bg-sage/20 text-brown-dark' : 'text-brown-dark hover:bg-terracotta/20'}`}
                          >
                            <span className="font-medium">{result.label}</span>
                            <span className="ml-2 text-xs text-brown-medium">{result.sublabel}</span>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Ingredient matches group */}
                  {results.some(r => r.type === 'ingredient') && (
                    <>
                      <p className="px-4 py-1.5 text-[11px] font-semibold text-brown-medium uppercase tracking-wider bg-parchment-dark">Ingredient matches</p>
                      {results.filter(r => r.type === 'ingredient').map((result) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={`ingredient-${result.recipeId}`}
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${globalIndex === activeIndex ? 'bg-sage/20 text-brown-dark' : 'text-brown-dark hover:bg-terracotta/20'}`}
                          >
                            <span className="font-medium">{result.label}</span>
                            <span className="ml-2 text-xs text-brown-medium italic">{result.sublabel}</span>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Search recipes"
          className="bg-parchment border border-brown-light/20 p-2.5 rounded-full shadow-sm text-brown-medium hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <Search size={18} />
        </button>
      )}
    </div>
  );
}
