'use client';

import { useState, useEffect, useCallback } from 'react';

export type UnitSystem = 'us' | 'metric';

const STORAGE_KEY = 'nieves-unit-pref';

export function useUnitPref() {
  const [unit, setUnit] = useState<UnitSystem>('us');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'us' || stored === 'metric') setUnit(stored);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setUnit((prev) => {
      const next: UnitSystem = prev === 'us' ? 'metric' : 'us';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { unit, toggle };
}
