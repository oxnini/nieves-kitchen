'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import RegionChip from './RegionChip';

type Section =
  | { kind: 'cover'; label: 'Cover' }
  | { kind: 'inside-front'; label: 'Profile' }
  | { kind: 'region'; label: string; region: string }
  | { kind: 'back-cover'; label: 'Summary' };

interface Props {
  spreads: SpreadDescriptor[];
  index: number;
  onJump: (i: number) => void;
}

export default function RegionChipStrip({ spreads, index, onJump }: Props) {
  const sections = useMemo<Section[]>(() => {
    const out: Section[] = [];
    const seenRegions = new Set<string>();
    for (const s of spreads) {
      if (s.kind === 'cover' && !out.some(x => x.kind === 'cover')) {
        out.push({ kind: 'cover', label: 'Cover' });
      } else if (s.kind === 'inside-front' && !out.some(x => x.kind === 'inside-front')) {
        out.push({ kind: 'inside-front', label: 'Profile' });
      } else if (s.kind === 'region' && !seenRegions.has(s.region)) {
        seenRegions.add(s.region);
        out.push({ kind: 'region', label: s.region, region: s.region });
      } else if (s.kind === 'back-cover' && !out.some(x => x.kind === 'back-cover')) {
        out.push({ kind: 'back-cover', label: 'Summary' });
      }
    }
    return out;
  }, [spreads]);

  const current = spreads[index];

  const progress = useMemo(() => {
    if (!current || current.kind !== 'region') return null;
    const sameRegion = spreads.filter(s => s.kind === 'region' && s.region === current.region);
    if (sameRegion.length <= 1) return null;
    return { current: current.continuationIndex + 1, total: sameRegion.length };
  }, [current, spreads]);

  const activeSectionIndex = useMemo(() => {
    if (!current) return -1;
    if (current.kind === 'cover') return sections.findIndex(s => s.kind === 'cover');
    if (current.kind === 'inside-front') return sections.findIndex(s => s.kind === 'inside-front');
    if (current.kind === 'back-cover') return sections.findIndex(s => s.kind === 'back-cover');
    return sections.findIndex(s => s.kind === 'region' && s.region === current.region);
  }, [current, sections]);

  function handleJump(s: Section) {
    const targetIdx = spreads.findIndex(spread => {
      if (s.kind === 'cover') return spread.kind === 'cover';
      if (s.kind === 'inside-front') return spread.kind === 'inside-front';
      if (s.kind === 'back-cover') return spread.kind === 'back-cover';
      return (
        spread.kind === 'region' && spread.region === s.region && spread.continuationIndex === 0
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
    <div className="passport-light mt-6">
      <div
        ref={stripRef}
        role="tablist"
        aria-label="Passport sections"
        className="flex items-center gap-1 overflow-x-auto snap-x snap-mandatory px-4 sm:justify-center sm:overflow-visible sm:px-0"
      >
        {sections.map((s, i) => {
          const isActive = i === activeSectionIndex;
          return (
            <span
              key={`${s.kind}-${s.kind === 'region' ? s.region : ''}`}
              className="flex items-center"
            >
              {i > 0 && (
                <span aria-hidden className="text-brown-light/60 px-1 select-none">
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
