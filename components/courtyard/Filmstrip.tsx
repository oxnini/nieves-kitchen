'use client';

import {
  useCallback,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

/**
 * Filmstrip — a horizontal snap-scroll shelf of cards. Two or three cards
 * visible, hidden scrollbar, round cobalt prev/next arrows (cream glyph), and
 * ArrowLeft / ArrowRight keys when focused. Driven by drag/fling on pointer,
 * native momentum on touch. Reduced-motion aware (instant scroll).
 *
 * Each child should carry its own width and `snap-start shrink-0`, so callers
 * keep control of card sizing (see the kit / home usages).
 */
export function Filmstrip({
  children,
  ariaLabel,
  gapClassName = 'gap-5',
  padClassName = 'px-1',
  arrowStyle,
  className = '',
}: {
  children: ReactNode;
  ariaLabel: string;
  gapClassName?: string;
  padClassName?: string;
  /** Override the default cobalt/cream arrow look. */
  arrowStyle?: CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startLeft: 0, active: false, moved: 0 });

  const scroll = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scroll(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scroll(-1);
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return; // native touch scroll is better
    drag.current = { startX: e.clientX, startLeft: el.scrollLeft, active: true, moved: 0 };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
  };
  // Swallow the click that ends a real drag so a card doesn't also "open".
  const onClickCapture = (e: MouseEvent) => {
    if (drag.current.moved > 6) {
      e.stopPropagation();
      e.preventDefault();
      drag.current.moved = 0;
    }
  };

  const arrowBase =
    'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-xl shadow-md transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:grid';
  const arrowSkin = arrowStyle ? '' : 'bg-cobalt text-cream';

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className={`flex ${gapClassName} ${padClassName} snap-x snap-mandatory scroll-smooth overflow-x-auto pb-3 outline-none select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scroll(-1)}
        className={`${arrowBase} ${arrowSkin} left-1`}
        style={arrowStyle}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scroll(1)}
        className={`${arrowBase} ${arrowSkin} right-1`}
        style={arrowStyle}
      >
        ›
      </button>
    </div>
  );
}
