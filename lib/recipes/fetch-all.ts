import type { SupabaseClient } from '@supabase/supabase-js';
import { dbToRecipe, DbRecipeSchema, type Recipe } from '@/lib/types';

/**
 * The whole catalogue, validated at the edge. Shared by `useRecipes` (browser)
 * and `getCatalogue` (server, audit F5) so the list the server hands to React
 * Query is exactly the list the browser would have fetched: same columns,
 * same order, same rows dropped.
 */
export async function fetchAllRecipes(supabase: SupabaseClient): Promise<Recipe[]> {
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
      console.error('[recipes] dropping malformed row', parsed.error.issues);
    }
  }
  return rows;
}
