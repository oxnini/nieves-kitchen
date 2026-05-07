'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Turnstile } from '@marsidev/react-turnstile';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { ensureAnonymousSession } from '@/lib/supabase/anonymous';
import PassportOverlayProvider from './passport/PassportOverlay';

const SessionReadyContext = createContext(false);

export function useSessionReady() {
  return useContext(SessionReadyContext);
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5 },
    },
  }));

  const [sessionReady, setSessionReady] = useState(false);
  const [needsCaptcha, setNeedsCaptcha] = useState(false);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabaseRef.current = supabase;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionReady(true);
      } else {
        setNeedsCaptcha(true);
      }
    });
  }, []);

  const handleCaptchaSuccess = useCallback(async (token: string) => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    const session = await ensureAnonymousSession(supabase, token);
    if (session) setSessionReady(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionReadyContext.Provider value={sessionReady}>
        <PassportOverlayProvider>{children}</PassportOverlayProvider>
        {needsCaptcha && TURNSTILE_SITE_KEY ? (
          <div className="fixed bottom-4 right-4 z-50">
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={handleCaptchaSuccess}
              options={{ appearance: 'interaction-only', theme: 'auto' }}
            />
          </div>
        ) : null}
      </SessionReadyContext.Provider>
    </QueryClientProvider>
  );
}
