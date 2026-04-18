'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function BookletShell({ children }: Props) {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div
        className="relative w-full rounded-xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(60,30,15,0.5)]"
        style={{ aspectRatio: '3/2' }}
      >
        {children}
      </div>
    </div>
  );
}
