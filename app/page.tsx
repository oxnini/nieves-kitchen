'use client';

import { useMemo, useState } from 'react';
import WorldMap from '@/components/WorldMap';
import FilterPanel from '@/components/FilterPanel';
import { useRecipes } from '@/hooks/useRecipes';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS } from '@/lib/filters';
import type { Filters } from '@/lib/types';

export default function HomePage() {
  const { data: recipes = [], isLoading } = useRecipes();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filteredRecipes = useMemo(() => applyFilters(recipes, filters), [recipes, filters]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return (
    <div className="relative h-[calc(100vh-72px)]">
      <WorldMap recipes={filteredRecipes} isLoading={isLoading} />
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
