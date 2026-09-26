import Link from 'next/link';
import type { JournalEntry } from '@/lib/journal';
import JournalDishMark from './JournalDishMark';

export interface JournalEntryRowProps {
  entry: JournalEntry;
}

/**
 * One row in the Log: a `[mark | dish + note | date]` grid (Phase 8
 * restyle, R100) — mark left, the dish title and its derived note stacked in
 * the middle column, the cook date set right in italic serif. On narrow
 * screens the date drops under the dish column instead of a third track.
 *
 * The note line reads "<Country>. <Note>" (R99): country alone when the
 * entry earned no note, the note alone for origin-less (null-country)
 * dishes, and nothing when there's neither. `lib/journal.ts`'s `marginNote`
 * strings are lowercase sentence fragments; this row capitalises the first
 * letter for display.
 *
 * Re-cooks are styled quietly (a dimmer date) but never diminished — same
 * type size, same link treatment as any other entry.
 */
export default function JournalEntryRow({ entry }: JournalEntryRowProps) {
  const noteLine = buildNoteLine(entry);

  return (
    <li className="grid grid-cols-[60px_minmax(0,1fr)] sm:grid-cols-[60px_minmax(0,1fr)_auto] gap-x-[14px] sm:gap-x-[18px] gap-y-1 items-center py-3 border-b border-line last:border-b-0">
      <span>
        <JournalDishMark country={entry.country} title={entry.title} size={60} />
      </span>

      <div className="min-w-0 flex flex-col gap-0.5">
        <Link
          href={`/recipes/${encodeURIComponent(entry.slug)}`}
          className="font-heading text-[19px] sm:text-[21px] leading-[1.25] text-brown-dark hover:text-terracotta transition-colors"
        >
          {entry.title}
        </Link>
        {noteLine && (
          <span className="font-body text-[13.5px] text-brown-medium">{noteLine}</span>
        )}
      </div>

      <span
        className={`col-start-2 row-start-2 sm:col-start-3 sm:row-start-1 -mt-1.5 sm:mt-0 font-heading italic text-[14px] sm:text-[15.5px] whitespace-nowrap justify-self-start sm:justify-self-end ${
          entry.isReCook ? 'text-brown-medium/60' : 'text-brown-medium'
        }`}
      >
        {formatLedger(entry.cookedAt)}
      </span>
    </li>
  );
}

/** "<Country>. <Note>", country alone, note alone, or null when neither exists. */
function buildNoteLine(entry: JournalEntry): string | null {
  const note = entry.marginNote ? capitalize(entry.marginNote) : '';
  if (entry.country && note) return `${entry.country}. ${note}`;
  if (entry.country) return entry.country;
  if (note) return note;
  return null;
}

function capitalize(s: string): string {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * "22 Sept" — the cook date set flush-right in the log row. The year is
 * shown only when it differs from the current year ("22 Sept 2025"), so a
 * long-lived journal doesn't show identical-looking dates across years
 * while a fresh one (all current-year, matching the configurator) stays
 * terse (R113).
 */
function formatLedger(iso: string): string {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString(undefined, opts);
}
