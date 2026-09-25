'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookedStamps } from '@/hooks/useCookedStamps';

/**
 * "Cook something new" — the three newest recipes, newest first, under a
 * plain heading and a "Browse all N recipes" link. Replaces the old
 * ThisWeek mosaic (spec 2026-09-25 §6.2). RecipeCard keeps its current look
 * until phase 4 restyles it.
 */
export default function CookSomethingNew() {
  const { data: recipes = [], isLoading } = useRecipes();
  const [favorites] = useFavorites();
  const { summary: passportSummary } = useCookedStamps();
  const cookedRecipeSlugs = useMemo(() => {
    const slugs = new Set<string>();
    for (const stamps of passportSummary.stampsPerCountry.values()) {
      for (const stamp of stamps) slugs.add(stamp.recipe_slug);
    }
    return slugs;
  }, [passportSummary.stampsPerCountry]);

  const latest = useMemo(
    () => [...recipes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [recipes],
  );
  const countryCount = useMemo(
    () => new Set(recipes.map((r) => r.country).filter((c): c is string => Boolean(c))).size,
    [recipes],
  );

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1160px] px-4 sm:px-10 py-14 sm:py-20" aria-busy="true">
        <h2 className="font-heading font-normal text-[clamp(2rem,3.4vw,2.8rem)] leading-tight text-brown-dark">
          Cook something new
        </h2>
        <div className="mt-8 grid gap-x-7 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-[3/2] bg-parchment-dark animate-pulse rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (latest.length === 0) return null;

  const featured = latest.slice(0, 3);
  const recipeNoun = recipes.length === 1 ? 'recipe' : 'recipes';
  const countryNoun = countryCount === 1 ? 'country' : 'countries';

  return (
    <section className="mx-auto max-w-[1160px] px-4 sm:px-10 py-14 sm:py-20" aria-labelledby="cook-something-new-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-6">
        <div>
          <h2
            id="cook-something-new-heading"
            className="font-heading font-normal text-[clamp(2rem,3.4vw,2.8rem)] leading-tight text-brown-dark"
          >
            Cook something new
          </h2>
          <p className="mt-2 max-w-[56ch] font-body text-[16px] leading-relaxed text-brown-medium">
            {recipes.length} {recipeNoun} from {countryCount} {countryNoun}.
          </p>
        </div>
        <Link href="/recipes" className="font-body text-[15px] font-semibold text-teal shrink-0">
          Browse all {recipes.length} recipes
        </Link>
      </div>

      <div className="mt-8 grid gap-x-7 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorited={favorites.has(recipe.id)}
            isCooked={cookedRecipeSlugs.has(recipe.id)}
          />
        ))}
      </div>
    </section>
  );
}
