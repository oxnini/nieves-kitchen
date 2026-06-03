'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import WorldMap from '@/components/WorldMap';
import { useRecipes } from '@/hooks/useRecipes';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS } from '@/lib/filters';
import type { Filters } from '@/lib/types';

function HomeContent() {
  const { data: recipes = [], isLoading } = useRecipes();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const searchParams = useSearchParams();

  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');
  const zoom = parseFloat(searchParams.get('zoom') ?? '');
  const flyTo = !isNaN(lat) && !isNaN(lng)
    ? { lat, lng, zoom: !isNaN(zoom) ? zoom : undefined }
    : undefined;

  const filteredRecipes = useMemo(() => applyFilters(recipes, filters), [recipes, filters]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return (
    <div className="relative sm:h-[100dvh] sm:-mt-[4.5rem]">
      <WorldMap
        recipes={filteredRecipes}
        allRecipes={recipes}
        isLoading={isLoading}
        flyTo={flyTo}
        filters={filters}
        onFiltersChange={setFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
