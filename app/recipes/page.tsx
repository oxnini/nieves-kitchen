'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import FilterPanel from '@/components/FilterPanel';
import { useRecipes } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS } from '@/lib/filters';
import type { Filters, Recipe } from '@/lib/types';

function RecipesPageInner() {
  const { data: recipes = [], isLoading } = useRecipes();
  const [favorites] = useFavorites();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated) return;
    if (recipes.length === 0) return;
    const country = params.get('country');
    if (country) {
      const match = recipes.find(r => r.country === country);
      if (match) {
        setFilters(prev => ({ ...prev, regions: [match.region] }));
      }
    }
    setHydrated(true);
  }, [recipes, params, hydrated]);

  const filteredRecipes = useMemo(() => {
    const country = params.get('country');
    const base = applyFilters(recipes, filters);
    return country ? base.filter(r => r.country === country) : base;
  }, [recipes, filters, params]);

  const activeFilterCount = useMemo(() => {
    const country = params.get('country');
    return countActiveFilters(filters) + (country ? 1 : 0);
  }, [filters, params]);

  const clearCountry = () => {
    const next = new URLSearchParams(params.toString());
    next.delete('country');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const activeCountry = params.get('country');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown-dark mb-2">All Recipes</h1>
        <p className="text-brown-medium text-sm">
          {isLoading ? 'Loading…' : (
            <>
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              {activeCountry && (
                <>
                  {' '}in <span className="text-terracotta font-medium">{activeCountry}</span>
                  {' '}
                  <button
                    type="button"
                    onClick={clearCountry}
                    className="underline text-brown-medium hover:text-brown-dark"
                  >
                    clear
                  </button>
                </>
              )}
              {activeFilterCount > 0 && !activeCountry && (
                <span className="text-terracotta">
                  {' '}({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {!isLoading && filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown-medium text-lg mb-2">No recipes match your filters</p>
          <p className="text-brown-light text-sm">Try adjusting your filters to discover more dishes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes.map((recipe: Recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favorites.has(recipe.id)}
              />
            ))}
          </AnimatePresence>
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
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 text-brown-medium">Loading…</div>}>
      <RecipesPageInner />
    </Suspense>
  );
}
