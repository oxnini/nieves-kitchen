'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { fetchAllRecipes } from '@/lib/recipes/fetch-all';
import type { Recipe } from '@/lib/types';
import { recipesQueryKey } from './queryKeys';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * On `/`, `/recipes` and `/atlas` the server has usually filled this cache
 * already (`CatalogueBoundary`, audit F5), so the first render has the
 * recipes and this queryFn only runs once that copy goes stale.
 */
export function useRecipes() {
  return useQuery<Recipe[]>({
    queryKey: recipesQueryKey(),
    queryFn: async () => {
      if (USE_MOCK) {
        const { MOCK_RECIPES } = await import('@/lib/mock-recipes');
        return MOCK_RECIPES;
      }
      return fetchAllRecipes(createClient());
    },
  });
}
