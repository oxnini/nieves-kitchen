import Link from 'next/link';
import type { JournalEntry } from '@/lib/journal';
import JournalDishMark from './JournalDishMark';

export interface JournalEntryRowProps {
  entry: JournalEntry;
}

/**
 * One row in the Log feed: ledger date, dish mark, title link, and (when
 * present) the derived margin note. Re-cooks are styled quietly (a dimmer
 * date) but never diminished — same type size, same link treatment as any
 * other entry. Origin-less (null-country) dishes sit at full dignity too;
 * `JournalDishMark` already handles that branch.
 */
export default function JournalEntryRow({ entry }: JournalEntryRowProps) {
  return (
    <li className="flex items-start gap-4 py-4 border-b border-dotted border-brown-light/40 last:border-b-0">
      <span
        className={`font-stamp text-[11px] nums-tabular shrink-0 w-[6.5rem] pt-1 ${
          entry.isReCook ? 'text-brown-medium/60' : 'text-brown-medium'
        }`}
      >
        {formatLedger(entry.cookedAt)}
      </span>

      <JournalDishMark country={entry.country} title={entry.title} size={48} />

      <div className="flex-1 min-w-0 pt-0.5">
        <Link
          href={`/recipes/${encodeURIComponent(entry.slug)}`}
          className="font-heading text-lg text-brown-dark hover:text-terracotta transition-colors leading-snug"
        >
          {entry.title}
        </Link>
        {entry.marginNote !== '' && (
          <p className="font-body text-sm text-brown-medium italic mt-1">{entry.marginNote}</p>
        )}
      </div>
    </li>
  );
}

/** "APR 18 2026" — mirrors the ledger date treatment in StampedRecipesModal. */
function formatLedger(iso: string): string {
  return new Date(iso)
    .toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
    .toUpperCase()
    .replace(',', '');
}
