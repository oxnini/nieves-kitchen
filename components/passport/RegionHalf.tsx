'use client';

import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';
import type { HalfDescriptor, RegionBlock } from '@/lib/passport-pack';
import CountryStampSlot from './CountryStampSlot';

interface Props {
  half: HalfDescriptor;
  stampsPerCountry: Map<string, StampRow[]>;
  recipesByCountry: Map<string, Recipe[]>;
  onCookedClick: (country: string) => void;
  onUncookedClick: (country: string) => void;
}

export default function RegionHalf({
  half, stampsPerCountry, onCookedClick, onUncookedClick,
}: Props) {
  if (half.kind === 'blank') {
    return <div className="h-full w-full" aria-hidden />;
  }

  return (
    <div className="h-full w-full flex flex-col gap-[calc(var(--stamp-size)*0.25)] p-[calc(var(--stamp-size)*0.35)]">
      {half.blocks.map((block, idx) => (
        <RegionBlockView
          key={`${block.subRegion}-${idx}`}
          block={block}
          stampsPerCountry={stampsPerCountry}
          onCookedClick={onCookedClick}
          onUncookedClick={onUncookedClick}
        />
      ))}
    </div>
  );
}

function RegionBlockView({
  block, stampsPerCountry, onCookedClick, onUncookedClick,
}: {
  block: RegionBlock;
  stampsPerCountry: Map<string, StampRow[]>;
  onCookedClick: (country: string) => void;
  onUncookedClick: (country: string) => void;
}) {
  const cookedCount = block.countries.filter(
    c => (stampsPerCountry.get(c)?.length ?? 0) > 0,
  ).length;
  const cleanName = block.subRegion.replace(' (sub)', '');

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-end justify-between mb-[calc(var(--stamp-size)*0.2)]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-brown-medium font-body mb-1">
            Region{block.isContinuation ? ' · cont\u2019d' : ''}
          </div>
          <h2 className="font-heading text-2xl font-bold text-brown-dark leading-tight">
            {cleanName}
          </h2>
        </div>
        <div className="font-body text-sm text-brown-medium">
          <span className="font-semibold text-brown-dark">{cookedCount}</span>
          <span className="opacity-70">{' / '}{block.countries.length} cooked</span>
        </div>
      </div>

      <div
        className="grid content-start"
        style={{
          gridTemplateColumns: 'repeat(4, var(--stamp-size))',
          gap: 'var(--stamp-gap)',
          justifyContent: 'space-between',
        }}
      >
        {block.countries.map(country => {
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
