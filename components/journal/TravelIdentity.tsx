import Image from 'next/image';
import { EXPLORER_TITLES, TIER_BADGES, type ExplorerTitle } from '@/lib/passport';

export interface TravelIdentityProps {
  /** The cook's current earned title (`summary.title`). */
  title: ExplorerTitle;
}

/**
 * The journal's earned travel identity: the current explorer title shown as
 * a warm, retrospective badge, with any lower rungs already passed shown as
 * a quiet completed trail beneath.
 *
 * Deliberately NOT `TierLedger`: no locked future tiers, no requirements,
 * no "next tier" line, no "N to go" copy. The journal is an additive
 * mirror of what's been cooked, not a progress scoreboard (see
 * feedback_journal_additive_not_scoreboard.md) — `TierLedger` stays around
 * only as the `/dev/journal` reference variant.
 */
export default function TravelIdentity({ title }: TravelIdentityProps) {
  const currentIndex = EXPLORER_TITLES.findIndex((t) => t.title === title);
  const rungs = currentIndex >= 0 ? EXPLORER_TITLES.slice(0, currentIndex + 1) : [];
  const trail = rungs.slice(0, -1);

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="passport-light bg-parchment rounded-full p-3 shadow-sm">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          <Image
            src={TIER_BADGES[title]}
            alt=""
            fill
            sizes="112px"
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <div>
        <p className="font-stamp uppercase tracking-[0.2em] text-lg sm:text-xl text-brown-dark">
          {title}
        </p>
        <p className="font-body text-sm text-brown-medium mt-1">
          Your title, earned one dish at a time.
        </p>
      </div>

      {trail.length > 0 && (
        <div
          className="flex items-center gap-3 mt-2"
          aria-label="Titles earned along the way"
        >
          {trail.map((tier) => (
            <div
              key={tier.title}
              className="passport-light bg-parchment rounded-full p-1.5 opacity-70"
              title={tier.title}
            >
              <div className="relative w-8 h-8">
                <Image
                  src={TIER_BADGES[tier.title]}
                  alt={tier.title}
                  fill
                  sizes="32px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
