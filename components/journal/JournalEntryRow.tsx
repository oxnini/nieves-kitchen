import Link from 'next/link';
import type { JournalEntry } from '@/lib/journal';
import JournalDishMark from './JournalDishMark';

export interface JournalEntryRowProps {
  entry: JournalEntry;
}

/**
 * One row in the Log, rendered as a wide-ledger line: ledger date, dish mark,
 * title, then — only when the entry earned a margin note — a dotted leader
 * running across to the note set flush-right, like an index or a printed menu.
 * Rows with no note simply end at the title; the leader is never drawn pointing
 * at an empty margin. On narrow screens the row wraps and the note drops to its
 * own line beneath the title.
 *
 * Re-cooks are styled quietly (a dimmer date) but never diminished — same type
 * size, same link treatment as any other entry. Origin-less (null-country)
 * dishes sit at full dignity too; `JournalDishMark` handles that branch.
 */
export default function JournalEntryRow({ entry }: JournalEntryRowProps) {
  const hasNote = entry.marginNote !== '';

  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3.5 border-b border-dotted border-brown-light/40 last:border-b-0 sm:flex-nowrap sm:gap-4">
      <span
        className={`font-stamp text-[11px] nums-tabular shrink-0 w-[4.75rem] self-center ${
          entry.isReCook ? 'text-brown-medium/60' : 'text-brown-medium'
        }`}
      >
        {formatLedger(entry.cookedAt)}
      </span>

      <span className="shrink-0 self-center">
        <JournalDishMark country={entry.country} title={entry.title} size={44} />
      </span>

      <Link
        href={`/recipes/${encodeURIComponent(entry.slug)}`}
        className="font-heading text-lg text-brown-dark hover:text-terracotta transition-colors leading-snug shrink-0"
      >
        {entry.title}
      </Link>

      {hasNote && (
        <>
          <span
            aria-hidden
            className="hidden shrink min-w-[1.5rem] flex-1 self-center translate-y-[0.15rem] border-b border-dotted border-brown-light/60 sm:block"
          />
          <p className="basis-full shrink-0 pl-[4.75rem] font-body text-sm text-brown-medium italic sm:basis-auto sm:pl-0 sm:text-right">
            {entry.marginNote}
          </p>
        </>
      )}
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
