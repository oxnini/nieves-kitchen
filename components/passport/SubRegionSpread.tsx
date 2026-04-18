'use client';

import type { SubCulinaryRegion, Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';
import CountryStampSlot from './CountryStampSlot';

interface Props {
  subRegion: SubCulinaryRegion;
  countries: string[];
  stampsPerCountry: Map<string, StampRow[]>;
  recipesByCountry: Map<string, Recipe[]>;
  onCookedClick: (country: string) => void;
  onUncookedClick: (country: string) => void;
}

export default function SubRegionSpread({
  subRegion, countries, stampsPerCountry, onCookedClick, onUncookedClick,
}: Props) {
  const cookedCount = countries.filter(
    c => (stampsPerCountry.get(c)?.length ?? 0) > 0,
  ).length;

  const cleanName = subRegion.replace(' (sub)', '');

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-end justify-between mb-4 md:mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-brown-medium font-body mb-1">
            Region
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brown-dark">
            {cleanName}
          </h2>
        </div>
        <div className="font-body text-sm text-brown-medium">
          <span className="font-semibold text-brown-dark">{cookedCount}</span>
          <span className="opacity-70">{' / '}{countries.length} cooked</span>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 content-start">
        {countries.map(country => {
          const stamps = stampsPerCountry.get(country) ?? [];
          const isCooked = stamps.length > 0;
          return (
            <CountryStampSlot
              key={country}
              country={country}
              stamps={stamps}
              onClick={() =>
                isCooked ? onCookedClick(country) : onUncookedClick(country)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
