'use client';

import { useEffect, useRef, useState } from 'react';

// Minimal subset of the Wake Lock API we actually use. Avoids pulling in
// experimental lib.dom typings that may not be present in this project's TS version.
type WakeLockSentinelLike = {
  released?: boolean;
  release: () => Promise<void>;
  addEventListener: (type: 'release', listener: () => void) => void;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
};

/**
 * Keep the screen on while `active` is true. Releases on `active=false`,
 * unmount, and visibility hide; re-acquires on visibility return so the
 * lock survives a brief tab switch.
 *
 * `supported` is false when the API isn't available. Callers can surface
 * a one-time toast in that case; cook mode should not be blocked either way.
 */
export function useWakeLock(active: boolean): { supported: boolean } {
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const nav = navigator as NavigatorWithWakeLock;
    if (!nav.wakeLock) {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const nav = navigator as NavigatorWithWakeLock;
    const wakeLock = nav.wakeLock;
    if (!wakeLock) return;

    let cancelled = false;

    async function acquire() {
      if (!wakeLock) return;
      if (document.visibilityState !== 'visible') return;
      try {
        const sentinel = await wakeLock.request('screen');
        if (cancelled) {
          sentinel.release().catch(() => {});
          return;
        }
        sentinelRef.current = sentinel;
      } catch {
        // permission denied / unsupported. silent — caller can rely on `supported`.
      }
    }

    async function release() {
      const s = sentinelRef.current;
      sentinelRef.current = null;
      if (s) {
        try { await s.release(); } catch { /* ignore */ }
      }
    }

    function onVisibility() {
      if (!active) return;
      if (document.visibilityState === 'visible') {
        if (!sentinelRef.current) acquire();
      } else {
        release();
      }
    }

    if (active) {
      acquire();
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      release();
    };
  }, [active]);

  return { supported };
}
