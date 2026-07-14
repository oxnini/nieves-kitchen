'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow, TilePattern } from '@/components/courtyard';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

/**
 * "This week" mosaic (Courtyard "1A"). An editorial asymmetric grid: one big
 * feature card with a cobalt caption panel, a couple of small cards, and a
 * terracotta "browse them all" block. Wired to useRecipes and degrades
 * gracefully with the handful of real dishes available.
 */

function formatTime(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function place(r: Recipe): string {
  return r.country ?? r.region ?? 'Somewhere';
}

function blurb(r: Recipe): string {
  return r.description ?? r.quote;
}

function MosaicFeature({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-cream shadow-[0_0_0_1.5px_rgba(32,64,107,0.13),0_16px_32px_-24px_rgba(22,50,79,0.5)] transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream-deep lg:aspect-auto lg:flex-1">
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="relative bg-cobalt px-6 py-5 text-cream">
        <Eyebrow tone="brass">
          {place(recipe)} · {formatTime(recipe.time.total)}
        </Eyebrow>
        <h3 className="mt-1.5 font-heading text-[24px] font-normal leading-tight text-cream">{recipe.name}</h3>
        <p className="mt-2 line-clamp-2 font-body text-[14px] leading-normal text-cream/80">{blurb(recipe)}</p>
      </div>
    </Link>
  );
}

function MosaicCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-cream shadow-[0_0_0_1.5px_rgba(32,64,107,0.13),0_16px_32px_-24px_rgba(22,50,79,0.5)] transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-deep">
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-4 py-3.5">
        <Eyebrow tone="olive">
          {place(recipe)} · {formatTime(recipe.time.total)}
        </Eyebrow>
        <h3 className="mt-1 font-heading text-[19px] font-normal leading-snug text-cobalt">{recipe.name}</h3>
      </div>
    </Link>
  );
}

function AccentBlock({ count }: { count: number }) {
  return (
    <Link
      href="/recipes"
      className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl bg-terracotta px-6 py-6 text-cream shadow-[0_16px_32px_-24px_rgba(22,50,79,0.5)] transition-transform duration-200 hover:-translate-y-1"
    >
      <TilePattern line="var(--color-cream)" opacity={0.14} />
      <div className="relative">
        <Eyebrow tone="cream">The whole kitchen</Eyebrow>
        <h3 className="mt-1 font-heading text-[22px] font-normal leading-tight text-cream">Browse them all</h3>
      </div>
      <span className="relative shrink-0 font-body text-[14px] font-bold text-cream/90">
        {count} {count === 1 ? 'recipe' : 'recipes'} &rarr;
      </span>
    </Link>
  );
}

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse overflow-hidden rounded-xl bg-cream shadow-[0_0_0_1.5px_rgba(32,64,107,0.13)] ${className}`}>
      <div className="aspect-[4/3] w-full bg-cream-deep" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/2 rounded bg-cream-deep" />
        <div className="h-4 w-3/4 rounded bg-cream-deep" />
      </div>
    </div>
  );
}

export default function ThisWeek() {
  const { data: recipes = [], isLoading } = useRecipes();
  const latest = useMemo(
    () => [...recipes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [recipes],
  );

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10" aria-busy="true">
        <Eyebrow tone="terracotta">Fresh from the kitchen</Eyebrow>
        <h2 className="mt-2 font-heading text-[clamp(1.7rem,4vw,2.4rem)] font-normal leading-tight text-cobalt">This week</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <SkeletonCard className="lg:col-span-2 lg:row-span-2" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  if (latest.length === 0) return null;

  const feature = latest[0];
  const smalls = latest.slice(1, 3);

  return (
    <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10" aria-labelledby="this-week-heading">
      <Eyebrow tone="terracotta">Fresh from the kitchen</Eyebrow>
      <h2 id="this-week-heading" className="mt-2 font-heading text-[clamp(1.7rem,4vw,2.4rem)] font-normal leading-tight text-cobalt">
        This week
      </h2>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 lg:row-span-2">
          <MosaicFeature recipe={feature} />
        </div>
        {smalls.map((r) => (
          <MosaicCard key={r.id} recipe={r} />
        ))}
        <div className="lg:col-span-3">
          <AccentBlock count={recipes.length} />
        </div>
      </div>
    </section>
  );
}
