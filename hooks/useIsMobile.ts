'use client';

import { useSyncExternalStore } from 'react';

export const MOBILE_BREAKPOINT = 640;

const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(cb: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

function getSnapshot(): boolean {
  return window.matchMedia(query).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
