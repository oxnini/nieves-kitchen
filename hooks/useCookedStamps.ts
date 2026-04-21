'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { summarizeStamps, type Stamp } from '@/lib/passport';
import { useRecipes } from './useRecipes';
import type { CulinaryRegion } from '@/lib/types';

export function useCookedStamps() {
  const stampsQuery = useQuery<Stamp[]>({
    queryKey: ['passport-stamps'],
    queryFn: async () => {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];
      const { data, error } = await supabase
        .from('passport_stamps')
        .select('id, recipe_slug, recipe_country, cooked_at')
        .order('cooked_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Stamp[];
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const recipesQuery = useRecipes();

  const countryToRegion = useMemo(() => {
    const map = new Map<string, CulinaryRegion>();
    for (const r of recipesQuery.data ?? []) {
      map.set(r.country, r.region);
    }
    return map;
  }, [recipesQuery.data]);

  const summary = useMemo(
    () => summarizeStamps(stampsQuery.data ?? [], countryToRegion),
    [stampsQuery.data, countryToRegion],
  );

  return {
    stamps: stampsQuery.data ?? [],
    summary,
    isLoading: stampsQuery.isLoading || recipesQuery.isLoading,
    error: stampsQuery.error ?? recipesQuery.error,
  };
}
