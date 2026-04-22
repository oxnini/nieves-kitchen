'use client';

import { EXPLORER_TITLES, type ExplorerTitle, type TitleTier } from '@/lib/passport';

interface Props {
  currentTitle: ExplorerTitle;
}

type TierState = 'completed' | 'current' | 'locked';

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

function formatRequirements(tier: TitleTier): string {
  if (tier.minStamps === 0 && tier.minRegions === 0) return 'Starting tier';
  const parts: string[] = [];
  parts.push(`${tier.minStamps} stamp${tier.minStamps === 1 ? '' : 's'}`);
  parts.push(`${tier.minRegions} region${tier.minRegions === 1 ? '' : 's'}`);
  return parts.join(' \u00b7 ');
}

export default function TierLedger({ currentTitle }: Props) {
  return (
    <div className="flex flex-col gap-0 mt-6">
      <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-3">
        Journey
      </div>
      <ol className="relative flex flex-col gap-4 pl-4 pb-3">
        {EXPLORER_TITLES.map((tier, i) => {
          const state = getTierState(tier, currentTitle, EXPLORER_TITLES);
          const isLast = i === EXPLORER_TITLES.length - 1;

          return (
            <li key={tier.title} className="relative flex items-start gap-3">
              {/* Dotted connector line */}
              {!isLast && (
                <span
                  aria-hidden
                  className={`absolute left-[7px] top-[20px] w-px h-[calc(100%+0.25rem)] border-l border-dotted ${
                    state === 'locked'
                      ? 'border-brown-light/30'
                      : 'border-terracotta/40'
                  }`}
                />
              )}

              {/* Seal indicator */}
              <span
                aria-hidden
                className={`relative z-10 flex-shrink-0 w-[15px] h-[15px] rounded-full mt-[3px] border-[1.5px] ${
                  state === 'completed'
                    ? 'bg-terracotta border-terracotta'
                    : state === 'current'
                      ? 'bg-terracotta border-terracotta ring-2 ring-terracotta/20'
                      : 'bg-transparent border-brown-light/50'
                }`}
              />

              {/* Tier content */}
              <div
                className={`flex flex-col gap-0.5 rounded-lg px-2.5 py-1.5 -mt-0.5 ${
                  state === 'current' ? 'bg-terracotta/[0.07]' : ''
                }`}
              >
                <span
                  className={`font-stamp uppercase tracking-[0.15em] text-sm leading-tight ${
                    state === 'locked'
                      ? 'text-brown-medium/50'
                      : 'text-brown-dark'
                  }`}
                >
                  {tier.title}
                </span>
                <span
                  className={`font-body text-xs leading-tight ${
                    state === 'locked'
                      ? 'text-brown-medium/40'
                      : 'text-brown-medium'
                  }`}
                >
                  {formatRequirements(tier)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
