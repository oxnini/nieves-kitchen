'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks vertical scroll direction and reports whether a top-pinned element
 * should hide. Hides only while scrolling *down* past `threshold`; any upward
 * scroll (or returning near the top) reveals immediately.
 *
 * Pages whose document never scrolls (e.g. the fixed-map `/` route) keep
 * `scrollY` at 0, so this hook never reports `true` there.
 */
export function useHideOnScroll(threshold = 64): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;

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

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return hidden;
}
