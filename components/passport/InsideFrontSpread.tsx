'use client';

import { useMemo } from 'react';
import { CULINARY_REGION_ORDER, type CulinaryRegion } from '@/lib/types';
import { progressToNextTier, type PassportSummary } from '@/lib/passport';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import { useIsMobile } from '@/hooks/useIsMobile';
import TierLedger from './TierLedger';

interface Props {
  summary: PassportSummary;
  spreads: SpreadDescriptor[];
  onJumpToSpread: (spreadIndex: number) => void;
}

export default function InsideFrontSpread({
  summary, spreads, onJumpToSpread,
}: Props) {
  const mobile = useIsMobile();
  const { totalStamps, uniqueCountries, regionsTouched, title, nextTier } = summary;

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
            {progressToNextTier(totalStamps, regionsTouched.size, nextTier.minStamps, nextTier.minRegions)} to go
          </div>
        ) : (
          <div className="text-sm text-brown-medium font-body">
            You&apos;ve reached the highest title. The world is yours.
          </div>
        )}
        <TierLedger currentTitle={title} />
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

