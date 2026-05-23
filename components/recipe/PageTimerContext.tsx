'use client';

import { createContext, useContext } from 'react';
import type { PageTimer } from '@/hooks/usePageTimer';

export const PageTimerContext = createContext<PageTimer | null>(null);

export function usePageTimerContext(): PageTimer | null {
  return useContext(PageTimerContext);
}
