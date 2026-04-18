'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Stamp } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import PassportCover from '@/components/PassportCover';
import PassportRegionSection from '@/components/PassportRegionSection';
import type { CulinaryRegion, Recipe } from '@/lib/types';

export default function PassportPage() {
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  const { summary, isLoading: stampsLoading } = useCookedStamps();

  const recipesByRegion = useMemo(() => {
    const map = new Map<CulinaryRegion, Recipe[]>();
    for (const r of recipes) {
      const arr = map.get(r.region) ?? [];
      arr.push(r);
      map.set(r.region, arr);
    }
    return map;
  }, [recipes]);

  const sortedRegions = useMemo(
    () => Array.from(recipesByRegion.keys()).sort(),
    [recipesByRegion],
  );

  if (recipesLoading || stampsLoading) {
    return (
      <main className="min-h-screen bg-parchment py-10 px-4">
        <div className="max-w-5xl mx-auto text-brown-medium">Loading your passport…</div>
      </main>
    );
  }

  const hasStamps = summary.totalStamps > 0;

  return (
    <main className="min-h-screen bg-parchment py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <PassportCover summary={summary} />

        {!hasStamps && (
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-turmeric/20 text-terracotta mb-4">
              <Stamp size={24} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-brown-dark mb-2">
              Your passport is waiting
            </h2>
            <p className="text-brown-medium max-w-md mx-auto mb-6">
              Cook your first recipe and tap <span className="font-semibold text-brown-dark">&ldquo;I Cooked This&rdquo;</span> to earn your first stamp. Every new country is a new stamp; every new recipe from a visited country is a card in your collection.
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 bg-terracotta text-white px-5 py-3 rounded-xl font-medium shadow hover:bg-terracotta/90 transition-colors"
            >
              Browse recipes
            </Link>
          </div>
        )}

        {sortedRegions.map(region => (
          <PassportRegionSection
            key={region}
            region={region}
            recipes={recipesByRegion.get(region) ?? []}
            stampsPerCountry={summary.stampsPerCountry}
          />
        ))}
      </div>
    </main>
  );
}
