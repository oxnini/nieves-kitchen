'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  withSpine?: boolean;
}

export default function Spread({ children, withSpine = true }: Props) {
  return (
    <div className="relative w-full h-full bg-parchment overflow-hidden">
      <div className="absolute inset-0 [filter:url(#passport-grain)] opacity-40 pointer-events-none" />
      <div className="relative h-full w-full overflow-hidden">{children}</div>
      {withSpine && (
        <div
          aria-hidden
          className="absolute top-[2%] bottom-[2%] left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-brown-dark/10 via-brown-dark/40 to-brown-dark/10 pointer-events-none"
        />
      )}
    </div>
  );
}
