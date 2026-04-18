'use client';

import type { Recipe, CulinaryRegion } from '@/lib/types';
import type { Stamp } from '@/lib/passport';
import CountryStamp from './CountryStamp';

interface Props {
  region: CulinaryRegion;
  recipes: Recipe[];
  stampsPerCountry: Map<string, Stamp[]>;
}

export default function PassportRegionSection({ region, recipes, stampsPerCountry }: Props) {
  const countries = Array.from(new Set(recipes.map(r => r.country))).sort();

  const cookedCount = countries.filter(c => (stampsPerCountry.get(c)?.length ?? 0) > 0).length;

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <h2 className="font-heading text-2xl font-bold text-brown-dark">{region}</h2>
        <div className="text-sm text-brown-medium">
          <span className="font-semibold text-brown-dark">{cookedCount}</span> / {countries.length} cooked
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {countries.map(country => {
          const stamps = stampsPerCountry.get(country) ?? [];
          const recipesInCountry = recipes.filter(r => r.country === country);
          const cookedSlugs = new Set(stamps.map(s => s.recipe_slug));
          const cookedRecipes = recipesInCountry.filter(r => cookedSlugs.has(r.id));
          return (
            <CountryStamp
              key={country}
              country={country}
              stamps={stamps}
              recipesInCountry={recipesInCountry}
              cookedRecipes={cookedRecipes}
            />
          );
        })}
      </div>
    </section>
  );
}
