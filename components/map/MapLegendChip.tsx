'use client';

import { useMemo } from 'react';

type ChoroplethLevel = 'continent' | 'region' | 'country';

const GRADIENT_STOPS = 12;

/**
 * The mobile atlas's map key: one small paper chip under the breadcrumb,
 * "Fewer [ramp] More recipes" (mobile atlas spec "Bottom dock", audit F12).
 * Desktop keeps the full ChoroplethLegend. The zoom level ("per continent"
 * and so on) stays in the accessible name; the visible chip leaves it out
 * for width. Fades out while a recipe sheet is open, like the old legend.
 */
export default function MapLegendChip({
  level,
  maxCount,
  getColor,
  hidden,
}: {
  level: ChoroplethLevel;
  maxCount: number;
  getColor: (count: number, max: number) => string;
  hidden: boolean;
}) {
  const safeMax = Math.max(1, maxCount);
  const gradient = useMemo(() => {
    const stops: string[] = [];
    for (let i = 0; i < GRADIENT_STOPS; i++) {
      const t = i / (GRADIENT_STOPS - 1);
      stops.push(`${getColor(t * safeMax, safeMax)} ${(t * 100).toFixed(1)}%`);
    }
    return `linear-gradient(to right, ${stops.join(', ')})`;
  }, [safeMax, getColor]);

  return (
    <div
      role="img"
      aria-label={`Map key: lighter means fewer recipes, darker means more, per ${level}, from 0 to ${safeMax}`}
      aria-hidden={hidden || undefined}
      className={`absolute left-3 top-[calc(7.25rem+env(safe-area-inset-top))] z-10 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 shadow-sm pointer-events-none transition-opacity duration-200 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="font-body text-[13px] leading-none text-brown-dark">Fewer</span>
      <span
        aria-hidden="true"
        className="h-2 w-12 rounded-full ring-1 ring-inset ring-brown-dark/30"
        style={{ backgroundImage: gradient }}
      />
      <span className="font-body text-[13px] leading-none text-brown-dark">More recipes</span>
    </div>
  );
}
