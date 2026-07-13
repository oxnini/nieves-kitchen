'use client';

/**
 * /dev/redesign/v2 — shared interactive primitives used by all three new
 * design languages. The primitives hold the behaviour (swipe, inline
 * navigation, the "would open →" flash); each variation supplies its own skin
 * via className/style props so the languages stay visually distinct.
 */

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import type { NavTo, Rich } from './content';

/* ─────────────────────────── inline navigation ─────────────────────────── */

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Human label for a nav target, e.g. "Atlas · Türkiye", "Pantry · Olive Oil". */
export function navLabel(to: NavTo): string {
  switch (to.kind) {
    case 'atlas':
      return to.country ? `Atlas · ${to.country}` : 'Atlas';
    case 'pantry':
      return `Pantry · ${titleCase(to.slug)}`;
    case 'recipes':
      return 'All recipes';
    case 'collection':
      return `Collection · ${titleCase(to.slug)}`;
    case 'about':
      return 'About';
    case 'recipe':
      return `Recipe · ${titleCase(to.slug)}`;
  }
}

/**
 * Renders authored prose (`Rich`) with its inline links. Plain strings render
 * as text; `{ text, to }` segments render as buttons that fire `onNavigate`.
 * Link appearance is entirely the caller's (`linkClassName`).
 */
export function NavText({
  content,
  linkClassName,
  onNavigate,
}: {
  content: Rich;
  linkClassName: string;
  onNavigate: (to: NavTo) => void;
}) {
  return (
    <>
      {content.map((seg, i) =>
        typeof seg === 'string' ? (
          <span key={i}>{seg}</span>
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => onNavigate(seg.to)}
            title={`Open ${navLabel(seg.to)}`}
            className={linkClassName}
          >
            {seg.text}
          </button>
        ),
      )}
    </>
  );
}

/* ─────────────────────────── nav flash (demo) ──────────────────────────── */

/**
 * The sandbox has no real router, so tapping an inline link raises a brief
 * "Opening … →" pill. It proves the interaction without leaving the preview.
 */
export function useNavFlash() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const fire = useCallback((to: NavTo) => {
    setMsg(navLabel(to));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 1900);
  }, []);
  return { msg, fire };
}

export function NavFlash({
  msg,
  className,
  style,
}: {
  msg: string | null;
  className?: string;
  style?: CSSProperties;
}) {
  if (!msg) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-[13px] font-medium shadow-lg ${className ?? ''}`}
      style={style}
    >
      Opening {msg} →
    </div>
  );
}

/* ───────────────────────────── filmstrip ───────────────────────────────── */

/**
 * A snap-scrolling horizontal shelf of cards. Driven by drag/fling (pointer),
 * the prev/next arrows, and the keyboard (← →) when focused. Reduced-motion
 * aware. Cards are the caller's children (each `snap-start shrink-0`).
 */
export function Filmstrip({
  children,
  ariaLabel,
  arrowClassName,
  arrowStyle,
  gapClassName = 'gap-4',
  padClassName = 'px-1',
}: {
  children: ReactNode;
  ariaLabel: string;
  arrowClassName?: string;
  arrowStyle?: CSSProperties;
  gapClassName?: string;
  padClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startLeft: 0, active: false, moved: 0 });

  const scroll = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: el.clientWidth * 0.72 * dir, behavior: reduce ? 'auto' : 'smooth' });
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
    if (!el || e.pointerType === 'touch') return; // native touch scroll is better on touch
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
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.stopPropagation();
      e.preventDefault();
      drag.current.moved = 0;
    }
  };

  const arrowBase =
    'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-xl shadow-md transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:grid';

  return (
    <div className="relative">
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
        className={`flex ${gapClassName} ${padClassName} snap-x snap-mandatory overflow-x-auto scroll-smooth pb-3 outline-none [-ms-overflow-style:none] [scrollbar-width:none] select-none [&::-webkit-scrollbar]:hidden`}
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Previous recipes"
        onClick={() => scroll(-1)}
        className={`${arrowBase} left-1 ${arrowClassName ?? ''}`}
        style={arrowStyle}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next recipes"
        onClick={() => scroll(1)}
        className={`${arrowBase} right-1 ${arrowClassName ?? ''}`}
        style={arrowStyle}
      >
        ›
      </button>
    </div>
  );
}
