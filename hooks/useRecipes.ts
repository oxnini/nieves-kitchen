'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { dbToRecipe, DbRecipeSchema } from '@/lib/types';
import type { Recipe } from '@/lib/types';
import { recipesQueryKey } from './queryKeys';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export function useRecipes() {
  return useQuery<Recipe[]>({
    queryKey: recipesQueryKey(),
    queryFn: async () => {
      if (USE_MOCK) {
        const { MOCK_RECIPES } = await import('@/lib/mock-recipes');
        return MOCK_RECIPES;
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('title');
      if (error) throw error;
      const rows: Recipe[] = [];
      for (const row of data ?? []) {
        const parsed = DbRecipeSchema.safeParse(row);
        if (parsed.success) {
          rows.push(dbToRecipe(parsed.data));
        } else {
          console.error('[useRecipes] dropping malformed row', parsed.error.issues);
        }
      }
      return rows;
    },
  });
}
