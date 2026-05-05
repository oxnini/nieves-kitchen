'use client';

import { useEffect, useMemo, useRef } from 'react';
import { CONTINENT_OF, CONTINENT_ORDER, type Continent } from '@/lib/types';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import HelpInkMark from './HelpInkMark';
import RegionChip from './RegionChip';

type Section =
  | { kind: 'cover'; label: 'Cover' }
  | { kind: 'inside-front'; label: 'Profile' }
  | { kind: 'contents'; label: 'Contents' }
  | { kind: 'continent'; label: Continent; continent: Continent };

interface Props {
  spreads: SpreadDescriptor[];
  index: number;
  onJump: (i: number) => void;
  /** Pixel width of the open booklet spread, used to match pill edges. */
  width?: number | null;
}

export default function RegionChipStrip({ spreads, index, onJump, width }: Props) {
  // Section list: Cover · Profile · Contents · continents in order.
  // A continent appears only if at least one of its sub-regions has a spread.
  // The decorative back cover is intentionally not chip-navigable.
  const sections = useMemo<Section[]>(() => {
    const out: Section[] = [];

    if (spreads.some(s => s.kind === 'cover')) out.push({ kind: 'cover', label: 'Cover' });
    if (spreads.some(s => s.kind === 'inside-front')) {
      out.push({ kind: 'inside-front', label: 'Profile' });
    }
    if (spreads.some(s => s.kind === 'contents')) {
      out.push({ kind: 'contents', label: 'Contents' });
    }

    for (const c of CONTINENT_ORDER) {
      const hasAny = spreads.some(s => s.kind === 'region' && CONTINENT_OF[s.region] === c);
      if (hasAny) out.push({ kind: 'continent', label: c, continent: c });
    }

    return out;
  }, [spreads]);

  const current = spreads[index];

  // Within-continent progress: 1-indexed position of the active region spread among
  // all region spreads that belong to the same continent.
  const progress = useMemo(() => {
    if (!current || current.kind !== 'region') return null;
    const continent = CONTINENT_OF[current.region];
    const sameContinent = spreads.filter(
      s => s.kind === 'region' && CONTINENT_OF[s.region] === continent,
    );
    if (sameContinent.length <= 1) return null;
    const position = sameContinent.findIndex(s => s === current) + 1;
    return { current: position, total: sameContinent.length };
  }, [current, spreads]);

  const activeSectionIndex = useMemo(() => {
    if (!current) return -1;
    if (current.kind === 'cover') return sections.findIndex(s => s.kind === 'cover');
    if (current.kind === 'inside-front') return sections.findIndex(s => s.kind === 'inside-front');
    if (current.kind === 'contents') return sections.findIndex(s => s.kind === 'contents');
    if (current.kind === 'back-cover') return -1;
    const continent = CONTINENT_OF[current.region];
    return sections.findIndex(s => s.kind === 'continent' && s.continent === continent);
  }, [current, sections]);

  function handleJump(s: Section) {
    const targetIdx = spreads.findIndex(spread => {
      if (s.kind === 'cover') return spread.kind === 'cover';
      if (s.kind === 'inside-front') return spread.kind === 'inside-front';
      if (s.kind === 'contents') return spread.kind === 'contents';
      return (
        spread.kind === 'region' &&
        CONTINENT_OF[spread.region] === s.continent &&
        spread.continuationIndex === 0
      );
    });
    if (targetIdx >= 0) onJump(targetIdx);
  }

  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeSectionIndex < 0) return;
    const strip = stripRef.current;
    if (!strip) return;
    const activeChip = strip.querySelectorAll('[role="tab"]')[activeSectionIndex] as
      | HTMLElement
      | undefined;
    if (!activeChip) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeChip.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [activeSectionIndex]);

  return (
    <div
      className="passport-light bg-parchment shadow-sm rounded-xl px-4 py-1.5 border border-brown-light/20"
      style={width ? { width: `${width}px` } : undefined}
    >
      <div
        ref={stripRef}
        role="tablist"
        aria-label="Passport sections"
        className="flex items-center gap-0.5 overflow-x-auto snap-x snap-mandatory sm:justify-center sm:overflow-visible"
      >
        <HelpInkMark hitSize={32} />
        {sections.map((s, i) => {
          const isActive = i === activeSectionIndex;
          const key = `${s.kind}-${s.kind === 'continent' ? s.continent : ''}`;
          return (
            <span key={key} className="flex items-center">
              {i > 0 && (
                <span aria-hidden className="text-brown-light/50 px-0.5 select-none">
                  ·
                </span>
              )}
              <RegionChip label={s.label} active={isActive} onClick={() => handleJump(s)} />
              {isActive && progress && (
                <span
                  aria-hidden
                  className="ml-2 font-stamp text-xs text-brown-medium tabular-nums whitespace-nowrap"
                >
                  {progress.current} / {progress.total}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
