import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { DbRecipeSchema, type DbRecipe } from '@/lib/types';

/**
 * Server-side fetch for a single recipe by slug. Wrapped in React `cache()`
 * so a Server Component and its `generateMetadata` sibling don't double-hit
 * Supabase for the same request.
 *
 * Returns `null` for the not-found case AND for malformed rows (e.g. a
 * jsonb cell that doesn't match the schema). The page's notFound() branch
 * handles both paths identically.
 */
export const getRecipe = cache(async (slug: string): Promise<DbRecipe | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data || error) return null;

  const parsed = DbRecipeSchema.safeParse(data);
  if (!parsed.success) {
    console.error('[getRecipe] schema mismatch for slug', slug, parsed.error.issues);
    return null;
  }
  return parsed.data;
});
