'use client';

import type { CulinaryRegion } from '@/lib/types';
import Spread from './Spread';
import RegionMotif from './RegionMotif';
import { EMPTY_REGION_COPY } from '@/lib/passport-empty-copy';

interface Props {
  region: CulinaryRegion;
}

export default function EmptyRegionSpread({ region }: Props) {
  return (
    <Spread region={region}>
      <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 gap-2 p-6 sm:p-8">
        <div className="flex flex-col justify-center gap-3">
          <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body">
            Region
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-dark leading-[1.05]">
            {region}
          </h2>
          <p className="font-heading italic text-brown-medium text-base sm:text-lg leading-snug max-w-[26ch] mt-1">
            {EMPTY_REGION_COPY[region]}
          </p>
        </div>
        <div className="relative flex items-center justify-center min-h-[34vh] sm:min-h-0">
          <RegionMotif region={region} />
        </div>
      </div>
    </Spread>
  );
}
