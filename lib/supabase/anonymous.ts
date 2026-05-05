import type { SupabaseClient } from '@supabase/supabase-js';

export async function ensureAnonymousSession(
  client: SupabaseClient,
  captchaToken?: string,
) {
  const { data } = await client.auth.getSession();
  if (data.session) return data.session;

  const { data: signed, error } = await client.auth.signInAnonymously(
    captchaToken ? { options: { captchaToken } } : undefined,
  );
  if (error) {
    console.error('Anonymous sign-in failed:', error.message);
    return null;
  }
  return signed.session;
}
