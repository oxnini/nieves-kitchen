'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { EXPLORER_TITLES, TIER_BADGES, type ExplorerTitle, type TitleTier } from '@/lib/passport';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Props {
  currentTitle: ExplorerTitle;
  totalStamps: number;
}

type TierState = 'completed' | 'current' | 'locked';

interface Pos {
  x: number;
  y: number;
}

const TIER_POSITIONS: Record<ExplorerTitle, Pos> = {
  'New Explorer':       { x: 10, y: 8 },
  'Curious Cook':       { x: 86, y: 15.5 },
  'Wanderer':           { x: 9, y: 35.6 },
  'Globetrotter':       { x: 84, y: 60 },
  'Culinary Diplomat':  { x: 8, y: 93 },
};

interface Segment {
  from: ExplorerTitle;
  to: ExplorerTitle;
  d: string;
}

const SEGMENTS: Segment[] = [
  {
    from: 'New Explorer',
    to: 'Curious Cook',
    d: 'M 18 8 C 34 8 60 18 84 14',
  },
  {
    from: 'Curious Cook',
    to: 'Wanderer',
    d: 'M 84 14 C 108 21 88 52 60 38 C 32 20 11 24 11 36',
  },
  {
    from: 'Wanderer',
    to: 'Globetrotter',
    d: 'M 11 34.6 C -3 48.6 0 85.6 24 67.6 C 44 54.6 62 53 92 60',
  },
  {
    from: 'Globetrotter',
    to: 'Culinary Diplomat',
    d: 'M 88 58.4 C 100 66.4 102 99.4 84 94.4 C 78 93.4 56 61.4 50 86.4 C 42 97.4 26 101.4 12 96.4',
  },
];

function getTierState(
  tier: TitleTier,
  currentTitle: ExplorerTitle,
  titles: TitleTier[],
): TierState {
  const currentIdx = titles.findIndex(t => t.title === currentTitle);
  const tierIdx = titles.findIndex(t => t.title === tier.title);
  if (tierIdx < currentIdx) return 'completed';
  if (tierIdx === currentIdx) return 'current';
  return 'locked';
}

function fullRequirements(tier: TitleTier): string {
  if (tier.minStamps === 0 && tier.minRegions === 0) return 'Starting tier';
  return `${tier.minStamps} stamp${tier.minStamps === 1 ? '' : 's'} · ${tier.minRegions} region${tier.minRegions === 1 ? '' : 's'}`;
}

function labelPlacement(title: ExplorerTitle): string {
  switch (title) {
    case 'New Explorer':
      return 'top-full mt-2 left-1/2 -translate-x-1/2 text-center';
    case 'Curious Cook':
      return 'bottom-full mb-2 right-0 text-right';
    case 'Wanderer':
      return 'top-[58%] -translate-y-1/2 left-full ml-1 text-left';
    case 'Globetrotter':
      return 'bottom-full mb-2 right-0 text-right';
    case 'Culinary Diplomat':
      return 'bottom-full mb-2 left-0 text-left';
  }
}

export default function TierLedger({ currentTitle, totalStamps }: Props) {
  const mobile = useIsMobile();
  if (mobile) return <CompactList currentTitle={currentTitle} />;
  return <JourneyMap currentTitle={currentTitle} totalStamps={totalStamps} />;
}

interface SegmentInfo {
  length: number;
  nodes: Array<{ x: number; y: number }>;
  progressPath: string;
}

