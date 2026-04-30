'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ChoroplethLevel = 'continent' | 'region' | 'country';

const LEVEL_SUBTITLES: Record<ChoroplethLevel, string> = {
  continent: 'per continent',
  region: 'per region',
  country: 'per country',
};

const GRADIENT_STOPS = 24;

// Editorial easing — soft sine, symmetric in and out, no bounce.
const EASE_EDITORIAL = [0.45, 0, 0.25, 1] as const;

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
  const safeMax = Math.max(1, maxCount);

  // Gradient runs from 0 (none) → max, so "none" lives on the spectrum.
  const gradient = useMemo(() => {
    const stops: string[] = [];
    for (let i = 0; i < GRADIENT_STOPS; i++) {
      const t = i / (GRADIENT_STOPS - 1);
      const count = t * safeMax;
      const color = getColor(count, safeMax);
      stops.push(`${color} ${(t * 100).toFixed(1)}%`);
    }
    return `linear-gradient(to right, ${stops.join(', ')})`;
  }, [safeMax, getColor]);

  return (
    <motion.div
      className="absolute bottom-16 left-3 sm:bottom-5 sm:left-6 z-10 pointer-events-none"
      aria-label={`Map key: recipes ${LEVEL_SUBTITLES[level]}, from 0 to ${safeMax}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
    >
      {/* Caption — vintage gazetteer header */}
      <motion.div
        className="flex items-baseline gap-2 mb-2 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE_EDITORIAL, delay: 0.25 }}
      >
        <span className="font-stamp text-[12px] sm:text-[13px] tracking-[0.2em] uppercase text-brown-dark leading-none">
          Recipes
        </span>
        {/* Subtitle cross-fades when zoom level changes */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={level}
            className="font-heading italic text-[12px] sm:text-[13px] text-brown-medium leading-none inline-block min-w-[5.75rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
          >
            {LEVEL_SUBTITLES[level]}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Hairline ledger rule — animated draw from left */}
      <motion.div
        className="h-px bg-brown-dark/25 origin-left"
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, ease: EASE_EDITORIAL, delay: 0.35 }}
      />

      {/* The key: continuous gradient, 0 → max */}
      <div className="pt-2">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_EDITORIAL, delay: 0.45 }}
        >
          {/* Bar container — overflow-hidden so cross-fading layers stay clipped */}
          <div className="relative h-2 w-40 sm:w-56 ring-1 ring-inset ring-brown-dark/30 overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={gradient}
                className="absolute inset-0"
                style={{ backgroundImage: gradient }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: EASE_EDITORIAL }}
                aria-hidden
              />
            </AnimatePresence>
          </div>
          {/* Printed ruler ticks — left, center, right */}
          <span className="absolute -top-1 left-0 w-px h-1 bg-brown-dark/45" aria-hidden />
          <span
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-[3px] bg-brown-dark/35"
            aria-hidden
          />
          <span className="absolute -top-1 right-0 w-px h-1 bg-brown-dark/45" aria-hidden />
        </motion.div>

        <motion.div
          className="flex justify-between items-baseline mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE_EDITORIAL, delay: 0.55 }}
        >
          <span className="font-heading italic text-[10px] text-brown-medium tabular-nums leading-none">
            0
          </span>
          {/* Max number cross-fades when dataset max changes */}
          <span className="relative inline-block leading-none min-w-[1ch] text-right">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={safeMax}
                className="inline-block font-heading italic text-[10px] text-brown-dark tabular-nums leading-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
              >
                {safeMax}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>
        <motion.div
          className="flex justify-between mt-0.5 w-40 sm:w-56"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE_EDITORIAL, delay: 0.6 }}
          aria-hidden
        >
          <span className="font-stamp text-[9px] tracking-[0.12em] uppercase text-brown-light/70">fewer</span>
          <span className="font-stamp text-[9px] tracking-[0.12em] uppercase text-brown-light/70">more</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
