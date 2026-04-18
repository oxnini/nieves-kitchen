'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { ensureAnonymousSession } from '@/lib/supabase/anonymous';
import {
  computeTitle,
  summarizeStamps,
  type ExplorerTitle,
  type Stamp,
} from '@/lib/passport';
import type { CulinaryRegion, Recipe } from '@/lib/types';

export type CookTier = 'new_country' | 'new_recipe' | 'repeat';

export interface CookResult {
  tier: CookTier;
  titleUnlocked: ExplorerTitle | null;
  newStamp: Stamp;
  cookCount: number;
}

export function useLogCook() {
  const queryClient = useQueryClient();

  const mutation = useMutation<CookResult, Error, Recipe>({
    mutationFn: async (recipe) => {
      const supabase = createClient();
      const session = await ensureAnonymousSession(supabase);
      if (!session) throw new Error('Could not create anonymous session');

      const existing = (queryClient.getQueryData<Stamp[]>(['passport-stamps']) ?? []);
      const recipes = queryClient.getQueryData<Recipe[]>(['recipes']) ?? [];

      const countryToRegion = new Map<string, CulinaryRegion>();
      for (const r of recipes) countryToRegion.set(r.country, r.region);

      const beforeSummary = summarizeStamps(existing, countryToRegion);
      const beforeTitle = beforeSummary.title;

      const hadCountry = beforeSummary.uniqueCountries.has(recipe.country);
      const recipeCount = existing.filter(s => s.recipe_slug === recipe.id).length;

      const { data, error } = await supabase
        .from('passport_stamps')
        .insert({
          user_id: session.user.id,
          recipe_slug: recipe.id,
          recipe_country: recipe.country,
        })
        .select('id, recipe_slug, recipe_country, cooked_at')
        .single();

      if (error) throw error;
      const newStamp = data as Stamp;

      let tier: CookTier;
      if (!hadCountry) tier = 'new_country';
      else if (recipeCount === 0) tier = 'new_recipe';
      else tier = 'repeat';

      const nextStamps = [...existing, newStamp];
      const afterSummary = summarizeStamps(nextStamps, countryToRegion);
      const titleUnlocked =
        afterSummary.title !== beforeTitle ? afterSummary.title : null;

      return {
        tier,
        titleUnlocked,
        newStamp,
        cookCount: recipeCount + 1,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passport-stamps'] });
    },
  });

  return mutation;
}

export function useUndoCook() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (stampId) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('passport_stamps')
        .delete()
        .eq('id', stampId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passport-stamps'] });
    },
  });
}

export { computeTitle };
