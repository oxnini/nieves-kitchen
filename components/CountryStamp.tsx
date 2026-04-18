'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Stamp, ChevronDown } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';
import PassportRecipeCard from './PassportRecipeCard';

interface Props {
  country: string;
  stamps: StampRow[];
  recipesInCountry: Recipe[];
  cookedRecipes: Recipe[];
}

export default function CountryStamp({ country, stamps, recipesInCountry, cookedRecipes }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isCooked = stamps.length > 0;

  const stampsByRecipe = new Map<string, StampRow[]>();
  for (const s of stamps) {
    const arr = stampsByRecipe.get(s.recipe_slug) ?? [];
    arr.push(s);
    stampsByRecipe.set(s.recipe_slug, arr);
  }

  const firstCooked = stamps[0]?.cooked_at;
  const dateLabel = firstCooked
    ? new Date(firstCooked).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : null;

  const remaining = recipesInCountry.length - cookedRecipes.length;

  if (!isCooked) {
    return (
      <Link
        href="/recipes"
        className="group flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-brown-light/50 bg-parchment-dark/30 text-brown-medium hover:border-terracotta hover:bg-parchment-dark/60 transition-colors p-3 text-center"
      >
        <Stamp size={20} className="opacity-40 group-hover:opacity-70 mb-1" />
        <div className="text-xs font-medium line-clamp-2">{country}</div>
        <div className="text-[10px] mt-0.5 text-brown-medium/70">Unclaimed</div>
      </Link>
    );
  }

  return (
    <div className="col-span-1">
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-label={`${country}: ${stamps.length} cooked. Click to ${expanded ? 'collapse' : 'expand'} recipe cards`}
        className="w-full aspect-square rounded-2xl bg-gradient-to-br from-turmeric to-terracotta-light shadow-md hover:shadow-lg transition-shadow p-3 flex flex-col items-center justify-center text-brown-dark relative overflow-hidden"
      >
        <Stamp size={22} className="mb-1" />
        <div className="text-sm font-semibold font-heading line-clamp-2 text-center leading-tight">
          {country}
        </div>
        {dateLabel && (
          <div className="text-[10px] mt-1 text-brown-dark/70">{dateLabel}</div>
        )}
        <div className="absolute top-1.5 right-1.5 bg-brown-dark/80 text-parchment text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
          {stamps.length}
        </div>
        <ChevronDown
          size={14}
          className={`absolute bottom-1.5 right-1.5 text-brown-dark/60 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden col-span-full"
          >
            <div className="flex gap-3 overflow-x-auto pt-3 pb-1 -mx-1 px-1">
              {cookedRecipes.map(recipe => (
                <PassportRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  stamps={stampsByRecipe.get(recipe.id) ?? []}
                />
              ))}
              {remaining > 0 && (
                <Link
                  href="/recipes"
                  className="shrink-0 w-40 flex items-center justify-center rounded-xl border-2 border-dashed border-brown-light/50 text-sm text-brown-medium hover:border-terracotta hover:text-terracotta transition-colors text-center px-3"
                >
                  {remaining} more from {country} to try →
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
