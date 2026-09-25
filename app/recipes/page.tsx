'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowUpDown, Search, X } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';

// FilterPanel pulls in framer-motion and rc-slider (plus rc-slider's CSS).
// Defer it so the recipe grid paints without blocking on those bytes.
const FilterPanel = dynamic(() => import('@/components/FilterPanel'), {
  ssr: false,
  loading: () => null,
});
import { useFavorites } from '@/hooks/useFavorites';
import { useCookedRecipeSlugs } from '@/hooks/useCookedRecipeSlugs';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS } from '@/lib/filters';
import { COLLECTIONS, collectionBySlug } from '@/lib/collections';
import { Button, Chip, Eyebrow } from '@/components/courtyard';
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

type FilterChipData = { key: string; label: string; onClear: () => void };

/* Short chip labels for the collection row (amended spec §7); the long
   editorial titles stay in lib/collections for the shelf header. "Travels"
   is excluded below since it links out to /atlas, not a filter here. */
const COLLECTION_CHIP_LABEL: Record<string, string> = {
  'high-protein': 'High protein',
  sides: 'Sides',
  sunnah: 'From the Prophet’s ﷺ table',
};

/** Sets or clears `?collection=` on the current URL while keeping every
    other param (q, country, region, etc.) untouched. */
function collectionChipHref(slug: string | null, params: URLSearchParams, pathname: string): string {
  const next = new URLSearchParams(params.toString());
  if (slug) next.set('collection', slug);
  else next.delete('collection');
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/** Pill chip matching FilterPanel's vocabulary, with a remove affordance. */
function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Remove filter: ${label}`}
      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-parchment-dark/60 border border-brown-light/40 text-[12px] font-medium text-brown-dark hover:border-terracotta/60 hover:bg-terracotta/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta"
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
      return sorted.sort((a, b) => (a.region ?? '').localeCompare(b.region ?? ''));
    default:
      return sorted;
  }
}

/** Case-insensitive substring match across name, country, and ingredients. */
function matchesSearch(recipe: Recipe, query: string): boolean {
  const q = query.toLowerCase();
  if (recipe.name.toLowerCase().includes(q)) return true;
  if (recipe.country !== null && recipe.country.toLowerCase().includes(q)) return true;
  return recipe.ingredients.some(group =>
    group.items.some(i => i.name.toLowerCase().includes(q)),
  );
}

function RecipesPageInner() {
  const { data: recipes = [], isLoading, isError, refetch } = useRecipes();
  const [favorites] = useFavorites();
  const cookedRecipeSlugs = useCookedRecipeSlugs();
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

  /* ?focus=search (the navbar's search icon): focus the input, then drop just
     that param so the next click on the icon re-adds it and re-fires this,
     including when it is clicked from /recipes itself. Every other param
     (?collection=, ?country=, ?q=) is kept. */
  const focusParam = params.get('focus');
  useEffect(() => {
    if (focusParam !== 'search') return;
    inputRef.current?.focus();
    const next = new URLSearchParams(window.location.search);
    next.delete('focus');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [focusParam, router, pathname]);

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
      const matchedRegion = match?.region ?? null;
      if (matchedRegion) {
        setFilters(prev => ({ ...prev, regions: [matchedRegion] }));
      }
    }

    if (urlChanged) {
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }

    setHydrated(true);
  }, [recipes, params, hydrated, router, pathname]);

  const activeCountry = params.get('country');
  const activeCollection = useMemo(() => {
    const slug = params.get('collection');
    return slug ? collectionBySlug(slug) ?? null : null;
  }, [params]);

  /* ── Filtering pipeline: filters → country → collection → search → sort ── */
  const filteredRecipes = useMemo(() => {
    const country = params.get('country');
    let result = applyFilters(recipes, filters);
    if (country) result = result.filter(r => r.country === country);
    if (activeCollection?.includes) result = result.filter(activeCollection.includes);
    if (searchQuery.trim()) result = result.filter(r => matchesSearch(r, searchQuery.trim()));
    return sortRecipes(result, sort);
  }, [recipes, filters, params, activeCollection, searchQuery, sort]);

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

  const clearCollection = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete('collection');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, router, pathname]);

  const hasSearch = searchQuery.trim().length > 0;

  /* ── Active-filter chips: every dimension narrowing the catalogue ── */
  const chips = useMemo<FilterChipData[]>(() => {
    const list: FilterChipData[] = [];

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
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-5 pb-10 sm:pt-7 sm:pb-14">
      {/* ── Editorial header ── */}
      <header className="max-w-3xl">
        <Eyebrow tone="terracotta">The Catalogue &middot; Nieves&#39;s Kitchen</Eyebrow>
        <h1 className="mt-2.5 font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-brown-dark tracking-tight leading-[1.05]">
          The recipes so far
        </h1>
        <p className="mt-2.5 max-w-[54ch] text-brown-medium text-base sm:text-lg italic leading-relaxed">
          A collection that grows one dish at a time. Each one{' '}
          <Link
            href="/promise"
            className="not-italic underline decoration-brown-light/40 underline-offset-2 hover:text-brown-dark transition-colors"
          >
            halal
          </Link>
          , cooked in my kitchen, and written down the way I actually make it.
        </p>
      </header>

      {/* Search and the Filters trigger on their own full-width row (spec §7),
          sort riding along on the same line. Desktop keeps all three on one
          line; mobile gives search its own full line and pairs filters (left)
          with sort (right) on a second. Lives outside the max-w-3xl header so
          it spans the grid width. */}
      <div className="mt-6">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
          {/* ── Search bar ── */}
          <div className="relative w-full sm:w-auto sm:flex-1 min-w-0">
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
              className="w-full h-11 bg-surface ring-1 ring-line rounded-full pl-11 pr-10 text-base sm:text-sm text-brown-dark placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-teal/40 transition-shadow"
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

          {/* ── Filters trigger (inline, matches the search surface) ── */}
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            activeFilterCount={activeFilterCount}
            variant="inline"
          />

          {/* ── Sort: last on the row everywhere. `ml-auto` pins it to the
                right of the mobile second line, opposite the filters trigger. ── */}
          {!isLoading && !isError && filteredRecipes.length > 1 && (
            <label className="flex items-center gap-2 h-11 ml-auto sm:ml-0 shrink-0 text-sm text-brown-medium">
              <ArrowUpDown size={14} className="shrink-0" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                aria-label="Sort recipes"
                className="h-11 bg-surface ring-1 ring-line rounded-full px-3 text-sm text-brown-dark focus:outline-none focus:ring-2 focus:ring-teal/40 transition-shadow cursor-pointer"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          )}
        </div>

        {/* ── Collection chips: "All recipes" plus every collection that
              filters this page (travels excludes itself; it links to /atlas
              instead). Sets/clears ?collection= while keeping every other
              param, so search and country presets survive a chip click. ── */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip href={collectionChipHref(null, params, pathname)} active={!activeCollection}>
            All recipes
          </Chip>
          {COLLECTIONS.filter(c => c.includes !== null).map(c => (
            <Chip
              key={c.slug}
              href={collectionChipHref(c.slug, params, pathname)}
              active={activeCollection?.slug === c.slug}
            >
              {COLLECTION_CHIP_LABEL[c.slug] ?? c.title}
            </Chip>
          ))}
        </div>

        {/* ── Count + active filter chips (compact line under the controls).
              Absorbed into the shelf header band when a collection is active. ── */}
        {!activeCollection && (
          <div className="mt-5 mb-6 flex flex-wrap items-baseline gap-x-5 gap-y-3">
            <span
              className="font-stamp text-sm sm:text-base uppercase tracking-[0.22em] text-brown-dark nums-tabular shrink-0"
              aria-live="polite"
            >
              {isLoading
                ? 'Gathering…'
                : isFiltered
                  ? `${showingCount} of ${totalCount} ${countNoun}`
                  : `${showingCount} ${countNoun}`}
            </span>
            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {chips.map(c => (
                  <FilterChip key={c.key} label={c.label} onClear={c.onClear} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Collection shelf header: a place you're browsing, not a filter.
            One band hung on the collection's accent, replacing the count line. ── */}
      {activeCollection && (
        <div className="mt-6 mb-8">
          <Eyebrow tone="terracotta" className="mb-2">Collection</Eyebrow>
          <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 min-w-0">
              <h2 className="font-heading text-2xl sm:text-3xl font-normal text-brown-dark leading-snug">
                {activeCollection.title}
              </h2>
              <span
                className="font-stamp text-sm sm:text-base uppercase tracking-[0.22em] text-brown-dark nums-tabular"
                aria-live="polite"
              >
                {isLoading
                  ? 'Gathering…'
                  : isFiltered
                    ? `${showingCount} of ${totalCount} ${countNoun}`
                    : `${showingCount} ${countNoun}`}
              </span>
            </div>
            <button
              type="button"
              onClick={clearCollection}
              aria-label="Leave this collection"
              className="flex items-center gap-1.5 font-stamp text-[11px] uppercase tracking-[0.22em] text-brown-medium hover:text-brown-dark transition-colors"
            >
              <X size={13} aria-hidden="true" />
              All recipes
            </button>
          </div>
          <p className="mt-1.5 text-base text-brown-medium leading-relaxed max-w-2xl">
            {activeCollection.description}
          </p>
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {chips.map(c => (
                <FilterChip key={c.key} label={c.label} onClear={c.onClear} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {isError ? (
        <div className="text-center py-20">
          <p className="font-heading text-xl text-brown-dark mb-2">Something went wrong</p>
          <p className="text-brown-medium text-base mb-5">The recipes didn&apos;t come through. It&apos;s likely a connection issue on our end or yours.</p>
          <Button variant="primary" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-x-7 gap-y-8 sm:grid-cols-2 sm:gap-y-11 lg:grid-cols-3" aria-busy="true" aria-live="polite">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/2] bg-parchment-dark" />
              <div className="mt-3.5 border-t border-brown-dark pt-2.5">
                <div className="h-3 w-1/3 rounded bg-parchment-dark" />
              </div>
              <div className="mt-2 h-5 w-3/4 rounded bg-parchment-dark" />
              <div className="mt-2 h-3.5 w-full rounded bg-parchment-dark" />
              <div className="mt-1.5 h-3.5 w-2/3 rounded bg-parchment-dark" />
            </div>
          ))}
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-heading text-xl text-brown-dark mb-2">
            {hasSearch
              ? <>No recipes match &ldquo;{searchQuery.trim()}&rdquo;</>
              : activeCollection?.emptyCopy ?? 'Nothing here yet'}
          </p>
          {!(activeCollection && !hasSearch && countActiveFilters(filters) === 0) && (
            <p className="text-brown-medium text-base mb-5">
              {hasSearch && activeFilterCount > 0
                ? 'Try a different search term or adjust your filters.'
                : hasSearch
                  ? 'Check the spelling or try a broader term.'
                  : 'Try loosening your filters or exploring a different region.'}
            </p>
          )}
          <div className="flex items-center justify-center gap-3">
            {hasSearch && (
              <Button variant="primary" onClick={clearSearch}>
                Clear search
              </Button>
            )}
            {activeFilterCount > 0 && (
              <Button
                variant={hasSearch ? 'secondary' : 'primary'}
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-7 gap-y-8 sm:grid-cols-2 sm:gap-y-11 lg:grid-cols-3">
            {filteredRecipes.map((recipe: Recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favorites.has(recipe.id)}
                isCooked={cookedRecipeSlugs.has(recipe.id)}
              />
            ))}
        </div>
      )}
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
