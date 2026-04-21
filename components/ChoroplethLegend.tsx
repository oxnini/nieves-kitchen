'use client';

import { useMemo } from 'react';

type ChoroplethLevel = 'continent' | 'region' | 'country';

const LEVEL_SUBTITLES: Record<ChoroplethLevel, string> = {
  continent: 'per continent',
  region: 'per region',
  country: 'per country',
};

const NUM_STEPS_DESKTOP = 4;
const NUM_STEPS_MOBILE = 3;

interface Step {
  label: string;
  color: string;
}

function buildSteps(
  maxCount: number,
  numSteps: number,
  getColor: (count: number, max: number) => string,
): Step[] {
  if (maxCount <= 0) {
    return [{ label: '0', color: getColor(0, 1) }];
  }

  const stepSize = Math.max(1, Math.ceil(maxCount / numSteps));
  const steps: Step[] = [];

  for (let i = 0; i < numSteps; i++) {
    const lo = i * stepSize + 1;
    if (lo > maxCount) break; // No more valid buckets
    const hi = Math.min((i + 1) * stepSize, maxCount);
    const mid = (lo + hi) / 2;
    const color = getColor(mid, maxCount);
    const label = lo === hi ? `${lo}` : `${lo}\u2013${hi}`;
    steps.push({ label, color });
  }

  return steps.reverse(); // Darkest (highest) on top
}

interface ChoroplethLegendProps {
  level: ChoroplethLevel;
  maxCount: number;
  getColor: (count: number, max: number) => string;
}

export default function ChoroplethLegend({
  level,
  maxCount,
  getColor,
}: ChoroplethLegendProps) {
  const desktopSteps = useMemo(
    () => buildSteps(maxCount, NUM_STEPS_DESKTOP, getColor),
    [maxCount, getColor],
  );

  const mobileSteps = useMemo(
    () => buildSteps(maxCount, NUM_STEPS_MOBILE, getColor),
    [maxCount, getColor],
  );

  const noneColor = getColor(0, 1);

  return (
    <>
      {/* ── Desktop legend ── */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex flex-col gap-2 bg-parchment/92 dark:bg-brown-dark/92 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-md">
        <div className="flex flex-col">
          <span className="font-heading text-[11px] font-semibold tracking-widest uppercase text-brown-dark/80">
            Recipe
          </span>
          <span className="font-heading text-[11px] font-semibold tracking-widest uppercase text-brown-dark/80 -mt-0.5">
            Density
          </span>
          <span className="text-[10px] text-brown-medium/70 mt-0.5 transition-all duration-400">
            {LEVEL_SUBTITLES[level]}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {desktopSteps.map((step) => (
            <div key={step.label} className="flex items-center gap-2">
              <div
                className="w-4 h-3 rounded-sm shrink-0 transition-colors duration-400"
                style={{ backgroundColor: step.color }}
              />
              <span className="text-[11px] text-brown-medium font-body tabular-nums leading-none">
                {step.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-3 rounded-sm shrink-0 transition-colors duration-400"
              style={{ backgroundColor: noneColor }}
            />
            <span className="text-[11px] text-brown-medium/60 font-body leading-none">
              none
            </span>
          </div>
        </div>
      </div>

      {/* ── Mobile legend (compact, above breadcrumb) ── */}
      <div className="absolute bottom-14 left-3 z-10 flex sm:hidden flex-col gap-1 bg-parchment/92 dark:bg-brown-dark/92 backdrop-blur-sm px-2.5 py-2 rounded-xl shadow-md">
        {mobileSteps.map((step) => (
          <div key={step.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-2.5 rounded-sm shrink-0 transition-colors duration-400"
              style={{ backgroundColor: step.color }}
            />
            <span className="text-[10px] text-brown-medium font-body tabular-nums leading-none">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
