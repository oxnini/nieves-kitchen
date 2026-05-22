'use client';

/**
 * Wavy cancellation-stroke mark used to flag a recipe as "cooked".
 *
 * Visual grammar: three squiggly ink strokes in stamp-ink terracotta with a
 * tight Cutive Mono caption underneath, tilted -8° as if hand-stamped on
 * paper. No enclosing shape, no badge background — sits directly on whatever
 * surface it overlays (parchment, recipe photo, etc).
 */

const INK = 'var(--stamp-ink-terracotta)';
const STAMP_FONT = 'var(--font-cutive-mono), ui-monospace, monospace';

interface Props {
  /** Visual width in px. Height scales proportionally (3:2-ish). Default 64. */
  width?: number;
  className?: string;
}

export default function CookedStampMark({ width = 64, className }: Props) {
  const height = (width * 42) / 64;
  return (
    <svg
      viewBox="0 0 64 42"
      width={width}
      height={height}
      style={{ transform: 'rotate(-8deg)' }}
      className={className}
      role="img"
      aria-label="Cooked"
    >
      <path d="M 3 9 Q 8 4 13 9 T 23 9 T 33 9 T 43 9 T 53 9 T 61 9" stroke={INK} strokeWidth={2.0} fill="none" opacity={0.92} strokeLinecap="round" />
      <path d="M 3 17 Q 8 12 13 17 T 23 17 T 33 17 T 43 17 T 53 17 T 61 17" stroke={INK} strokeWidth={2.0} fill="none" opacity={0.92} strokeLinecap="round" />
      <path d="M 3 25 Q 8 20 13 25 T 23 25 T 33 25 T 43 25 T 53 25 T 61 25" stroke={INK} strokeWidth={2.0} fill="none" opacity={0.92} strokeLinecap="round" />
      <text
        x={32} y={38}
        fontSize={8} fontFamily={STAMP_FONT} fill={INK}
        textAnchor="middle" letterSpacing="1.8" opacity={1}
      >
        COOKED
      </text>
    </svg>
  );
}
