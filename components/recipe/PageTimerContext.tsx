'use client';

import { createContext, useContext } from 'react';
import type { PageTimer } from '@/hooks/usePageTimer';

export interface PageTimerContextValue {
  timer: PageTimer;
}

export const PageTimerContext = createContext<PageTimerContextValue | null>(null);

/**
 * Read the one page timer. Consumers: StickyStepCard (hosts the co-located
 * PageTimerStrip) and InstructionGroupList (DurationToken seeds the timer
 * from tappable durations in step prose).
 */
export function usePageTimerContext(): PageTimer | null {
  return useContext(PageTimerContext)?.timer ?? null;
}
