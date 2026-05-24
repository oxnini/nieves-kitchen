'use client';

import { useSyncExternalStore } from 'react';

export type Theme = 'parchment' | 'sepia';

type Listener = () => void;
const listeners = new Set<Listener>();
let currentTheme: Theme = 'parchment';

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: Listener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return 'parchment';
}

/** Set the active theme. Updates `document.documentElement.dataset.theme`,
 *  persists to localStorage, and notifies all `useTheme()` subscribers. */
export function setTheme(next: Theme) {
  if (currentTheme === next) return;
  currentTheme = next;
  if (next === 'sepia') {
    document.documentElement.dataset.theme = 'sepia';
  } else {
    delete document.documentElement.dataset.theme;
  }
  try {
    localStorage.setItem('nieves-theme', next);
  } catch { /* private browsing */ }
  emit();
}

/** Initialise theme from localStorage. Safe to call multiple times; the
 *  first invocation seeds the store, later calls are no-ops. */
export function initTheme() {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem('nieves-theme') as Theme | null;
    if (stored === 'sepia') {
      currentTheme = 'sepia';
      document.documentElement.dataset.theme = 'sepia';
    }
  } catch { /* SSR / private browsing */ }
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsSepia(): boolean {
  return useTheme() === 'sepia';
}
