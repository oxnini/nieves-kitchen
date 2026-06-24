'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Tracks vertical scroll direction and reports whether a top-pinned element
 * should hide. Hides only while scrolling *down* past `threshold`; any upward
 * scroll (or returning near the top) reveals immediately.
 *
 * By default it watches `window` scroll. Pass `target` to watch an inner
 * scroll container instead (e.g. the recipe modal's scroll surface), so the
 * hook works for content that scrolls inside an overlay rather than the page.
 *
 * Pages/containers that never scroll (e.g. the fixed-map `/` route) keep their
 * scroll offset at 0, so this hook never reports `true` there.
 */
export function useHideOnScroll(
  threshold = 64,
  target?: RefObject<HTMLElement | null> | null,
): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = target?.current ?? null;
    const source: HTMLElement | Window = el ?? window;
    const getY = () => (el ? el.scrollTop : window.scrollY);

    let lastY = getY();
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = getY();

      if (y < threshold) {
        setHidden(false);
      } else if (y > lastY) {
        setHidden(true);   // scrolling down
      } else if (y < lastY) {
        setHidden(false);  // scrolling up
      }

      lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    source.addEventListener('scroll', onScroll, { passive: true });
    return () => source.removeEventListener('scroll', onScroll);
  }, [threshold, target]);

  return hidden;
}
