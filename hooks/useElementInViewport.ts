'use client';

import { useEffect, useState, type RefObject } from 'react';

export interface UseElementInViewportOptions {
  /** IntersectionObserver `root`. Default `null` = viewport. */
  root?: Element | null;
  /**
   * IntersectionObserver `rootMargin`. Default keeps the threshold below the
   * navbar so the consumer does not flicker as the observed element slides
   * under fixed page chrome.
   */
  rootMargin?: string;
  /** Threshold. Default `0` = any pixel in view counts. */
  threshold?: number;
}

/**
 * Returns `true` while the observed element has at least `threshold` of its
 * area visible inside the given root. Returns `false` while the ref is null
 * (e.g. before mount) so consumers can use it as a single render gate.
 *
 * Re-attaches the observer when ref.current or any option changes.
 */
export function useElementInViewport(
  ref: RefObject<HTMLElement | null>,
  options: UseElementInViewportOptions = {},
): boolean {
  const { root = null, rootMargin = '-72px 0px 0px 0px', threshold = 0 } = options;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setInView(false);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      // SSR/JSDOM/old browser: assume in view so the mini consumer never
      // hides the expanded panel's relevance.
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { root, rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, root, rootMargin, threshold]);

  return inView;
}
