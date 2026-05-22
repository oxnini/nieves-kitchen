'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowUpDown, Search, X } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import FilterPanel from '@/components/FilterPanel';
import { useRecipes } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS } from '@/lib/filters';
import type { CulinaryRegion, Filters, MealFilter, Recipe } from '@/lib/types';

type SortOption = 'default' | 'protein-desc' | 'time-asc' | 'calories-asc' | 'region';

const SORT_LABELS: Record<SortOption, string> = {
  'default':      'Default',
  'protein-desc': 'Most protein',
  'time-asc':     'Quickest',
  'calories-asc': 'Lowest calories',
  'region':       'By region',
};

const MEAL_LABELS: Record<Exclude<MealFilter, 'all'>, string> = {
  main:    'Mains',
  dessert: 'Desserts',
  drink:   'Drinks',
  side:    'Sides',
};

type Chip = { key: string; label: string; onClear: () => void };

/** Postal-stub chip matching FilterPanel's vocabulary, with a remove affordance. */
function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Remove filter: ${label}`}
      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-parchment-dark/60 border border-brown-light/40 text-[12px] font-medium text-brown-dark hover:border-terracotta/60 hover:bg-terracotta/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta"
    >
      <span className="leading-none">{label}</span>
      <X size={11} strokeWidth={2.25} className="text-brown-medium group-hover:text-terracotta transition-colors" />
    </button>
  );
}

function sortRecipes(recipes: Recipe[], sort: SortOption): Recipe[] {
  if (sort === 'default') return recipes;
  const sorted = [...recipes];
  switch (sort) {
    case 'protein-desc':
      return sorted.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
    case 'time-asc':
      return sorted.sort((a, b) => a.time.total - b.time.total);
    case 'calories-asc':
      return sorted.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
    case 'region':
      return sorted.sort((a, b) => a.region.localeCompare(b.region));
    default:
      return sorted;
  }
}

/** Case-insensitive substring match across name, country, and ingredients. */
function matchesSearch(recipe: Recipe, query: string): boolean {
  const q = query.toLowerCase();
  if (recipe.name.toLowerCase().includes(q)) return true;
  if (recipe.country.toLowerCase().includes(q)) return true;
  return recipe.ingredients.some(group =>
    group.items.some(i => i.name.toLowerCase().includes(q)),
  );
}

function RecipesPageInner() {
  const { data: recipes = [], isLoading, isError, refetch } = useRecipes();
  const [favorites] = useFavorites();
  const { summary: passportSummary } = useCookedStamps();
  const cookedRecipeSlugs = useMemo(() => {
    const slugs = new Set<string>();
    for (const stamps of passportSummary.stampsPerCountry.values()) {
      for (const stamp of stamps) slugs.add(stamp.recipe_slug);
    }
    return slugs;
  }, [passportSummary.stampsPerCountry]);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('default');
  const [hydrated, setHydrated] = useState(false);

  /* ── Search state ── */
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Hydrate search from ?q= on first load */
  useEffect(() => {
    const q = params.get('q') ?? '';
    if (q) {
      setSearchInput(q);
      setSearchQuery(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Debounced search: update query + URL 200ms after typing stops */
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
      const next = new URLSearchParams(params.toString());
      if (value) next.set('q', value);
      else next.delete('q');
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 200);
  }, [params, router, pathname]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
    const next = new URLSearchParams(params.toString());
    next.delete('q');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    inputRef.current?.focus();
  }, [params, router, pathname]);

  /* ── Seed filters from URL on first load, then strip the params ── */
  useEffect(() => {
    if (hydrated) return;
    if (recipes.length === 0) return;
    const country = params.get('country');
    const region = params.get('region');

    const next = new URLSearchParams(params.toString());
    let urlChanged = false;

    if (region) {
      const matched = recipes.some(r => r.region === region);
      if (matched) {
        setFilters(prev => ({ ...prev, regions: [region as CulinaryRegion] }));
      }
      // Always strip ?region — it's been consumed into filters.regions
      next.delete('region');
      urlChanged = true;
    } else if (country) {
      const match = recipes.find(r => r.country === country);
      if (match) {
        setFilters(prev => ({ ...prev, regions: [match.region] }));
      }
    }

    if (urlChanged) {
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }

    setHydrated(true);
  }, [recipes, params, hydrated, router, pathname]);

  /* ── Filtering pipeline: filters → country → search → sort ── */
  const filteredRecipes = useMemo(() => {
    const country = params.get('country');
    let result = applyFilters(recipes, filters);
    if (country) result = result.filter(r => r.country === country);
    if (searchQuery.trim()) result = result.filter(r => matchesSearch(r, searchQuery.trim()));
    return sortRecipes(result, sort);
  }, [recipes, filters, params, searchQuery, sort]);

  const activeFilterCount = useMemo(() => {
    const country = params.get('country');
    return countActiveFilters(filters) + (country ? 1 : 0);
  }, [filters, params]);

  const clearCountry = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete('country');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, router, pathname]);

  const activeCountry = params.get('country');
  const hasSearch = searchQuery.trim().length > 0;

  /* ── Active-filter chips: every dimension narrowing the catalogue ── */
  const chips = useMemo<Chip[]>(() => {
    const list: Chip[] = [];

    if (hasSearch) {
      list.push({ key: 'search', label: `“${searchQuery.trim()}”`, onClear: clearSearch });
    }
    if (activeCountry) {
      list.push({ key: `country:${activeCountry}`, label: activeCountry, onClear: clearCountry });
    }
    filters.regions.forEach(region => {
      list.push({
        key: `region:${region}`,
        label: region,
        onClear: () => setFilters(prev => ({ ...prev, regions: prev.regions.filter(r => r !== region) })),
      });
    });
    if (filters.mealType !== 'all') {
      list.push({
        key: 'mealType',
        label: MEAL_LABELS[filters.mealType],
        onClear: () => setFilters(prev => ({ ...prev, mealType: 'all' })),
      });
    }
    if (filters.maxTime !== null) {
      list.push({
        key: 'maxTime',
        label: `Under ${filters.maxTime}m`,
        onClear: () => setFilters(prev => ({ ...prev, maxTime: null })),
      });
    }
    if (filters.minProtein > 0) {
      list.push({
        key: 'minProtein',
        label: `≥ ${filters.minProtein}g protein`,
        onClear: () => setFilters(prev => ({ ...prev, minProtein: 0 })),
      });
    }
    if (filters.maxCalories < 800) {
      list.push({
        key: 'maxCalories',
        label: `≤ ${filters.maxCalories} cal`,
        onClear: () => setFilters(prev => ({ ...prev, maxCalories: 800 })),
      });
    }
    filters.tags.forEach(tag => {
      list.push({
        key: `tag:${tag}`,
        label: tag,
        onClear: () => setFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) })),
      });
    });

    return list;
  }, [hasSearch, searchQuery, activeCountry, filters, clearSearch, clearCountry]);

  const isFiltered = chips.length > 0;
  const showingCount = filteredRecipes.length;
  const totalCount = recipes.length;
  const countNoun = `recipe${showingCount === 1 ? '' : 's'}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* ── Editorial header ── */}
      <header className="max-w-3xl">
        <div className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80">
          The Catalogue &middot; Nieves&#39; Kitchen
        </div>
        <h1 className="mt-3 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-dark tracking-tight leading-[1.05]">
          Recipes from everywhere
        </h1>
        <p className="mt-4 max-w-[54ch] text-brown-medium text-base sm:text-lg italic leading-relaxed">
          A growing collection of globally-inspired halal recipes: tried, tested, and personally loved.
        </p>
      </header>

      {/* Full-width rule + count + active filter chips. Lives outside the
          max-w-3xl header so the rule spans the same width as the search bar. */}
      <div className="mt-8 sm:mt-10 mb-6 pt-5 border-t border-brown-light/30 flex flex-wrap items-baseline gap-x-5 gap-y-3">
        <span
          className="font-stamp text-base sm:text-lg uppercase tracking-[0.22em] text-brown-dark nums-tabular shrink-0"
          aria-live="polite"
        >
          {isLoading
            ? 'Gathering…'
            : isFiltered
              ? `${showingCount} of ${totalCount} ${countNoun}`
              : `№ ${showingCount} ${countNoun}`}
        </span>
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map(c => (
              <FilterChip key={c.key} label={c.label} onClear={c.onClear} />
            ))}
          </div>
        )}
      </div>

      {/* ── Search bar ── */}
      <div className="relative mb-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-light pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={searchInput}
          onChange={e => handleSearchChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape') clearSearch(); }}
          placeholder="Search by name, country, or ingredient…"
          aria-label="Search recipes"
          className="w-full bg-surface border border-brown-light/25 rounded-full py-3 pl-11 pr-10 text-base text-brown-dark placeholder:text-brown-light focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/15 transition-colors shadow-sm"
        />
        {searchInput && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-brown-light hover:text-brown-dark hover:bg-parchment-dark transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Sort ── */}
      {!isLoading && !isError && filteredRecipes.length > 1 && (
        <div className="flex items-center justify-end mb-5">
          <label className="flex items-center gap-2 text-sm text-brown-medium">
            <ArrowUpDown size={14} />
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="bg-surface border border-brown-light/25 rounded-full px-3 py-1.5 text-sm text-brown-dark focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/15 transition-colors cursor-pointer"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* ── Content ── */}
      {isError ? (
        <div className="text-center py-20">
          <p className="font-heading text-xl text-brown-dark mb-2">Something went wrong</p>
          <p className="text-brown-medium text-base mb-5">The recipes didn&apos;t come through. It&apos;s likely a connection issue on our end or yours.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal/90 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`bg-surface rounded-2xl overflow-hidden shadow-md animate-pulse ${i === 0 ? 'sm:col-span-2 sm:flex' : ''}`}>
              <div className={i === 0 ? 'h-52 sm:h-auto sm:w-1/2 sm:min-h-[16rem] bg-parchment-dark' : 'h-44 bg-parchment-dark'} />
              <div className={`space-y-3 ${i === 0 ? 'p-5 sm:p-6 sm:w-1/2' : 'p-4'}`}>
                <div className={`h-4 bg-parchment-dark rounded ${i === 0 ? 'w-2/3' : 'w-3/4'}`} />
                <div className="h-3 bg-parchment-dark rounded w-1/2" />
                {i === 0 && <div className="h-3 bg-parchment-dark rounded w-5/6" />}
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-heading text-xl text-brown-dark mb-2">
            {hasSearch
              ? <>No recipes match &ldquo;{searchQuery.trim()}&rdquo;</>
              : 'Nothing here yet'}
          </p>
          <p className="text-brown-medium text-base mb-5">
            {hasSearch && activeFilterCount > 0
              ? 'Try a different search term or adjust your filters.'
              : hasSearch
                ? 'Check the spelling or try a broader term.'
                : 'Try loosening your filters or exploring a different region.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {hasSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-5 py-2.5 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal/90 transition-colors"
              >
                Clear search
              </button>
            )}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  hasSearch
                    ? 'border-2 border-brown-light/30 text-brown-medium hover:border-teal hover:text-teal'
                    : 'bg-teal text-white hover:bg-teal/90'
                }`}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe: Recipe, index: number) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favorites.has(recipe.id)}
                isCooked={cookedRecipeSlugs.has(recipe.id)}
                featured={index === 0 && filteredRecipes.length >= 4 && !hasSearch}
              />
            ))}
        </div>
      )}

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 text-brown-medium">Gathering recipes…</div>}>
      <RecipesPageInner />
    </Suspense>
  );
}
