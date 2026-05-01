'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import type { CulinaryRegion } from '@/lib/types';

interface Props {
  children: ReactNode;
  // Accepted for call-site compatibility; the spine is now drawn by
  // BookletShell so it stays fixed at the booklet's center during page flips.
  withSpine?: boolean;
  region?: CulinaryRegion;
}

const REGION_BACKGROUNDS: Partial<Record<CulinaryRegion, string>> = {
  'Western Europe': '/passport-bg/western-europe.webp',
  'Eastern Europe': '/passport-bg/eastern-europe.webp',
  'East Asia': '/passport-bg/east-asia.webp',
  'Southeast Asia': '/passport-bg/southeast-asia.webp',
  'South Asia': '/passport-bg/south-asia.webp',
  'Middle East': '/passport-bg/middle-east.webp',
  'North Africa': '/passport-bg/north-africa.webp',
  'Sub-Saharan Africa': '/passport-bg/sub-saharan-africa.webp',
};

export default function Spread({ children, region }: Props) {
  const bg = region ? REGION_BACKGROUNDS[region] : undefined;
  return (
    <div className="passport-paper relative w-full h-full bg-parchment overflow-hidden">
      {bg && (
        <Image
          aria-hidden
          src={bg}
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="absolute inset-0 pointer-events-none object-cover opacity-70 scale-[1.06]"
        />
      )}
      <div className="absolute inset-0 [filter:url(#passport-grain)] opacity-40 pointer-events-none" />
      <div className="relative h-full w-full overflow-x-hidden overflow-y-auto sm:overflow-hidden">{children}</div>
    </div>
  );
}
