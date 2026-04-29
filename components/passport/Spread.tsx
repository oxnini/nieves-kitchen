'use client';

import type { ReactNode } from 'react';
import type { CulinaryRegion } from '@/lib/types';

interface Props {
  children: ReactNode;
  // Accepted for call-site compatibility; the spine is now drawn by
  // BookletShell so it stays fixed at the booklet's center during page flips.
  withSpine?: boolean;
  region?: CulinaryRegion;
}

const REGION_BACKGROUNDS: Partial<Record<CulinaryRegion, string>> = {
  'Western Europe': '/passport-bg/western-europe.png',
  'Eastern Europe': '/passport-bg/eastern-europe.png',
};

export default function Spread({ children, region }: Props) {
  const bg = region ? REGION_BACKGROUNDS[region] : undefined;
  return (
    <div className="passport-paper relative w-full h-full bg-parchment overflow-hidden">
      {bg && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-no-repeat bg-center bg-cover opacity-70"
          style={{ backgroundImage: `url(${bg})` }}
        />
      )}
      <div className="absolute inset-0 [filter:url(#passport-grain)] opacity-40 pointer-events-none" />
      <div className="relative h-full w-full overflow-x-hidden overflow-y-auto sm:overflow-hidden">{children}</div>
    </div>
  );
}
