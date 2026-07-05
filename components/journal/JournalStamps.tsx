'use client';

import Link from 'next/link';
import type { PassportSummary } from '@/lib/passport';
import { CULINARY_REGION_ORDER, type CulinaryRegion } from '@/lib/types';
import CountryStampSlot, { type CancellationInput } from '@/components/passport/CountryStampSlot';

export interface JournalStampsProps {
  summary: PassportSummary;
  cancellationsByCountry: Map<string, CancellationInput[]>;
  /** Country -> region, the hook's `countryToRegion` (see `useCookedStamps`). */
  regionOfCountry: Map<string, CulinaryRegion>;
  /** Bubbles a stamp tap up; a later task (JournalScroll) wires this to `StampedRecipesModal`. */
  onStampClick: (country: string) => void;
}

/** Countries whose region mapping is missing land here, so no earned stamp is ever dropped. */
const ELSEWHERE_LABEL = 'Elsewhere';

/**
 * The "Stamps collected" gallery: earned country stamps grouped ONLY by the
 * regions actually touched (never an empty region group), reusing the
 * production `CountryStampSlot` composite so the ink-on-parchment craft is
 * identical to the passport. Renders nothing for an origin-less-only cook
 * (no country stamps to show) — that's correct, not a gap.
 */
export default function JournalStamps({
  summary, cancellationsByCountry, regionOfCountry, onStampClick,
}: JournalStampsProps) {
  if (summary.totalStamps === 0) return null;

  const byRegion = new Map<CulinaryRegion, string[]>();
  const elsewhere: string[] = [];

  for (const country of summary.stampsPerCountry.keys()) {
    const region = regionOfCountry.get(country);
    if (region) {
      const arr = byRegion.get(region) ?? [];
      arr.push(country);
      byRegion.set(region, arr);
    } else {
      elsewhere.push(country);
    }
  }

  const groups: { label: string; countries: string[] }[] = [];
  for (const region of CULINARY_REGION_ORDER) {
    const countries = byRegion.get(region);
    if (countries && countries.length > 0) groups.push({ label: region, countries });
  }
  if (elsewhere.length > 0) groups.push({ label: ELSEWHERE_LABEL, countries: elsewhere });

  return (
    <div
      className="passport-light bg-parchment rounded-lg"
      style={{
        ['--stamp-size' as string]: 'clamp(84px, 22vw, 128px)',
        ['--stamp-gap' as string]: 'clamp(16px, 4vw, 28px)',
      }}
    >
      <div className="p-6 sm:p-10 flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group.label}>
            <h3 className="font-stamp text-xs uppercase tracking-[0.28em] text-brown-medium mb-4">
              {group.label}
            </h3>
            <div
              className="flex flex-wrap items-center"
              style={{ gap: 'var(--stamp-gap)' }}
            >
              {group.countries.map((country) => (
                <CountryStampSlot
                  key={country}
                  country={country}
                  stamps={summary.stampsPerCountry.get(country)!}
                  cancellations={cancellationsByCountry.get(country)}
                  onClick={() => onStampClick(country)}
                />
              ))}
            </div>
          </section>
        ))}

        <Link
          href="/atlas"
          className="font-body text-sm text-terracotta hover:underline self-start"
        >
          see your world on the atlas &rarr;
        </Link>
      </div>
    </div>
  );
}
