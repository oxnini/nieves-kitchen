'use client';

import { useEffect } from 'react';

/**
 * Freezes the page behind an open overlay, and — the reason this exists as a
 * shared hook rather than a line of inline `body.style.overflow` — kills Chrome
 * Android's pull-to-refresh for as long as the overlay is up.
 *
 * Without `overscroll-behavior-y: none`, any downward drag that lands on a
 * modal's backdrop is handed to the browser, which pulls the *page underneath*
 * to refresh and reloads the route out from under the sheet. Reported on a real
 * device 2026-09-02: dragging the dim strip above the recipe sheet reloaded the
 * page instead of dismissing.
 *
 * Reference-counted, because overlays stack (a recipe sheet can be open behind
 * the passport). The first lock records the previous inline values; the last
 * unlock restores them, so nested overlays can't strand the page in a locked
 * state.
 */
let lockCount = 0;
let saved: { bodyOverflow: string; htmlOverscroll: string; bodyPadding: string } | null = null;

export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;

    const body = document.body;
    const html = document.documentElement;

    lockCount += 1;
    if (lockCount === 1) {
      saved = {
        bodyOverflow: body.style.overflow,
        htmlOverscroll: html.style.overscrollBehaviorY,
        bodyPadding: body.style.paddingRight,
      };
      // Compensate for the disappearing scrollbar so desktop content doesn't
      // shift sideways when the overlay opens. Zero on mobile / overlay
      // scrollbars.
      const gap = window.innerWidth - html.clientWidth;
      body.style.overflow = 'hidden';
      html.style.overscrollBehaviorY = 'none';
      if (gap > 0) body.style.paddingRight = `${gap}px`;
    }

    return () => {
      lockCount -= 1;
      if (lockCount === 0 && saved) {
        body.style.overflow = saved.bodyOverflow;
        html.style.overscrollBehaviorY = saved.htmlOverscroll;
        body.style.paddingRight = saved.bodyPadding;
        saved = null;
      }
    };
  }, [active]);
}
