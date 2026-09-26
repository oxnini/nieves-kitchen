'use client';

import Link from 'next/link';
import { Eyebrow } from '@/components/courtyard/Eyebrow';
import type { PassportSummary } from '@/lib/passport';
import { CULINARY_REGION_ORDER, type CulinaryRegion } from '@/lib/types';
import CountryStampSlot, { type CancellationInput } from '@/components/passport/CountryStampSlot';
import JournalSectionHead, { plural } from './JournalSectionHead';

export interface JournalStampsProps {
  summary: PassportSummary;
  cancellationsByCountry: Map<string, CancellationInput[]>;
  /** Country -> region, the hook's `countryToRegion` (see `useCookedStamps`). */
  regionOfCountry: Map<string, CulinaryRegion>;
  /** Bubbles a stamp tap up to `StampedRecipesModal`, the only removal path. */
  onStampClick: (country: string) => void;
}

/** Countries whose region mapping is missing land here, so no earned stamp is ever dropped. */
const ELSEWHERE_LABEL = 'Elsewhere';

/**
 * The "Stamps collected" gallery (Phase 8 restyle: R106-R108): earned
 * country stamps grouped ONLY by the regions actually touched (never an
 * empty region group), as ruled rows — region label left, a cell per
 * country with the stamp, name and dish count. Reuses the production
 * `CountryStampSlot` composite so the ink-on-parchment craft is identical
 * to the passport; it stays the only interactive/tappable element per cell.
 *
 * No plinth by day (the grid sits open on the mist page); at night the
 * region rows + atlas link fall back to the warm paper plinth
 * (`.ink-plinth-panel`, CSS-only via `[data-theme="sepia"]`) because the
 * ink vanishes on dark. Per spec §11 it's the GRID that sits on the
 * plinth, not the section head — the head stays on the page (like Titles
 * and The log) so it isn't cramped against the panel's night inset
 * (review round 1, C1). Renders nothing for an origin-less-only cook (no
 * country stamps to show) — that's correct, not a gap.
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
    <section className="flex flex-col gap-1.5">
      <JournalSectionHead
        title="Stamps collected"
        count={`${plural(summary.totalStamps, 'country', 'countries')}, ${plural(summary.regionsTouched.size, 'region', 'regions')}`}
      />

      <div
        className="ink-plinth-panel rounded-[3px] flex flex-col gap-1.5"
        style={{ ['--stamp-size' as string]: 'clamp(80px, 22vw, 107px)' }}
      >
        {groups.map((group) => (
          <div
            key={group.label}
            className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-0 sm:gap-5 border-b border-line"
          >
            <div className="pt-3.5 pb-1 sm:pt-[18px] sm:pb-0">
              <h3>
                <Eyebrow as="span" tone="muted">{group.label}</Eyebrow>
              </h3>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
              {group.countries.map((country) => {
                const dishCount = countUniqueDishes(summary, country);
                return (
                  <div
                    key={country}
                    className="flex flex-col items-center gap-2.5 border-r sm:border-r-0 sm:border-l border-line px-3.5 pt-4 pb-3 text-center"
                  >
                    <CountryStampSlot
                      country={country}
                      stamps={summary.stampsPerCountry.get(country)!}
                      cancellations={cancellationsByCountry.get(country)}
                      onClick={() => onStampClick(country)}
                    />
                    <span className="font-heading text-[18px] text-brown-dark">{country}</span>
                    <small className="font-body text-[12.5px] text-brown-medium">
                      {plural(dishCount, 'dish', 'dishes')}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <Link
          href="/atlas"
          className="mt-2 self-start font-body text-sm text-teal hover:underline"
        >
          See your world on the atlas &rarr;
        </Link>
      </div>
    </section>
  );
}

/** Unique `recipe_slug`s cooked from `country`, for the cell's "N dishes" line. */
function countUniqueDishes(summary: PassportSummary, country: string): number {
  const stamps = summary.stampsPerCountry.get(country) ?? [];
  return new Set(stamps.map((s) => s.recipe_slug)).size;
}
