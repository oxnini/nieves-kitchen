'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MOBILE_BREAKPOINT } from '@/hooks/useIsMobile';

interface Props {
  children: ReactNode;
  openState: 'open' | 'closed';
  chrome?: ReactNode;
}

const OPEN_ASPECT = 1.4;          // open spread width / height
const MARGIN_PX = 24;
const NAVBAR_ALLOWANCE_PX = 96;    // navbar + safe-area gap
const INDICATOR_ALLOWANCE_PX = 64; // page indicator footer
const COLS_PER_HALF = 3;
const MOBILE_PAGE_ASPECT = 0.72; // portrait page width / height

export default function BookletShell({ children, openState, chrome }: Props) {
  const [size, setSize] = useState<{ w: number; h: number; mobile: boolean } | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth - MARGIN_PX * 2;
      const vh =
        window.innerHeight -
        NAVBAR_ALLOWANCE_PX -
        INDICATOR_ALLOWANCE_PX -
        MARGIN_PX * 2;

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      if (isMobile) {
        // Portrait single-page layout
        const w = vw;
        const h = Math.min(w / MOBILE_PAGE_ASPECT, vh);
        setSize({ w, h, mobile: true });
      } else {
        // Landscape spread layout
        const byWidth = { w: vw, h: vw / OPEN_ASPECT };
        const byHeight = { w: vh * OPEN_ASPECT, h: vh };
        const open = byWidth.h <= vh ? byWidth : byHeight;
        setSize({ w: open.w, h: open.h, mobile: false });
      }
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
    return <div className="relative w-full max-w-5xl mx-auto aspect-[3/4] sm:aspect-[1.4/1]" />;
  }

  const { mobile } = size;
  const openWidth = size.w;
  const openHeight = size.h;
  // On mobile the full width IS the page; on desktop each half is a page.
  const pageWidth = mobile ? openWidth : openWidth / 2;
  const visibleWidth = mobile ? openWidth : (openState === 'open' ? openWidth : pageWidth);

  const gapPx = pageWidth * (mobile ? 0.05 : 0.067);
  const stampSize = (pageWidth - gapPx * (COLS_PER_HALF + 1)) / COLS_PER_HALF;

  return (
    <div
      className="relative mx-auto"
      style={
        {
          width: visibleWidth,
          height: openHeight,
          '--stamp-size': `${stampSize}px`,
          '--stamp-gap': `${gapPx}px`,
          '--half-width': `${pageWidth}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="relative rounded-xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(60,30,15,0.5)]"
        style={{ width: visibleWidth, height: openHeight }}
      >
        {children}
        {!mobile && openState === 'open' && (
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
