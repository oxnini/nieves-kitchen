'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { ensureAnonymousSession } from '@/lib/supabase/anonymous';

const SessionReadyContext = createContext(false);

export function useSessionReady() {
  return useContext(SessionReadyContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5 },
    },
  }));

  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    ensureAnonymousSession(supabase).then(() => setSessionReady(true));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionReadyContext.Provider value={sessionReady}>
        {children}
      </SessionReadyContext.Provider>
    </QueryClientProvider>
  );
}
