'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { dbToRecipe } from '@/lib/types';
import type { DbRecipe, Recipe } from '@/lib/types';

export function useRecipes() {
  return useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: async () => {
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
