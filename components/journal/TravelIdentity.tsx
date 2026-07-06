import { type ExplorerTitle } from '@/lib/passport';

export interface TravelIdentityProps {
  /** The cook's current earned title (`summary.title`). */
  title: ExplorerTitle;
}

/**
 * The journal's earned travel identity, rendered purely as type: the current
 * explorer title set in the stamped mono face, with a quiet line beneath. No
 * badge art, no tier ladder, no "next tier" line, no "N to go" copy — the
 * journal is an additive mirror of what's been cooked, not a progress
 * scoreboard (see feedback_journal_additive_not_scoreboard.md). `TierLedger`
 * stays around only as the `/dev/journal` reference variant.
 *
 * The tier-badge graphics were removed deliberately; if a badge treatment
 * returns it should be freshly rendered art, not the old passport-tier WebPs.
 */
export default function TravelIdentity({ title }: TravelIdentityProps) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <p className="font-stamp uppercase tracking-[0.22em] text-xl sm:text-2xl text-brown-dark">
        {title}
      </p>
      <p className="font-body text-sm text-brown-medium">
        Your title, earned one dish at a time.
      </p>
    </div>
  );
}
