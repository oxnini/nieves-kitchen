'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { currentSpread } from '@/data/table-spreads';
import { PROTEIN_CHIP_THRESHOLD } from '@/lib/collections';
import type { Recipe } from '@/lib/types';

const BLUR_PLACEHOLDER =
  'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAABwAQCdASoEAAMAA4BaJZgCdAFAAAD+4IMuyfRjna8O7m69a2dq2PrsAAA=';

interface Props {
  recipes: Recipe[];
  isLoading: boolean;
}

/** Cutive Mono annotation line under a dish title: time, and protein when it earns the chip. */
function MarginAnnotation({ recipe }: { recipe: Recipe }) {
  return (
    <p className="font-stamp text-[11px] uppercase tracking-[0.18em] text-brown-medium nums-tabular flex items-center gap-3">
      <span className="flex items-center gap-1">
        <Clock size={12} aria-hidden="true" />
        {recipe.time.total}m
      </span>
      {recipe.nutrition.protein >= PROTEIN_CHIP_THRESHOLD && (
        <span>{recipe.nutrition.protein}g protein</span>
      )}
    </p>
  );
}

export default function TableSpreadHero({ recipes, isLoading }: Props) {
  const spread = currentSpread();
  const main = recipes.find((r) => r.id === spread.main);
  const sides = spread.sides
    .map((slug) => recipes.find((r) => r.id === slug))
    .filter((r): r is Recipe => r !== undefined);

  if (isLoading) {
    return (
      <section aria-busy="true" className="grid lg:grid-cols-[3fr_2fr] gap-6">
        <div className="h-80 sm:h-[26rem] bg-parchment-dark rounded-2xl animate-pulse" />
        <div className="space-y-4 py-4">
          <div className="h-4 bg-parchment-dark rounded w-1/3 animate-pulse" />
          <div className="h-10 bg-parchment-dark rounded w-4/5 animate-pulse" />
          <div className="h-4 bg-parchment-dark rounded w-2/3 animate-pulse" />
        </div>
      </section>
    );
  }
  if (!main) return null;

  return (
    <section aria-labelledby="table-spread-heading">
      <div className="grid lg:grid-cols-[3fr_2fr] gap-6 lg:gap-10 items-stretch">
        {/* Centerpiece */}
        <Link
          href={`/recipes/${encodeURIComponent(main.id)}`}
          className="relative block h-80 sm:h-[26rem] rounded-2xl overflow-hidden bg-parchment-dark group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <Image
            src={main.image}
            alt={main.name}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 60vw"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </Link>

        {/* Editorial column */}
        <div className="flex flex-col justify-center py-2">
          <div className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80">
            {spread.title}
          </div>
          <h2 id="table-spread-heading" className="mt-2.5 font-heading text-3xl sm:text-4xl font-bold text-brown-dark tracking-tight leading-tight">
            <Link
              href={`/recipes/${encodeURIComponent(main.id)}`}
              className="hover:text-terracotta transition-colors"
            >
              {main.name}
            </Link>
          </h2>
          <div className="mt-2.5">
            <MarginAnnotation recipe={main} />
          </div>
          {main.quote && (
            <p className="mt-4 max-w-[46ch] font-heading italic text-lg text-brown-medium leading-relaxed">
              {main.quote}
            </p>
          )}
          {spread.note && (
            <p className="mt-3 max-w-[46ch] text-sm text-brown-medium leading-relaxed">
              {spread.note}
            </p>
          )}

          {/* Sides: real ones, or one honest pencilled-in slot */}
          <div className="mt-6 space-y-3">
            {sides.map((side) => (
              <Link
                key={side.id}
                href={`/recipes/${encodeURIComponent(side.id)}`}
                className="flex items-center gap-4 rounded-xl border border-brown-light/25 bg-surface p-3 hover:border-terracotta/40 hover:shadow-sm transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                <span className="relative w-14 h-14 rounded-lg overflow-hidden bg-parchment-dark shrink-0">
                  <Image
                    src={side.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block font-heading font-semibold text-brown-dark leading-tight truncate">
                    {side.name}
                  </span>
                  <MarginAnnotation recipe={side} />
                </span>
              </Link>
            ))}
            {sides.length === 0 && (
              <div className="rounded-xl border border-dashed border-brown-light/40 p-3.5">
                <p className="font-stamp text-[11px] uppercase tracking-[0.22em] text-brown-medium/80">
                  Coming to the table
                </p>
                <p className="mt-1 text-sm text-brown-medium italic">
                  Sides to mix and match, one jar at a time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
