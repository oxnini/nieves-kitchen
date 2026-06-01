/**
 * Placeholder Supabase database types.
 *
 * To populate this file with real, project-specific types, run:
 *
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
 *
 * (Requires the Supabase CLI logged in, and the project id from the
 * Supabase dashboard URL: https://supabase.com/dashboard/project/<id>.)
 *
 * After regenerating, the Supabase client constructors can be tightened:
 *
 *   import type { Database } from '@/lib/database.types';
 *   createBrowserClient<Database>(url, key);
 *   createServerClient<Database>(url, key, { cookies: ... });
 *
 * Until that's done, the typed surface is intentionally empty so nothing
 * compiles against it accidentally.
 */
export type Database = {
  /* run: npx supabase gen types typescript --project-id YOUR_ID > lib/database.types.ts */
};
