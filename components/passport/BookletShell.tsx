'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  openState: 'open' | 'closed';
  chrome?: ReactNode;
}

const OPEN_ASPECT = 1.4;          // open spread width / height
const HALF_ASPECT = OPEN_ASPECT / 2; // single-half aspect (0.7)
const MARGIN_PX = 24;
const NAVBAR_ALLOWANCE_PX = 96;    // navbar + safe-area gap
const INDICATOR_ALLOWANCE_PX = 64; // page indicator footer
const COLS_PER_HALF = 4;

export default function BookletShell({ children, openState, chrome }: Props) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth - MARGIN_PX * 2;
      const vh =
        window.innerHeight -
        NAVBAR_ALLOWANCE_PX -
        INDICATOR_ALLOWANCE_PX -
        MARGIN_PX * 2;

      // Always size against the OPEN spread so switching open/closed
      // never resizes the half.
      const byWidth = { w: vw, h: vw / OPEN_ASPECT };
      const byHeight = { w: vh * OPEN_ASPECT, h: vh };
      const open = byWidth.h <= vh ? byWidth : byHeight;
      setSize(open);
    };

    const onResize = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!size) {
    return <div className="relative w-full max-w-5xl mx-auto aspect-[1.4/1]" />;
  }

  const openWidth = size.w;
  const openHeight = size.h;
  const halfWidth = openWidth / 2;
  const visibleWidth = openState === 'open' ? openWidth : halfWidth;

  // One stamp slot fills a quarter of a half, minus column gaps.
  // Gap is proportional; pick 3% of half-width.
  const gapPx = halfWidth * 0.03;
  const stampSize = (halfWidth - gapPx * (COLS_PER_HALF + 1)) / COLS_PER_HALF;

  return (
    <div
      className="relative mx-auto"
      style={
        {
          width: visibleWidth,
          height: openHeight,
          '--stamp-size': `${stampSize}px`,
          '--stamp-gap': `${gapPx}px`,
          '--half-width': `${halfWidth}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="relative rounded-xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(60,30,15,0.5)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: visibleWidth, height: openHeight }}
      >
        {children}
        {openState === 'open' && (
          <div
            aria-hidden
            className="absolute top-[2%] bottom-[2%] left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-brown-dark/10 via-brown-dark/40 to-brown-dark/10 pointer-events-none z-10"
          />
        )}
      </div>
      {chrome}
    </div>
  );
}
