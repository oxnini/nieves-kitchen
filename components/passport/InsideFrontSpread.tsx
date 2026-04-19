'use client';

import { CULINARY_REGION_ORDER, type CulinaryRegion } from '@/lib/types';
import type { PassportSummary, Stamp as StampRow } from '@/lib/passport';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';

interface Props {
  summary: PassportSummary;
  spreads: SpreadDescriptor[];
  stampsPerCountry: Map<string, StampRow[]>;
  onJumpToSpread: (spreadIndex: number) => void;
}

export default function InsideFrontSpread({
  summary, spreads, onJumpToSpread, stampsPerCountry,
}: Props) {
  const { totalStamps, uniqueCountries, regionsTouched, title, nextTier } = summary;

  // For each top-level region, find the spread index of its primary (continuationIndex 0) spread.
  const primaryIndexByRegion = new Map<CulinaryRegion, number>();
  spreads.forEach((s, idx) => {
    if (s.kind === 'region' && s.continuationIndex === 0) {
      if (!primaryIndexByRegion.has(s.region)) {
        primaryIndexByRegion.set(s.region, idx);
      }
    }
  });

  // Count cooked countries per region from summary.stampsPerCountry.
  // We re-derive the country → region lookup via each spread's countries lists.
  const cookedByRegion = new Map<CulinaryRegion, number>();
  for (const region of CULINARY_REGION_ORDER) cookedByRegion.set(region, 0);
  for (const s of spreads) {
    if (s.kind !== 'region') continue;
    const n = s.leftCountries.length + s.rightCountries.length;
    cookedByRegion.set(s.region, (cookedByRegion.get(s.region) ?? 0) + n);
  }

  // stampsPerCountry is kept in props for interface stability but not used directly here.
  void stampsPerCountry;

  return (
    <div
      className="grid h-full w-full"
      style={{
        gridTemplateColumns: '1fr 1fr',
        padding: 'calc(var(--stamp-size) * 0.35)',
        columnGap: 'calc(var(--stamp-size) * 0.6)',
      }}
    >
      <div className="flex flex-col">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Traveler profile
        </div>
        <h2 className="font-heading text-3xl font-bold text-brown-dark mb-4">
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Stamps" value={totalStamps} />
          <Stat label="Countries" value={uniqueCountries.size} />
          <Stat label="Regions" value={regionsTouched.size} />
        </div>
        {nextTier ? (
          <div className="text-sm text-brown-medium font-body">
            Next: <span className="font-semibold text-brown-dark">{nextTier.title}</span> —{' '}
            <ProgressHint
              stamps={totalStamps}
              regions={regionsTouched.size}
              minStamps={nextTier.minStamps}
              minRegions={nextTier.minRegions}
            />
          </div>
        ) : (
          <div className="text-sm text-brown-medium font-body">
            You&apos;ve reached the highest title. The world is yours.
          </div>
        )}
        <div className="mt-6">
          <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
            How this works
          </div>
          <ol className="space-y-3">
            <OnboardStep numeral={1} text="Cook a recipe from anywhere in the app." />
            <OnboardStep numeral={2} text="Earn a dated country stamp." />
            <OnboardStep numeral={3} text="Fill your passport, unlock traveler titles." />
          </ol>
        </div>
      </div>

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
                  className="w-full flex items-baseline justify-between gap-3 py-1.5 border-b border-dotted border-brown-light/50 hover:text-terracotta text-left"
                >
                  <span className="font-heading text-sm text-brown-dark truncate">
                    {region}
                  </span>
                  <span className="font-body text-xs text-brown-medium whitespace-nowrap">
                    {cooked} cooked
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
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

function ProgressHint({
  stamps, regions, minStamps, minRegions,
}: { stamps: number; regions: number; minStamps: number; minRegions: number }) {
  const s = Math.max(0, minStamps - stamps);
  const r = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (s > 0) parts.push(`${s} stamp${s === 1 ? '' : 's'}`);
  if (r > 0) parts.push(`${r} region${r === 1 ? '' : 's'}`);
  return <>{parts.length ? `${parts.join(' and ')} to go` : 'unlocked on next cook'}</>;
}

function OnboardStep({ numeral, text }: { numeral: number; text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-brown-dark font-body">
      <span
        aria-hidden
        className="flex-shrink-0 w-7 h-7 rounded-full border border-brown-medium/60 flex items-center justify-center font-heading text-sm text-brown-medium leading-none"
      >
        {numeral}
      </span>
      <span className="leading-snug pt-0.5">{text}</span>
    </li>
  );
}
