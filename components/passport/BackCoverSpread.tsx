'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { PassportSummary, Stamp as StampRow } from '@/lib/passport';
import { useRecipes } from '@/hooks/useRecipes';
import {
  recommendNextRecipes,
  type Recommendation,
} from '@/lib/passport-recommend';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Props {
  summary: PassportSummary;
}

export default function BackCoverSpread({ summary }: Props) {
  const mobile = useIsMobile();
  const { data: recipes = [] } = useRecipes();
  const recs = useMemo(
    () => recommendNextRecipes(recipes, summary, 3),
    [recipes, summary],
  );
  const hasStamps = summary.totalStamps > 0;
  const topRegion = useMemo(
    () => computeTopRegion(summary.stampsPerCountry, recipes),
    [summary.stampsPerCountry, recipes],
  );

  return (
    <div
      className={mobile ? 'flex flex-col w-full' : 'grid h-full w-full'}
      style={mobile ? undefined : { gridTemplateColumns: '1fr 1fr' }}
    >
      <div className={`${mobile ? '' : 'h-full'} w-full flex flex-col p-[var(--stamp-gap)]`}>
        <JourneyRecap summary={summary} hasStamps={hasStamps} topRegion={topRegion} />
      </div>
      <div className={`${mobile ? '' : 'h-full'} w-full flex flex-col p-[var(--stamp-gap)]`}>
        <NextChapter recs={recs} hasStamps={hasStamps} />
      </div>
    </div>
  );
}

function JourneyRecap({
  summary, hasStamps, topRegion,
}: {
  summary: PassportSummary;
  hasStamps: boolean;
  topRegion: { region: string; count: number } | null;
}) {
  const { title, nextTier, stampsPerCountry, totalStamps, uniqueCountries, regionsTouched } = summary;

  const flat = useMemo(() => flattenStamps(stampsPerCountry), [stampsPerCountry]);
  const first = flat[0];
  const latest = flat[flat.length - 1];

  return (
    <div className="flex flex-col min-h-0">
      <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
        Your journey
      </div>
      <h2 className="font-heading text-3xl font-bold text-brown-dark mb-5 leading-tight">
        {title}
      </h2>

      {!hasStamps ? (
        <p className="text-sm text-brown-dark font-body leading-relaxed mb-4">
          Your passport is blank. The journey starts with a single recipe.
        </p>
      ) : (
        <ul className="space-y-1.5 mb-4">
          {first && (
            <RecapRow
              label="First stamp"
              value={`${first.country} \u00b7 ${formatDay(first.cooked_at)}`}
            />
          )}
          {latest && first && latest.cooked_at !== first.cooked_at && (
            <RecapRow
              label="Most recent"
              value={`${latest.country} \u00b7 ${formatDay(latest.cooked_at)}`}
            />
          )}
          {topRegion && (
            <RecapRow
              label="Top region"
              value={`${topRegion.region} \u00b7 ${topRegion.count}`}
            />
          )}
          <RecapRow
            label="Reach"
            value={`${uniqueCountries.size} ${uniqueCountries.size === 1 ? 'country' : 'countries'} \u00b7 ${regionsTouched.size} ${regionsTouched.size === 1 ? 'region' : 'regions'}`}
          />
          {totalStamps > 0 && (
            <RecapRow
              label="Stamps"
              value={`${totalStamps}`}
            />
          )}
        </ul>
      )}

      {nextTier ? (
        <div className="text-sm text-brown-medium font-body">
          <span className="font-semibold text-brown-dark">
            {progressToNextTier(totalStamps, regionsTouched.size, nextTier.minStamps, nextTier.minRegions)}
          </span>{' '}
          from <span className="font-semibold text-brown-dark">{nextTier.title}</span>.
        </div>
      ) : (
        <div className="text-sm text-brown-medium font-body">
          You&apos;ve reached the highest title. The world is yours.
        </div>
      )}
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
      ? 'You\u2019ve cooked nearly everything. Revisit a favorite.'
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
              href={`/recipes/${recipe.id}`}
              className="block rounded-xl bg-brown-dark/5 hover:bg-brown-dark/10 transition-colors p-3 border border-brown-light/30"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-brown-medium font-body mb-1">
                {recipe.country} {'\u00b7'} {recipe.region}
              </div>
              <div className="font-heading text-base font-bold text-brown-dark leading-snug">
                {recipe.name}
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

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-dotted border-brown-light/50 pb-1.5">
      <span className="text-xs uppercase tracking-wider text-brown-medium font-body">
        {label}
      </span>
      <span className="font-heading text-sm text-brown-dark text-right">
        {value}
      </span>
    </li>
  );
}

function flattenStamps(
  stampsPerCountry: Map<string, StampRow[]>,
): Array<{ country: string; cooked_at: string }> {
  const flat: Array<{ country: string; cooked_at: string }> = [];
  for (const [country, stamps] of stampsPerCountry) {
    for (const s of stamps) flat.push({ country, cooked_at: s.cooked_at });
  }
  flat.sort((a, b) => a.cooked_at.localeCompare(b.cooked_at));
  return flat;
}

function computeTopRegion(
  stampsPerCountry: Map<string, StampRow[]>,
  recipes: { country: string; region: string }[],
): { region: string; count: number } | null {
  const countryToRegion = new Map<string, string>();
  for (const r of recipes) {
    if (!countryToRegion.has(r.country)) {
      countryToRegion.set(r.country, r.region);
    }
  }
  const totals = new Map<string, number>();
  for (const [country, stamps] of stampsPerCountry) {
    const region = countryToRegion.get(country);
    if (!region) continue;
    totals.set(region, (totals.get(region) ?? 0) + stamps.length);
  }
  let best: { region: string; count: number } | null = null;
  for (const [region, count] of totals) {
    if (!best || count > best.count) best = { region, count };
  }
  return best;
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const sameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (sameDay) return 'today';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function progressToNextTier(
  stamps: number,
  regions: number,
  minStamps: number,
  minRegions: number,
): string {
  const s = Math.max(0, minStamps - stamps);
  const r = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (s > 0) parts.push(`${s} stamp${s === 1 ? '' : 's'}`);
  if (r > 0) parts.push(`${r} region${r === 1 ? '' : 's'}`);
  return parts.length ? `${parts.join(' and ')}` : 'one cook';
}
