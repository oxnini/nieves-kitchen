'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown, Search, X } from 'lucide-react';
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
import { applyFilters, countActiveFilters, DEFAULT_FILTERS, tagLabel } from '@/lib/filters';
import { COLLECTIONS, collectionBySlug } from '@/lib/collections';
import { Button, Chip, Eyebrow } from '@/components/courtyard';
import type { CulinaryRegion, Filters, MealFilter, Recipe } from '@/lib/types';

type SortOption = 'newest' | 'title' | 'protein-desc' | 'time-asc' | 'calories-asc' | 'region';

/* "Newest first" is a real sort on created_at, which the database sets on
   first insert and seed-recipes never writes, so a re-seed keeps a recipe's
   date (spec §7). It replaced "Default", which was A to Z under a name that
   said nothing. */
const SORT_LABELS: Record<SortOption, string> = {
  'newest':       'Newest first',
  'title':        'A to Z',
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
  sweets: 'Sweets & bakes',
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
  const sorted = [...recipes];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'title':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
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
  const [sort, setSort] = useState<SortOption>('newest');
  const [hydrated, setHydrated] = useState(false);

  /* ── Search state ── */
  /* Seeded from ?q= in the first render, not an effect, so the server's HTML
     already holds the searched list (audit F5). */
  const [searchInput, setSearchInput] = useState(() => params.get('q') ?? '');
  const [searchQuery, setSearchQuery] = useState(() => params.get('q') ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  /* Debounced search: update query + URL 200ms after typing stops. Reads
     window.location.search inside the timeout (not the captured `params`)
     so a chip click within the 200ms window keeps its own param changes
     (e.g. ?collection=) instead of being clobbered by a stale snapshot. */
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
      const next = new URLSearchParams(window.location.search);
      if (value) next.set('q', value);
      else next.delete('q');
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 200);
  }, [router, pathname]);

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
        label: tagLabel(tag),
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

      {/* Controls, in one order at every width (spec §7, audit F11): search
          alone on its row; the collection chips with Filters as the last
          chip; the shelf header and active-filter pills when there are any;
          then the count with the sort opposite it, over an ink rule that
          heads the list. Lives outside the max-w-3xl header so it spans the
          grid width. */}
      <div className="mt-6">
        {/* ── Search bar ── */}
        <div className="relative w-full min-w-0">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium pointer-events-none"
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
            className="w-full h-11 bg-surface ring-1 ring-line rounded-full pl-11 pr-10 text-base sm:text-sm text-brown-dark placeholder:text-brown-medium focus:outline-none focus:ring-2 focus:ring-teal transition-shadow"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-brown-medium hover:text-brown-dark hover:bg-parchment-dark transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Collection chips: "All recipes" plus every collection that
              filters this page (travels excludes itself; it links to /atlas
              instead), then the Filters trigger as one more chip. A
              collection chip sets/clears ?collection= while keeping every
              other param, so search and country presets survive a click. ── */}
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Collections and filters">
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
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            activeFilterCount={activeFilterCount}
            variant="chip"
          />
        </div>
      </div>

      {/* ── Collection shelf header: a place you're browsing, not a filter.
            One band hung on the collection's accent. ── */}
      {activeCollection && (
        <div className="mt-7">
          <Eyebrow tone="terracotta" className="mb-2">Collection</Eyebrow>
          <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5">
            <h2 className="min-w-0 font-heading text-2xl sm:text-3xl font-normal text-brown-dark leading-snug">
              {activeCollection.title}
            </h2>
            <button
              type="button"
              onClick={clearCollection}
              aria-label="Leave this collection"
              className="flex items-center gap-1.5 text-[14px] text-brown-medium hover:text-brown-dark transition-colors"
            >
              <X size={16} aria-hidden="true" />
              All recipes
            </button>
          </div>
          <p className="mt-1.5 text-base text-brown-medium leading-relaxed max-w-2xl">
            {activeCollection.description}
          </p>
        </div>
      )}

      {/* ── Active filter chips: every dimension narrowing the catalogue ── */}
      {chips.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map(c => (
            <FilterChip key={c.key} label={c.label} onClear={c.onClear} />
          ))}
        </div>
      )}

      {/* ── Count, with the sort opposite it, over the rule that heads the
            list. The sort is a quiet text select; 16px on phones so iOS
            doesn't zoom on focus. ── */}
      <div className="mt-5 mb-0 sm:mb-6 flex min-h-11 items-center justify-between gap-4 border-b border-brown-dark pb-1">
        <span
          className="text-[14px] font-medium text-brown-dark nums-tabular"
          aria-live="polite"
        >
          {isLoading
            ? 'Gathering…'
            : isFiltered
              ? `${showingCount} of ${totalCount} ${countNoun}`
              : `${showingCount} ${countNoun}`}
        </span>
        {!isLoading && !isError && filteredRecipes.length > 1 && (
          <label className="relative flex items-center text-brown-dark">
            <span className="sr-only">Sort recipes</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="h-11 appearance-none bg-transparent pl-2 pr-6 text-right font-body text-base sm:text-[14px] text-brown-dark cursor-pointer rounded-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-teal"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-0 text-brown-medium" aria-hidden="true" />
          </label>
        )}
      </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-11 lg:grid-cols-3" aria-busy="true" aria-live="polite">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-start gap-3.5 border-b border-line py-3.5 sm:block sm:border-0 sm:py-0">
              <div className="aspect-square w-[120px] shrink-0 bg-parchment-dark sm:aspect-[3/2] sm:w-auto" />
              <div className="min-w-0 flex-1">
                <div className="sm:mt-3.5 sm:border-t sm:border-brown-dark sm:pt-2.5">
                  <div className="h-3 w-1/3 rounded bg-parchment-dark" />
                </div>
                <div className="mt-2 h-5 w-3/4 rounded bg-parchment-dark" />
                <div className="mt-2 h-3.5 w-full rounded bg-parchment-dark" />
                <div className="mt-1.5 h-3.5 w-2/3 rounded bg-parchment-dark" />
              </div>
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
          {/* An empty collection points at where it lives meanwhile (the
              Sunnah foods in the pantry, audit F14) rather than ending here. */}
          {activeCollection?.meanwhile && !hasSearch && activeFilterCount === 0 && (
            <>
              <p className="text-brown-medium text-base mb-5">{activeCollection.meanwhile.emptyNote}</p>
              <Button variant="primary" href={activeCollection.meanwhile.href}>
                {activeCollection.meanwhile.emptyAction}
              </Button>
            </>
          )}
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
        /* Phones: a ruled contents list, one row per recipe (each row draws
           its own hairline). From sm up: the ruled card grid. Spec §7. */
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-11 lg:grid-cols-3">
            {filteredRecipes.map((recipe: Recipe, index: number) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favorites.has(recipe.id)}
                isCooked={cookedRecipeSlugs.has(recipe.id)}
                priority={index < 3}
                listOnPhone
              />
            ))}
        </div>
      )}
    </div>
  );
}

/**
 * The browse page's client half. No Suspense around it: `page.tsx` renders
 * per request, where useSearchParams needs none, and a boundary here made
 * React stream the cards after a "Gathering recipes…" fallback instead of
 * putting them in the page's first HTML (audit F5).
 */
export default function RecipesBrowse() {
  return <RecipesPageInner />;
}
