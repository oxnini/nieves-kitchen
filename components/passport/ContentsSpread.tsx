'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CULINARY_REGION_ORDER, type CulinaryRegion, type Recipe } from '@/lib/types';
import type { PassportSummary } from '@/lib/passport';
import {
  recommendNextRecipes,
  type Recommendation,
} from '@/lib/passport-recommend';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import { useIsMobile } from '@/hooks/useIsMobile';

const BLUR_PLACEHOLDER =
  'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAABwAQCdASoEAAMAA4BaJZgCdAFAAAD+4IMuyfRjna8O7m69a2dq2PrsAAA=';

const DUMMY_PALETTE = ['#E8C4A8', '#D4A574', '#C68B4F', '#B89668', '#A07A5C', '#8B6E4E'];

function dummyImageUrl(country: string): string {
  const hash = country.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const bg = DUMMY_PALETTE[hash % DUMMY_PALETTE.length];
  const initial = (country.trim().charAt(0) || '?').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="${bg}"/><text x="60" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="60" font-weight="600" fill="#FDF6EC" opacity="0.55">${initial}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface Props {
  summary: PassportSummary;
  spreads: SpreadDescriptor[];
  recipes: Recipe[];
  onJumpToSpread: (spreadIndex: number) => void;
}

export default function ContentsSpread({
  summary, spreads, recipes, onJumpToSpread,
}: Props) {
  const mobile = useIsMobile();

  const { primaryIndexByRegion, cookedByRegion } = useMemo(() => {
    const primary = new Map<CulinaryRegion, number>();
    const cooked = new Map<CulinaryRegion, number>();
    for (const region of CULINARY_REGION_ORDER) cooked.set(region, 0);
    spreads.forEach((s, idx) => {
      if (s.kind !== 'region') return;
      if (s.continuationIndex === 0 && !primary.has(s.region)) {
        primary.set(s.region, idx);
      }
      const n = s.leftCountries.length + s.rightCountries.length;
      cooked.set(s.region, (cooked.get(s.region) ?? 0) + n);
    });
    return { primaryIndexByRegion: primary, cookedByRegion: cooked };
  }, [spreads]);

  const recs = useMemo(
    () => recommendNextRecipes(recipes, summary, 3),
    [recipes, summary],
  );
  const hasStamps = summary.totalStamps > 0;

  return (
    <div
      className={mobile ? 'flex flex-col w-full' : 'grid h-full w-full'}
      style={mobile ? {
        padding: 'var(--stamp-gap)',
        gap: 'calc(var(--stamp-size) * 0.25)',
      } : {
        gridTemplateColumns: '1fr 1fr',
        padding: 'calc(var(--stamp-size) * 0.35)',
        columnGap: 'calc(var(--stamp-size) * 0.6)',
      }}
    >
      <div className="flex flex-col min-h-0">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Contents
        </div>
        <ul className="space-y-1.5 overflow-y-auto pr-1">
          {CULINARY_REGION_ORDER.map(region => {
            const cooked = cookedByRegion.get(region) ?? 0;
            const idx = primaryIndexByRegion.get(region);
            return (
              <li key={region}>
                <button
                  type="button"
                  onClick={() => { if (idx !== undefined) onJumpToSpread(idx); }}
                  className="group w-full flex items-baseline justify-between gap-3 py-1.5 border-b border-dotted border-brown-light/50 hover:border-terracotta/40 text-left cursor-pointer transition-colors duration-150"
                >
                  <span className="font-heading text-sm text-brown-dark truncate group-hover:text-terracotta transition-colors duration-150">
                    {region}
                  </span>
                  <span className="flex items-baseline gap-1.5 font-body text-xs text-brown-medium whitespace-nowrap">
                    {cooked} cooked
                    <span className="text-brown-light/60 group-hover:text-terracotta/80 transition-colors duration-150" aria-hidden>
                      &rsaquo;
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col min-h-0">
        <NextChapter recs={recs} hasStamps={hasStamps} />
      </div>
    </div>
  );
}

function NextChapter({
  recs, hasStamps,
}: { recs: Recommendation[]; hasStamps: boolean }) {
  const allRevisit = recs.length > 0 && recs.every(r => r.reason === 'revisit');
  const label = !hasStamps
    ? 'Start here'
    : allRevisit
      ? 'Keep exploring'
      : 'Next chapter';
  const intro = !hasStamps
    ? 'Three places to start your passport.'
    : allRevisit
      ? 'You’ve cooked nearly everything. Revisit a favorite.'
      : 'Three places to cook toward your next tier.';

  return (
    <div className="flex flex-col min-h-0">
      <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
        {label}
      </div>
      <p className="text-sm text-brown-dark font-body mb-4 leading-snug">
        {intro}
      </p>

      <ul className="space-y-3 flex-1">
        {recs.map(({ recipe }) => (
          <li key={recipe.id}>
            <Link
              href={`/recipes/${encodeURIComponent(recipe.id)}`}
              className="flex items-stretch gap-3 rounded-xl bg-brown-dark/5 hover:bg-brown-dark/10 transition-colors p-3 border border-brown-light/30 min-h-[7rem]"
            >
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="text-[9px] uppercase tracking-[0.2em] text-brown-medium/80 font-body leading-tight">
                  {recipe.region}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="font-heading text-sm text-brown-medium leading-tight mb-0.5">
                    {recipe.country}
                  </div>
                  <div className="font-heading text-base font-bold text-brown-dark leading-snug">
                    {recipe.name}
                  </div>
                </div>
              </div>
              <div className="relative aspect-square h-full flex-shrink-0 rounded-lg overflow-hidden bg-parchment-dark">
                <Image
                  src={dummyImageUrl(recipe.country)}
                  alt=""
                  fill
                  sizes="120px"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  unoptimized
                  className="object-cover"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/recipes"
        className="mt-4 inline-block self-start text-sm text-brown-medium hover:text-terracotta font-body"
      >
        Browse all recipes &rarr;
      </Link>
    </div>
  );
}
