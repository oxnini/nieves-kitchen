/* Hand-drawn alternatives to the Lucide glyphs for the navbar tools, on the
   same 24px grid and the same currentColor stroke so they swap in 1:1. Each
   one leans away from the generic app-icon look in a different way: a
   weighted engraver's handle, a bookmark ribbon instead of a heart, a
   half-inked disc instead of sun/moon. */

type P = { size: number; strokeWidth: number };

function Svg({ size, strokeWidth, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* ---------- search ---------- */

/* SearchLoupe and Ribbon shipped: they live in components/NavIcons.tsx. */

/** A fine ring with a weighted, tapering handle, like an engraving. */
export function SearchEngraved(p: P) {
  return (
    <Svg {...p}>
      <circle cx="10" cy="10" r="6.25" />
      <path
        d="M14.3 15.6 15.6 14.3 20.6 19.3a0.95 0.95 0 0 1 0 1.3 0.95 0.95 0 0 1-1.3 0Z"
        fill="currentColor" stroke="currentColor" strokeWidth={p.strokeWidth * 0.6}
      />
    </Svg>
  );
}

/* ---------- favourites ---------- */

/** A taller, softer heart with a longer point. */
export function HeartAlmond(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 20.25C8 16.9 4.5 13.6 4.5 9.6a3.85 3.85 0 0 1 7.5-1.25 3.85 3.85 0 0 1 7.5 1.25c0 4-3.5 7.3-7.5 10.65Z" />
    </Svg>
  );
}

/* ---------- theme ---------- */

/** A small sun with eight short, detached rays. */
export function SunFine(p: P) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const c = Math.cos(a), s = Math.sin(a);
    return `M${(12 + 6.6 * c).toFixed(2)} ${(12 + 6.6 * s).toFixed(2)}L${(12 + 8.6 * c).toFixed(2)} ${(12 + 8.6 * s).toFixed(2)}`;
  }).join('');
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3.6" />
      <path d={rays} />
    </Svg>
  );
}

/** A slim crescent. */
export function MoonFine(p: P) {
  return (
    <Svg {...p}>
      <path d="M19.25 14.4A7.6 7.6 0 1 1 9.6 4.75a6.1 6.1 0 0 0 9.65 9.65Z" />
    </Svg>
  );
}

/** A disc inked on one half: day inks the left, night the right. */
export function HalfDisc({ night, ...p }: P & { night: boolean }) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="7.5" />
      <path d={night ? 'M12 4.5a7.5 7.5 0 0 1 0 15Z' : 'M12 4.5a7.5 7.5 0 0 0 0 15Z'} fill="currentColor" />
    </Svg>
  );
}