function JourneyMap({ currentTitle, totalStamps }: Props) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [info, setInfo] = useState<SegmentInfo[]>(
    () => SEGMENTS.map(() => ({ length: 0, nodes: [], progressPath: '' })),
  );

  useEffect(() => {
    const result = SEGMENTS.map((seg, i): SegmentInfo => {
      const path = pathRefs.current[i];
      if (!path) return { length: 0, nodes: [], progressPath: '' };

      const length = path.getTotalLength();
      const fromTier = EXPLORER_TITLES.find(t => t.title === seg.from)!;
      const toTier = EXPLORER_TITLES.find(t => t.title === seg.to)!;

      const innerCount = toTier.minStamps - fromTier.minStamps - 1;
      const nodes = innerCount > 0
        ? Array.from({ length: innerCount }, (_, k) => {
            const dist = (length * (k + 1)) / (innerCount + 1);
            const p = path.getPointAtLength(dist);
            return { x: p.x, y: p.y };
          })
        : [];

      const gap = toTier.minStamps - fromTier.minStamps;
      const earned = Math.max(0, Math.min(gap, totalStamps - fromTier.minStamps));
      const progress = gap > 0 ? earned / gap : 0;

      let progressPath = '';
      if (progress > 0) {
        const fillLength = length * progress;
        const samples = 96;
        const pts: string[] = [];
        for (let s = 0; s <= samples; s++) {
          const dist = (fillLength * s) / samples;
          const p = path.getPointAtLength(dist);
          pts.push(`${p.x.toFixed(3)},${p.y.toFixed(3)}`);
        }
        progressPath = `M ${pts.join(' L ')}`;
      }

      return { length, nodes, progressPath };
    });
    setInfo(result);
  }, [totalStamps, SEGMENTS]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="text-brown-dark text-[11px] uppercase tracking-[0.18em] font-body font-semibold mb-2">
        Your Journey
      </div>
      <div className="relative flex-1 min-h-[440px]">
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {SEGMENTS.map((seg, i) => (
            <Fragment key={`path-${i}`}>
              <path
                ref={el => { pathRefs.current[i] = el; }}
                d={seg.d}
                fill="none"
                className="stroke-brown-light/50"
                strokeWidth="6.5"
                strokeDasharray="6 13"
                strokeLinecap="square"
                vectorEffect="non-scaling-stroke"
              />
              {info[i]?.progressPath && (
                <path
                  d={info[i].progressPath}
                  fill="none"
                  className="stroke-terracotta"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </Fragment>
          ))}
        </svg>

        {SEGMENTS.map((seg, i) => {
          const fromTier = EXPLORER_TITLES.find(t => t.title === seg.from)!;
          const earned = Math.max(0, totalStamps - fromTier.minStamps);
          const positions = info[i]?.nodes ?? [];
          return positions.map((p, k) => {
            const isFilled = k < earned;
            return (
              <span
                key={`node-${i}-${k}`}
                aria-hidden
                className={`absolute w-[12.5px] h-[12.5px] rounded-full -translate-x-1/2 -translate-y-1/2 z-[5] border-2 bg-parchment ${
                  isFilled ? 'border-terracotta' : 'border-brown-light/50'
                }`}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transition: 'border-color 300ms ease-out',
                }}
              />
            );
          });
        })}

        {EXPLORER_TITLES.map(tier => {
          const pos = TIER_POSITIONS[tier.title];
          const state = getTierState(tier, currentTitle, EXPLORER_TITLES);
          return (
            <div
              key={tier.title}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={tier.title}
            >
              <TierSlot tier={tier} state={state} />
              <div
                className={`absolute whitespace-nowrap pointer-events-none ${labelPlacement(tier.title)}`}
              >
                <div
                  className={`font-stamp uppercase tracking-[0.14em] text-[13px] leading-tight ${
                    state === 'locked' ? 'text-brown-medium/50' : 'text-brown-dark'
                  }`}
                >
                  {tier.title}
                </div>
                {tier.title !== 'New Explorer' && (
                  <div
                    className={`font-body text-[11px] leading-tight mt-0.5 ${
                      state === 'locked' ? 'text-brown-medium/40' : 'text-brown-medium'
                    }`}
                  >
                    {fullRequirements(tier)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TierSlot({ tier, state }: { tier: TitleTier; state: TierState }) {
  if (state === 'locked') {
    return (
      <span
        aria-hidden
        className="block w-[81px] h-[81px] rounded-full bg-parchment-dark/70 border border-dashed border-brown-light/50 shadow-[inset_0_1px_2px_rgba(62,39,35,0.06)]"
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`relative block w-[81px] h-[81px] rounded-full transition-shadow duration-300 ${
        state === 'current' ? 'ring-2 ring-terracotta/40 ring-offset-2 ring-offset-parchment' : ''
      }`}
    >
      <Image
        src={TIER_BADGES[tier.title]}
        alt=""
        fill
        sizes="81px"
        className="object-contain"
        unoptimized
      />
    </span>
  );
}

function CompactList({ currentTitle }: { currentTitle: ExplorerTitle }) {
  return (
    <div className="flex flex-col gap-0">
      <div className="text-brown-dark text-[11px] uppercase tracking-[0.18em] font-body font-semibold mb-3">
        Your Journey
      </div>
      <ol className="relative flex flex-col gap-3 pl-4 pb-3">
        {EXPLORER_TITLES.map((tier, i) => {
          const state = getTierState(tier, currentTitle, EXPLORER_TITLES);
          const isLast = i === EXPLORER_TITLES.length - 1;
          return (
            <li key={tier.title} className="relative flex items-start gap-3">
              {!isLast && (
                <span
                  aria-hidden
                  className={`absolute left-[7px] top-[20px] w-px h-[calc(100%+0.25rem)] border-l border-dotted ${
                    state === 'locked' ? 'border-brown-light/30' : 'border-terracotta/40'
                  }`}
                />
              )}
              <span
                aria-hidden
                className={`relative z-10 flex-shrink-0 w-[15px] h-[15px] rounded-[4px] mt-[3px] ${
                  state === 'completed'
                    ? 'bg-terracotta'
                    : state === 'current'
                      ? 'bg-terracotta ring-2 ring-terracotta/20'
                      : 'bg-parchment-dark'
                }`}
              />
              <div
                className={`flex flex-col gap-0.5 rounded-lg px-2.5 py-1.5 -mt-0.5 ${
                  state === 'current' ? 'bg-terracotta/[0.07]' : ''
                }`}
              >
                <span
                  className={`font-stamp uppercase tracking-[0.15em] text-sm leading-tight ${
                    state === 'locked' ? 'text-brown-medium/50' : 'text-brown-dark'
                  }`}
                >
                  {tier.title}
                </span>
                <span
                  className={`font-body text-xs leading-tight ${
                    state === 'locked' ? 'text-brown-medium/40' : 'text-brown-medium'
                  }`}
                >
                  {fullRequirements(tier)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
