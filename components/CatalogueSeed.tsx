'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { recipesQueryKey } from '@/hooks/queryKeys';
import type { Recipe } from '@/lib/types';

/**
 * Puts the server's copy of the catalogue into the `useRecipes` cache during
 * this render, so everything below it renders with recipes on the server and
 * on the first client render alike (audit F5).
 *
 * Not React Query's HydrationBoundary: the Navbar (useJournalPrefetch →
 * useCookedStamps → useRecipes) has already created the recipes query by the
 * time a page renders, and HydrationBoundary hydrates an existing query in an
 * effect, which never runs on the server. Here an empty query is filled in
 * render; one that already holds data (a client navigation) is left alone.
 */
export default function CatalogueSeed({
  recipes,
  fetchedAt,
  children,
}: {
  recipes: Recipe[];
  fetchedAt: number;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  // Once per mount, before the children render.
  useState(() => {
    const key = recipesQueryKey('live');
    if (queryClient.getQueryState(key)?.dataUpdatedAt) return;
    // Stamped with the server's fetch time, so a stale copy (an old static
    // page) still refetches on mount like any other stale query.
    queryClient.setQueryData(key, recipes, { updatedAt: fetchedAt });
  });
  return children;
}
