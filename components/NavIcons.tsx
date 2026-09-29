/* The navbar's own drawings for search and favourites, on Lucide's 24px grid
   and currentColor stroke so they sit beside Lucide's sun/moon. Picked in
   /dev/navbar (2026-09-29) over the stock glyphs, which read as generic app
   icons: a loupe with a glint on the glass, and a bookmark ribbon for
   favourites, since saving a recipe is marking a page in the book. */

/* aria-hidden is accepted so these drop in where a Lucide icon was; the
   drawings are always hidden from assistive tech. */
type IconProps = { size: number; strokeWidth: number; className?: string; 'aria-hidden'?: boolean | 'true' };

function Svg({ size, strokeWidth, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className={className}
    >
      {children}
    </svg>
  );
}

/** A loupe with a small glint on the glass. */
export function SearchLoupe(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10.5" cy="10.5" r="6.75" />
      <path d="M15.4 15.4 20.25 20.25" />
      <path d="M7.3 9.4a3.5 3.5 0 0 1 2.3-2.3" strokeWidth={p.strokeWidth * 0.8} />
    </Svg>
  );
}

/** A bookmark ribbon. A `fill-*` class fills it (CSS beats the attribute). */
export function Ribbon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 3.75h10a.75.75 0 0 1 .75.75v15.7L12 16.3l-5.75 3.9V4.5A.75.75 0 0 1 7 3.75Z" />
    </Svg>
  );
}
