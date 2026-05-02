import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { DbRecipe } from '@/lib/types';

export const getRecipe = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data || error) return null;
  return data as DbRecipe;
});
