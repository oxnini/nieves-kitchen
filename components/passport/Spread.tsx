'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  // Accepted for call-site compatibility; the spine is now drawn by
  // BookletShell so it stays fixed at the booklet's center during page flips.
  withSpine?: boolean;
}

export default function Spread({ children }: Props) {
  return (
    <div className="relative w-full h-full bg-parchment overflow-hidden">
      <div className="absolute inset-0 [filter:url(#passport-grain)] opacity-40 pointer-events-none" />
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}
