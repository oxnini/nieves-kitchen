'use client';

import { useId } from 'react';

/**
 * TilePattern — the glazed azulejo quatrefoil, the brand's decorative primitive.
 * Renders as a repeating SVG that fills its positioned parent. Use a cream line
 * over a cobalt fill for a "glazed" surface, or a low-opacity line as texture
 * behind panels and step numbers.
 *
 * The parent must be `position: relative` (or otherwise positioned) — the SVG
 * pins to `inset-0`.
 */
export function TilePattern({
  line = 'var(--color-cream)',
  opacity = 0.5,
  strokeWidth = 1.4,
  fill = 'none',
  className = '',
}: {
  /** Line colour of the quatrefoil. */
  line?: string;
  /** Line opacity — ~0.5 for glazed tiles, ~0.14–0.28 as faint texture. */
  opacity?: number;
  strokeWidth?: number;
  /** Solid colour to paint the tile ground; leave `none` to stay transparent. */
  fill?: string;
  className?: string;
}) {
  // Unique per instance so multiple patterns on one page never collide.
  const id = 'nk-tile-' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 block h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width="46" height="46" patternUnits="userSpaceOnUse">
          <g fill="none" style={{ stroke: line, strokeWidth, opacity }}>
            <path d="M0 11.5 A11.5 11.5 0 0 0 11.5 0" />
            <path d="M46 11.5 A11.5 11.5 0 0 1 34.5 0" />
            <path d="M0 34.5 A11.5 11.5 0 0 1 11.5 46" />
            <path d="M46 34.5 A11.5 11.5 0 0 0 34.5 46" />
            <ellipse cx="23" cy="13" rx="3.8" ry="7" />
            <ellipse cx="23" cy="33" rx="3.8" ry="7" />
            <ellipse cx="13" cy="23" rx="7" ry="3.8" />
            <ellipse cx="33" cy="23" rx="7" ry="3.8" />
          </g>
        </pattern>
      </defs>
      {fill !== 'none' && <rect width="100%" height="100%" fill={fill} />}
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
