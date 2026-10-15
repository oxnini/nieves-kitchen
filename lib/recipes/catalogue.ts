import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { fetchAllRecipes } from './fetch-all';
import type { Recipe } from '@/lib/types';

/**
 * How long one server copy of the catalogue is reused, in seconds. Matches the
 * browser's React Query staleTime (Providers), so a newly seeded recipe shows
 * up on the browse pages about as fast as it did when they fetched it
 * themselves.
 */
export const CATALOGUE_REVALIDATE = 300;

/**
 * The catalogue for server rendering (audit F5): the browse pages put it in
 * their HTML instead of starting empty and fetching from the browser.
 *
 * A plain anon client, not lib/supabase/server: recipes are anon-readable and
 * reading request cookies would make every page that calls this dynamic. The
 * response sits in Next's data cache for CATALOGUE_REVALIDATE seconds, so a
 * dynamic page (/recipes) doesn't hit Supabase on every request.
 *
 * Returns null when there's nothing to hand over: mock mode (the browser
 * imports the fixtures itself), no Supabase keys (CI builds without them), or
 * a failed fetch. The page then renders as before and the browser fetches.
 */
export async function getCatalogue(): Promise<Recipe[] | null> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: CATALOGUE_REVALIDATE } }),
    },
  });
  try {
    return await fetchAllRecipes(supabase);
  } catch (error) {
    console.error('[getCatalogue]', error);
    return null;
  }
}
