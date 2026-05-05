'use client';

import { useMemo } from 'react';
import type { Recipe } from '@/lib/types';
import { progressToNextTier, type PassportSummary, type Stamp as StampRow } from '@/lib/passport';
import { useIsMobile } from '@/hooks/useIsMobile';
import TierLedger from './TierLedger';

interface Props {
  summary: PassportSummary;
  recipes: Recipe[];
}

export default function InsideFrontSpread({ summary, recipes }: Props) {
  const mobile = useIsMobile();
  const { totalStamps, mealsCooked, uniqueCountries, regionsTouched, title, nextTier, stampsPerCountry } = summary;
  const hasStamps = totalStamps > 0;

  const flat = useMemo(() => flattenStamps(stampsPerCountry), [stampsPerCountry]);
  const first = flat[0];
  const latest = flat[flat.length - 1];
  const topRegion = useMemo(
    () => computeTopRegion(stampsPerCountry, recipes),
    [stampsPerCountry, recipes],
  );

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
          Traveler profile
        </div>
        <h2 className="font-heading text-3xl font-bold text-brown-dark mb-4">
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Meals" value={mealsCooked} />
          <Stat label="Countries" value={uniqueCountries.size} />
          <Stat label="Regions" value={regionsTouched.size} />
        </div>

        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Your journey
        </div>
        {!hasStamps ? (
          <p className="text-sm text-brown-dark font-body leading-relaxed mb-4">
            Your passport is blank. The journey starts with a single recipe.
          </p>
        ) : (
          <ul className="space-y-1.5 mb-4">
            {first && (
              <RecapRow
                label="First stamp"
                value={`${first.country} · ${formatDay(first.cooked_at)}`}
              />
            )}
            {latest && first && latest.cooked_at !== first.cooked_at && (
              <RecapRow
                label="Most recent"
                value={`${latest.country} · ${formatDay(latest.cooked_at)}`}
              />
            )}
            {topRegion && (
              <RecapRow
                label="Top region"
                value={`${topRegion.region} · ${topRegion.count}`}
              />
            )}
            <RecapRow
              label="Reach"
              value={`${uniqueCountries.size} ${uniqueCountries.size === 1 ? 'country' : 'countries'} · ${regionsTouched.size} ${regionsTouched.size === 1 ? 'region' : 'regions'}`}
            />
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

      <div className="flex flex-col min-h-0">
        <TierLedger currentTitle={title} totalStamps={totalStamps} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-brown-dark/5 rounded-xl px-3 py-2">
      <div className="font-heading text-2xl font-bold text-brown-dark leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-brown-medium mt-1 font-body">{label}</div>
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
