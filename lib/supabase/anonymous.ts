import type { SupabaseClient } from '@supabase/supabase-js';

export async function ensureAnonymousSession(client: SupabaseClient) {
  const { data } = await client.auth.getSession();
  if (data.session) return data.session;

  const { data: signed, error } = await client.auth.signInAnonymously();
  if (error) {
    console.error('Anonymous sign-in failed:', error.message);
    return null;
  }
  return signed.session;
}
