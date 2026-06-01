'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'nieves-favorites';

type Listener = () => void;
const listeners = new Set<Listener>();

function readFromStorage(): Set<string> {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(s => typeof s === 'string')) {
      return new Set(parsed);
    }
  } catch { /* ignore */ }
  return new Set();
}

let currentFavorites: Set<string> = readFromStorage();
let hasHydrated = false;

const EMPTY_SET: Set<string> = new Set();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: Listener) {
  if (!hasHydrated) {
    hasHydrated = true;
    currentFavorites = readFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e: StorageEvent) => {
        if (e.key !== STORAGE_KEY) return;
        currentFavorites = readFromStorage();
        emit();
      });
    }
  }
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function getSnapshot(): Set<string> {
  return currentFavorites;
}

function getServerSnapshot(): Set<string> {
  return EMPTY_SET;
}

function toggleFavorite(id: string) {
  const next = new Set(currentFavorites);
  next.has(id) ? next.delete(id) : next.add(id);
  currentFavorites = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch { /* private browsing */ }
  emit();
}

export function useFavorites(): [Set<string>, (id: string) => void] {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [favorites, toggleFavorite];
}
