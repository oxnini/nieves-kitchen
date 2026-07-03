'use client';

import { useState, useRef, useEffect, useMemo, useId } from 'react';
import { Search, X } from 'lucide-react';
import type { AtlasRecipe } from '@/lib/atlas';

interface SearchResult {
  type: 'country' | 'recipe' | 'ingredient';
  label: string;
  sublabel?: string;
  country: string;
  coordinates: { lng: number; lat: number };
  recipeId?: string;
}

interface MapSearchProps {
  recipes: AtlasRecipe[];
  onSelect: (result: {
    country: string;
    coordinates: { lng: number; lat: number };
    recipeId?: string;
  }) => void;
  /** Overrides the outer positioning wrapper. Desktop's default centring is
      `absolute top-9 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10`; mobile
      passes its own (top of the chrome band, under the navbar). */
  containerClassName?: string;
  /** Mobile-only: when idle, render as a 40px circular icon button instead of
      the "Search" pill. On focus it expands into the normal input form. */
  compact?: boolean;
}

const DEFAULT_CONTAINER_CLASS =
  'absolute top-9 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10';

export default function MapSearch({ recipes, onSelect, containerClassName, compact = false }: MapSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-opt-${index}`;

  // Click outside clears the query and hides the dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setQuery('');
      }
    }
    if (query) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [query]);

  /* Broadcast focus state on <body> so siblings (filter FAB, breadcrumb) can
     fade out while the pill is expanded. Mobile uses this to avoid the visual
     clash between the expanding pill and the FAB sitting next to it. */
  useEffect(() => {
    if (isFocused) document.body.dataset.mapSearchFocused = '1';
    else delete document.body.dataset.mapSearchFocused;
    return () => { delete document.body.dataset.mapSearchFocused; };
  }, [isFocused]);

  /* Compact mode: tapping the icon button flips isFocused; the input only
     mounts on this render, so push focus into it after React commits. */
  useEffect(() => {
    if (compact && isFocused) inputRef.current?.focus();
  }, [compact, isFocused]);

  function dismiss() {
    setQuery('');
    inputRef.current?.blur();
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

    // --- Ingredients --- (deduplicated against recipe matches, and within
    // themselves: influence copies share an id, and the sublabel here is the
    // ingredient name — duplicate rows would be indistinguishable)
    const recipeIds = new Set(recipeMatches.map(r => r.recipeId));
    const seenIngredientIds = new Set<string>();
    const ingredientMatches: SearchResult[] = [];
    for (const r of recipes) {
      if (recipeIds.has(r.id) || seenIngredientIds.has(r.id)) continue;
      let matchedIng: { name: string } | undefined;
      for (const group of r.ingredients) {
        matchedIng = group.items.find(ing => containsRe.test(ing.name));
        if (matchedIng) break;
      }
      if (matchedIng) {
        seenIngredientIds.add(r.id);
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
    dismiss();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      dismiss();
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

  /* `recipes` is the full unfiltered set (callers pass allRecipes), so this
     only hides the bar before recipes load or when the DB is empty — never
     because active filters excluded everything. Search stays a global tool. */
  if (recipes.length === 0) return null;

  const isOpen = query.trim().length > 0;
  const hasResults = results.length > 0;
  const isExpanded = isFocused || query.length > 0;

  return (
    <>
      {/* Map dim — sits above the map canvas, below all map chrome (z-10+) */}
      <div
        aria-hidden="true"
        onMouseDown={dismiss}
        className={`absolute inset-0 z-[5] bg-brown-dark/12 transition-opacity duration-200 ease-out ${
          isFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        ref={containerRef}
        className={containerClassName ?? DEFAULT_CONTAINER_CLASS}
      >
        <div className="relative">
          {compact && !isExpanded ? (
            <button
              type="button"
              onClick={() => setIsFocused(true)}
              aria-label="Search recipes, countries, or ingredients"
              className="flex items-center justify-center w-[42px] h-[42px] rounded-full bg-parchment border border-brown-light/20 shadow-md text-brown-medium hover:text-brown-dark hover:shadow-lg transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <Search size={18} aria-hidden="true" />
            </button>
          ) : (
          <label
            /* h-[46px] pins the desktop pill to the same height as the paired
               filters button in the map cluster (and the /recipes control row,
               so controls share one height site-wide). The collapsed branch is
               desktop-only (mobile shows the compact icon button instead), and
               the expanded height is scoped to sm+ so mobile's focused pill
               keeps its natural size. */
            className={`flex items-center bg-parchment border border-brown-light/20 hover:border-terracotta/60 rounded-full shadow-md hover:shadow-lg focus-within:shadow-lg transition-all duration-[250ms] ease-out cursor-text ${
              isExpanded
                ? `gap-2.5 pl-5 py-2 sm:h-[46px] ${query ? 'pr-1.5' : 'pr-5'}`
                : 'gap-1.5 pl-4 pr-4 py-1 h-[46px]'
            }`}
          >
            <Search size={16} className="text-brown-medium shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? 'Search recipes, countries, ingredients…' : 'Search'}
              /* text-base (16px) on mobile prevents iOS Safari from auto-zooming
                 the viewport on focus; desktop tightens back to text-sm.
                 Expanded: fixed width so typing doesn't shrink the pill (which
                 would slide the search icon rightward into the first character).
                 Collapsed: field-sizing:content lets the pill hug the word "Search". */
              className={`bg-transparent text-base sm:text-sm text-brown-dark placeholder:text-brown-medium/60 outline-none py-0.5 ${
                isExpanded ? 'w-[min(60vw,18rem)]' : 'w-24'
              }`}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-label="Search recipes, countries, or ingredients"
              aria-expanded={isOpen && hasResults}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={isOpen && hasResults && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="p-1 rounded-full text-brown-medium hover:text-brown-dark hover:bg-brown-light/15 transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>
          )}

        {/* Status — announces result count to screen readers */}
        <div role="status" aria-live="polite" className="sr-only">
          {isOpen
            ? hasResults
              ? `${results.length} result${results.length === 1 ? '' : 's'} for ${query.trim()}`
              : `No matches for ${query.trim()}`
            : ''}
        </div>

        {/* Dropdown */}
        {isOpen && (
            <div
              id={listboxId}
              role="listbox"
              aria-label="Search results"
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-parchment border border-brown-light/20 rounded-xl shadow-xl overflow-hidden z-20"
            >
              {!hasResults ? (
                <p className="px-4 py-3 text-sm text-brown-medium">No matches found</p>
              ) : (
                <div className="py-1">
                  {/* Countries group */}
                  {results.some(r => r.type === 'country') && (
                    <>
                      <p
                        id={`${listboxId}-group-countries`}
                        className="px-4 py-1.5 text-[11px] font-semibold text-brown-medium uppercase tracking-wider bg-parchment-dark"
                      >
                        Countries
                      </p>
                      <div role="group" aria-labelledby={`${listboxId}-group-countries`}>
                        {results.filter(r => r.type === 'country').map((result) => {
                          const globalIndex = results.indexOf(result);
                          const isActive = globalIndex === activeIndex;
                          return (
                            <button
                              key={`country-${result.label}`}
                              id={optionId(globalIndex)}
                              role="option"
                              aria-selected={isActive}
                              onClick={() => handleSelect(result)}
                              onMouseEnter={() => setActiveIndex(globalIndex)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${isActive ? 'bg-terracotta/15 text-brown-dark' : 'text-brown-dark'}`}
                            >
                              <span className="font-medium">{result.label}</span>
                              <span className="ml-2 text-xs text-brown-medium">{result.sublabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Recipes group */}
                  {results.some(r => r.type === 'recipe') && (
                    <>
                      <p
                        id={`${listboxId}-group-recipes`}
                        className="px-4 py-1.5 text-[11px] font-semibold text-brown-medium uppercase tracking-wider bg-parchment-dark"
                      >
                        Recipes
                      </p>
                      <div role="group" aria-labelledby={`${listboxId}-group-recipes`}>
                        {results.filter(r => r.type === 'recipe').map((result) => {
                          const globalIndex = results.indexOf(result);
                          const isActive = globalIndex === activeIndex;
                          return (
                            <button
                              key={`recipe-${result.recipeId}-${result.country}`}
                              id={optionId(globalIndex)}
                              role="option"
                              aria-selected={isActive}
                              onClick={() => handleSelect(result)}
                              onMouseEnter={() => setActiveIndex(globalIndex)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${isActive ? 'bg-terracotta/15 text-brown-dark' : 'text-brown-dark'}`}
                            >
                              <span className="font-medium">{result.label}</span>
                              <span className="ml-2 text-xs text-brown-medium">{result.sublabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Ingredient matches group */}
                  {results.some(r => r.type === 'ingredient') && (
                    <>
                      <p
                        id={`${listboxId}-group-ingredients`}
                        className="px-4 py-1.5 text-[11px] font-semibold text-brown-medium uppercase tracking-wider bg-parchment-dark"
                      >
                        Ingredient matches
                      </p>
                      <div role="group" aria-labelledby={`${listboxId}-group-ingredients`}>
                        {results.filter(r => r.type === 'ingredient').map((result) => {
                          const globalIndex = results.indexOf(result);
                          const isActive = globalIndex === activeIndex;
                          return (
                            <button
                              key={`ingredient-${result.recipeId}-${result.country}`}
                              id={optionId(globalIndex)}
                              role="option"
                              aria-selected={isActive}
                              onClick={() => handleSelect(result)}
                              onMouseEnter={() => setActiveIndex(globalIndex)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${isActive ? 'bg-terracotta/15 text-brown-dark' : 'text-brown-dark'}`}
                            >
                              <span className="font-medium">{result.label}</span>
                              <span className="ml-2 text-xs text-brown-medium italic">{result.sublabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
