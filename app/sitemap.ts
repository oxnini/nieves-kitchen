import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '@/lib/site';

// Rebuilt at most hourly, so a newly seeded recipe appears without a deploy.
export const revalidate = 3600;

const STATIC_ROUTES = ['', '/recipes', '/atlas', '/pantry', '/promise', '/about'];

async function recipeRows(): Promise<{ slug: string; created_at: string | null }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // CI builds without Supabase secrets, and the sitemap prerenders at build
  // time. Ship the static routes; the hourly revalidate fills in recipes on
  // the live site, where the keys exist.
  if (!url || !key) return [];
  // Plain anon client, not lib/supabase/server: the sitemap has no request
  // cookies, and recipes are anon-readable.
  const { data, error } = await createClient(url, key).from('recipes').select('slug, created_at');
  if (error) console.error('[sitemap]', error.message);
  return data ?? [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await recipeRows();
  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${SITE_URL}${route}` })),
    ...recipes.map((r) => ({
      url: `${SITE_URL}/recipes/${r.slug}`,
      lastModified: r.created_at ?? undefined,
    })),
  ];
}
