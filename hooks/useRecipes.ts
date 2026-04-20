'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { dbToRecipe } from '@/lib/types';
import type { DbRecipe, Recipe } from '@/lib/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export function useRecipes() {
  return useQuery<Recipe[]>({
    queryKey: ['recipes', USE_MOCK ? 'mock' : 'live'],
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
      return (data as DbRecipe[]).map(dbToRecipe);
    },
  });
}
