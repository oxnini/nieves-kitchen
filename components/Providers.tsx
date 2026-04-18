'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ensureAnonymousSession } from '@/lib/supabase/anonymous';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5 },
    },
  }));

  useEffect(() => {
    const supabase = createClient();
    ensureAnonymousSession(supabase);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
