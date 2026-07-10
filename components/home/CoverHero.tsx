'use client';

import Image from 'next/image';
import { currentCover, coverMonthYear } from '@/data/covers';
import { useRecipes } from '@/hooks/useRecipes';
import type { PantryEntry } from '@/data/pantry';
import CoverTableCard from './CoverTableCard';
import CoverRail from './CoverRail';

const BLUR_PLACEHOLDER =
  'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAABwAQCdASoEAAMAA4BaJZgCdAFAAAD+4IMuyfRjna8O7m69a2dq2PrsAAA=';

const STAGE_HEIGHTS =
  'h-[clamp(22rem,62svh,32rem)] min-[860px]:h-[clamp(32rem,calc(100svh-8.5rem),46rem)]';

/**
 * Skyline + nameplate + tagline. On the photo it sits in locked cream over
 * the top scrim; in the no-recipes fallback it sits on parchment in theme ink.
 */
function CoverHead({ onPhoto, monthYear }: { onPhoto: boolean; monthYear: string }) {
  const ink = onPhoto ? 'text-[#F0EADA]' : 'text-brown-dark';
  const rule = onPhoto ? 'bg-[#F0EADA]/40' : 'bg-brown-light/40';
  const apostrophe = onPhoto ? 'text-[#CE6B39]' : 'text-terracotta';
  return (
    <div className={`text-center ${ink}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <span className={`h-px flex-1 ${rule}`} aria-hidden="true" />
        <span className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em]">
          Est. MMXXVI · {monthYear}
        </span>
        <span className={`h-px flex-1 ${rule}`} aria-hidden="true" />
      </div>
      <h1 className="mt-5 font-heading font-bold tracking-tight leading-[1.02] text-[clamp(2.7rem,5.8vw,5rem)]">
        Nieves<span className={apostrophe}>&#39;</span> Kitchen
      </h1>
      <p className={`mt-3 font-heading italic text-base sm:text-lg ${onPhoto ? 'text-[#F0EADA]/90' : 'text-brown-medium'}`}>
        A well-travelled table, cooked with care
      </p>
    </div>
  );
}

/**
 * The home cover (approved variant E, "the card on the table"): a dominant
 * photo stage for the rotating cover recipe, the table card laid on it, and
 * the utility rail beside it. Renders inside a max-w-[84rem] container.
 *
 * `imageOverride` exists for the /dev/home-cover sandbox only (candidate
 * cover photos are auditioned there before the recipe row's image_url is
 * updated); production always renders the cover recipe's own image.
 */
export default function CoverHero({
  pantryEntries,
  imageOverride,
}: {
  pantryEntries: PantryEntry[];
  imageOverride?: string;
}) {
  const { data: recipes = [], isLoading } = useRecipes();
  const cover = currentCover();
  const monthYear = coverMonthYear(cover);

  const sorted = [...recipes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const coverRecipe = recipes.find((r) => r.id === cover.recipe) ?? sorted[0];
  const moreToCook = coverRecipe
    ? sorted.filter((r) => r.id !== coverRecipe.id).slice(0, 2)
    : [];

  if (isLoading) {
    return (
      <section aria-busy="true" className="grid gap-[1.6rem] min-[860px]:grid-cols-[3.5fr_1fr]">
        <div className={`${STAGE_HEIGHTS} rounded-2xl bg-parchment-dark animate-pulse`} />
        <div className="space-y-5 py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2.5">
              <div className="h-3 bg-parchment-dark rounded w-2/5 animate-pulse" />
              <div className="h-4 bg-parchment-dark rounded w-4/5 animate-pulse" />
              <div className="h-4 bg-parchment-dark rounded w-3/5 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!coverRecipe) {
    // No recipes at all: the head block on parchment; departments that need
    // recipes render nothing further down.
    return (
      <section className="py-14 sm:py-20">
        <CoverHead onPhoto={false} monthYear={monthYear} />
      </section>
    );
  }

  return (
    <section aria-labelledby="cover-nameplate" className="grid gap-[1.6rem] min-[860px]:grid-cols-[3.5fr_1fr]">
      {/* Photo stage + table card */}
      <div className="relative">
        <div className={`relative ${STAGE_HEIGHTS} rounded-2xl overflow-hidden bg-parchment-dark`}>
          <Image
            src={imageOverride ?? coverRecipe.image}
            alt={coverRecipe.name}
            fill
            priority
            sizes="(max-width: 860px) 100vw, 75vw"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            className="object-cover"
          />
          {/* Top scrim only: nothing textual sits on the lower photo. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[46%]"
            style={{
              background:
                'linear-gradient(to bottom, color-mix(in srgb, var(--color-scrim) 58%, transparent), transparent)',
            }}
          />
          <div id="cover-nameplate" className="pointer-events-none absolute inset-x-0 top-0 px-6 pt-7 sm:pt-10">
            <CoverHead onPhoto monthYear={monthYear} />
          </div>
        </div>
        <CoverTableCard recipe={coverRecipe} monthYear={monthYear} />
      </div>

      {/* Utility rail */}
      <CoverRail moreToCook={moreToCook} pantryEntries={pantryEntries} />
    </section>
  );
}
