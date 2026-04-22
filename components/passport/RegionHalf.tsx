'use client';

import Link from 'next/link';
import type { Stamp as StampRow } from '@/lib/passport';
import type { CulinaryRegion } from '@/lib/types';
import CountryStampSlot from './CountryStampSlot';

interface Props {
  region: CulinaryRegion;
  /** Up to 12 country names in cooked order. May be empty. */
  countries: string[];
  /** If true, show the region header on this half (first spread's left half only). */
  showHeader: boolean;
  /** Continuation index of the owning spread; 0 = primary spread. */
  continuationIndex: number;
  stampsPerCountry: Map<string, StampRow[]>;
  onCookedClick: (country: string) => void;
}

export default function RegionHalf({
  region, countries, showHeader, continuationIndex, stampsPerCountry, onCookedClick,
}: Props) {
  return (
    <div className="sm:h-full w-full flex flex-col gap-[calc(var(--stamp-size)*0.3)] p-[var(--stamp-gap)]">
      {showHeader ? (
        <RegionHeader region={region} continuationIndex={continuationIndex} />
      ) : (
        <h2 className="sr-only">{region} — continued</h2>
      )}
      <div
        className="flex flex-wrap content-start items-center"
        style={{
          gap: 'var(--stamp-gap)',
          justifyContent: 'center',
        }}
      >
        {countries.map(country => {
          const stamps = stampsPerCountry.get(country) ?? [];
          return (
            <CountryStampSlot
              key={country}
              country={country}
              stamps={stamps}
              onClick={() => onCookedClick(country)}
            />
          );
        })}
      </div>
    </div>
  );
}

function RegionHeader({
  region, continuationIndex,
}: { region: CulinaryRegion; continuationIndex: number }) {
  const isContinuation = continuationIndex > 0;
  const browseHref = `/recipes?region=${encodeURIComponent(region)}`;
  return (
    <div className="mb-[calc(var(--stamp-size)*0.2)] px-[calc(var(--stamp-gap)*0.5)]">
      <div
        className="uppercase tracking-[0.3em] text-brown-medium font-body mb-[calc(var(--stamp-size)*0.04)]"
        style={{ fontSize: 'calc(var(--stamp-size) * 0.12)' }}
      >
        Region{isContinuation ? ' \u00b7 cont\u2019d' : ''}
      </div>
      <h2
        className="font-heading font-bold text-brown-dark leading-[1.1]"
        style={{ fontSize: 'calc(var(--stamp-size) * 0.3)' }}
      >
        {region}
      </h2>
      {!isContinuation && (
        <Link
          href={browseHref}
          className="inline-block mt-[calc(var(--stamp-size)*0.08)] font-body text-terracotta hover:underline"
          style={{ fontSize: 'calc(var(--stamp-size) * 0.13)' }}
        >
          Browse {region} recipes &rarr;
        </Link>
      )}
    </div>
  );
}
