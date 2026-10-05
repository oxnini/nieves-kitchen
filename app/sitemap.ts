import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '@/lib/site';

// Rebuilt at most hourly, so a newly seeded recipe appears without a deploy.
export const revalidate = 3600;

const STATIC_ROUTES = ['', '/recipes', '/atlas', '/pantry', '/promise', '/about'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Plain anon client, not lib/supabase/server: the sitemap has no request
  // cookies, and recipes are anon-readable.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase.from('recipes').select('slug, created_at');
  if (error) console.error('[sitemap]', error.message);

  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${SITE_URL}${route}` })),
    ...(data ?? []).map((r) => ({
      url: `${SITE_URL}/recipes/${r.slug}`,
      lastModified: r.created_at ?? undefined,
    })),
  ];
}
