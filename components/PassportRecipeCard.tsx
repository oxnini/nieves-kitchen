'use client';

import Link from 'next/link';
import type { Recipe } from '@/lib/types';
import type { Stamp } from '@/lib/passport';

interface Props {
  recipe: Recipe;
  stamps: Stamp[];
}

export default function PassportRecipeCard({ recipe, stamps }: Props) {
  const cookCount = stamps.length;
  const firstCooked = stamps[0]?.cooked_at;
  const dateLabel = firstCooked
    ? new Date(firstCooked).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group shrink-0 w-40 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="h-24 w-full overflow-hidden bg-parchment-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <div className="text-sm font-medium text-brown-dark line-clamp-2 leading-snug">
          {recipe.name}
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-brown-medium">
          {dateLabel && <span>{dateLabel}</span>}
          {cookCount > 1 && (
            <span className="font-semibold text-terracotta">✦ {cookCount}×</span>
          )}
        </div>
      </div>
    </Link>
  );
}
