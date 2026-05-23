'use client';

import { createContext, useContext, type RefObject } from 'react';

/**
 * Exposes the modal's overflow-y-auto scroll container to descendants that
 * need to anchor IntersectionObserver to it (e.g. MiniTimerStamp) or pin a
 * floating element inside the modal's scrollable area.
 *
 * Value is `null` outside of RecipeModal; consumers must handle that case.
 */
export const ModalScrollContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useModalScrollRef(): RefObject<HTMLDivElement | null> | null {
  return useContext(ModalScrollContext);
}
