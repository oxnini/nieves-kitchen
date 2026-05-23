'use client';

import { createContext, useContext, useRef, type RefObject } from 'react';
import type { PageTimer } from '@/hooks/usePageTimer';

export interface PageTimerContextValue {
  timer: PageTimer;
  /**
   * Set by TimerPanel on mount so MiniTimerStamp can observe its visibility
   * without RecipeDetail needing to thread refs through three layers.
   */
  expandedPanelRef: RefObject<HTMLElement | null>;
}

export const PageTimerContext = createContext<PageTimerContextValue | null>(null);

/**
 * Read just the timer -- convenience for the many existing consumers
 * (TimerPanel, DurationToken, PageTimer) that do not need the panel ref.
 */
export function usePageTimerContext(): PageTimer | null {
  return useContext(PageTimerContext)?.timer ?? null;
}

/**
 * Read the full context value. Use this from MiniTimerStamp, which needs both
 * the timer and the panel ref.
 */
export function usePageTimerContextFull(): PageTimerContextValue | null {
  return useContext(PageTimerContext);
}

/**
 * Allocate a stable ref for the expanded TimerPanel inside the host
 * (RecipeDetail). Returned ref is meant to be passed into the
 * PageTimerContext value plus set by TimerPanel via useImperativeHandle-style
 * registration on mount.
 */
export function useExpandedPanelRef(): RefObject<HTMLElement | null> {
  return useRef<HTMLElement | null>(null);
}
