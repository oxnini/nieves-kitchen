'use client';

import { useId } from 'react';

export interface CancellationMarkProps {
  /** Recipe title — rendered along the top arc, uppercased, truncated to 16 chars. */
  recipeTitle: string;
  /** Cook date — formatted as `DD MMM YY` along the bottom arc. */
  cookDate: Date;
  /**
   * CSS custom property *name* for the ink colour (e.g. `--stamp-ink-navy`).
   * Wrapped with `var()` internally so callers can't accidentally inline a
   * hex value — see SPEC §3 ("Ink colour is regionally tinted") and §7
   * ("All ink colours come from the existing CSS variables").
   */
  inkVar: string;
  /**
   * Per-country centre glyph (asterisk, fleuron, short crossbar, etc.).
   * Fixed once per country and reused across every cancellation for that
   * country — see SPEC §3 and the per-country lookup in step 2.
   */
  centerGlyph: string;
  /** Rotation in degrees applied to the whole mark (±12° jitter, seeded upstream). */
  rotation: number;
  /** Optional className passthrough — parent sizes/positions the mark. */
  className?: string;
}

const MONTH_ABBR = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
] as const;

const TITLE_MAX = 16;

function formatPostmarkDate(d: Date): string {
  const day = d.getDate().toString().padStart(2, '0');
  const month = MONTH_ABBR[d.getMonth()];
  const year = (d.getFullYear() % 100).toString().padStart(2, '0');
  return `${day} ${month} ${year}`;
}

function clampTitle(title: string): string {
  const up = title.toUpperCase().trim();
  if (up.length <= TITLE_MAX) return up;
  return up.slice(0, TITLE_MAX - 1).trimEnd() + '…';
}

/*
  Geometry (100×100 design viewBox):
  - Outer ring at r=46.
  - Inner ring at r=16.2 (≈35% of outer per SPEC §3 revised) — earlier
    drafts had this at r=32 then r=25 then r=18; each step pulled the
    inner ring further down to a small concentric mark around the
    per-country glyph, so the title + date band is unambiguously the
    postmark's focal element.
  - Text rides between the rings, vertically centred on r=35.5.
    Caps extend in opposite directions on the two arcs (outward on top,
    inward on bottom), so the two text baselines sit at different radii:
    top arc baseline ≈ 32.5, bottom arc baseline ≈ 38.5. That puts both
    text bands occupying r∈[32.5, 38.5] — symmetric about r=35.5.
  - Arcs span 180° — text uses ~65% of that with letter-spacing tuned for
    a 16-char title cap. Top arc: sweep-flag=1 (clockwise via 12 o'clock).
    Bottom arc: sweep-flag=0 (counter-clockwise via 6 o'clock) so the
    bottom text reads upright rather than upside-down.

  Imperfection vocabulary:
  - Rings broken with multi-segment stroke-dasharray (pathLength={1}) —
    four mid-length dashes with four small unequal gaps each, so the
    ring reads as hand-pressed rather than printed.
  - Faint off-register secondary impression of the rings (not the text),
    shifted up-left by ~0.6 viewBox units at low opacity — mimics a
    rubber stamp pressed twice with a slight wobble between impressions.
  - The parent composite still applies [filter:url(#stamp-ink)] for the
    paper-bleed/grain — this component does not apply it itself.

  Blend mode / opacity:
  - Per SPEC §7 (revised), cancellations sit ON TOP of the visa with
    normal blending at ~88% opacity. That is a *parent* concern — this
    component renders at full opacity in default blending. The parent
    slot (or the scratch route during step 1) is responsible for the
    `opacity-[0.88]` class and the absence of `mix-blend-multiply`.
*/

const TOP_ARC_R = 32.5;
const BOT_ARC_R = 38.5;
const INNER_R = 16.2;

// Dasharrays sum to 1 over pathLength={1}, giving exactly one set of
// gaps around each ring rather than a repeating pattern.
const OUTER_DASH = '0.235 0.020 0.235 0.012 0.235 0.018 0.235 0.010';
const INNER_DASH = '0.310 0.025 0.310 0.015 0.310 0.030';

export default function CancellationMark({
  recipeTitle,
  cookDate,
  inkVar,
  centerGlyph,
  rotation,
  className,
}: CancellationMarkProps) {
  const uid = useId().replace(/[:]/g, '');
  const topId = `cm-top-${uid}`;
  const botId = `cm-bot-${uid}`;

  const title = clampTitle(recipeTitle);
  const date = formatPostmarkDate(cookDate);

  const topLeftX = 50 - TOP_ARC_R;
  const topRightX = 50 + TOP_ARC_R;
  const botLeftX = 50 - BOT_ARC_R;
  const botRightX = 50 + BOT_ARC_R;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        color: `var(${inkVar})`,
        overflow: 'visible',
      }}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        {/* Top arc: M(left) ▶ clockwise via 12 o'clock ▶ (right). */}
        <path
          id={topId}
          d={`M ${topLeftX} 50 A ${TOP_ARC_R} ${TOP_ARC_R} 0 0 1 ${topRightX} 50`}
        />
        {/* Bottom arc: M(left) ▶ counter-clockwise via 6 o'clock ▶ (right). */}
        <path
          id={botId}
          d={`M ${botLeftX} 50 A ${BOT_ARC_R} ${BOT_ARC_R} 0 0 0 ${botRightX} 50`}
        />
      </defs>

      {/* Off-register ghost — rings only, text is never doubled. */}
      <g transform="translate(-0.6 -0.5)" opacity={0.16}>
        <circle
          cx={50}
          cy={50}
          r={46}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          pathLength={1}
          strokeDasharray={OUTER_DASH}
          strokeDashoffset={0.27}
          strokeLinecap="butt"
        />
        <circle
          cx={50}
          cy={50}
          r={INNER_R}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.85}
          pathLength={1}
          strokeDasharray={INNER_DASH}
          strokeDashoffset={0.04}
          strokeLinecap="butt"
        />
      </g>

      {/* Primary impression. */}
      <circle
        cx={50}
        cy={50}
        r={46}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        pathLength={1}
        strokeDasharray={OUTER_DASH}
        strokeLinecap="butt"
      />
      <circle
        cx={50}
        cy={50}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.05}
        pathLength={1}
        strokeDasharray={INNER_DASH}
        strokeDashoffset={0.155}
        strokeLinecap="butt"
      />

      <text
        fontFamily="var(--font-stamp-cancel), ui-monospace, monospace"
        fontSize={9.5}
        fontWeight={700}
        fill="currentColor"
        letterSpacing={0.32}
        textAnchor="middle"
      >
        <textPath href={`#${topId}`} startOffset="50%">
          {title}
        </textPath>
      </text>

      <text
        fontFamily="var(--font-stamp-cancel), ui-monospace, monospace"
        fontSize={9.5}
        fontWeight={700}
        fill="currentColor"
        letterSpacing={0.32}
        textAnchor="middle"
      >
        <textPath href={`#${botId}`} startOffset="50%">
          {date}
        </textPath>
      </text>

      <text
        x={50}
        y={50}
        fontFamily="var(--font-stamp-cancel), ui-monospace, monospace"
        fontSize={15}
        fontWeight={700}
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {centerGlyph}
      </text>
    </svg>
  );
}
