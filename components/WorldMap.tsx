'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import WorldMapDesktop from './WorldMapDesktop';
import WorldMapMobile from './WorldMapMobile';
import type { Filters } from '@/lib/types';
import type { AtlasRecipe } from '@/lib/atlas';

interface Props {
  recipes: AtlasRecipe[];
  /** Full unfiltered recipe set. The map renders `recipes` (filtered), but
      MapSearch queries `allRecipes` so search stays a global jump-to tool
      regardless of active filters. */
  allRecipes: AtlasRecipe[];
  isLoading?: boolean;
  flyTo?: { lng: number; lat: number; zoom?: number };
  /** Filter state lives in the page; the map shells render FilterPanel so the
      control sits with the search it pairs with (a row on desktop, the chrome
      band on mobile). */
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeFilterCount: number;
}

export default function WorldMap(props: Props) {
  const isMobile = useIsMobile();
  return isMobile ? <WorldMapMobile {...props} /> : <WorldMapDesktop {...props} />;
}
