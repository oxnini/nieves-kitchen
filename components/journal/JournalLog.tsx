import type { JournalEntry } from '@/lib/journal';
import JournalEntryRow from './JournalEntryRow';

export interface JournalLogProps {
  entries: JournalEntry[];
}

/**
 * The Log: a reverse-chronological feed of every cook (including re-cooks),
 * grouped by month. `entries` arrive newest-first from `buildJournalEntries`,
 * and grouping preserves that order, so months descend naturally without any
 * extra sorting. Renders all entries — no windowing/pagination at this scale
 * (YAGNI). Renders nothing when there are no entries yet; the empty state is
 * the masthead's job (a later task).
 */
export default function JournalLog({ entries }: JournalLogProps) {
  if (entries.length === 0) return null;

  const groups = groupByMonth(entries);

  return (
    <div className="flex flex-col">
      {groups.map(([monthKey, monthEntries]) => (
        <section key={monthKey} className="mb-10 last:mb-0">
          <h2 className="font-stamp text-xs tracking-[0.28em] text-brown-medium mb-3">
            {formatMonthLabel(monthKey)}
          </h2>
          <ul className="flex flex-col">
            {monthEntries.map((entry) => (
              <JournalEntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Groups entries by `YYYY-MM` (derived from `cookedAt`), preserving input order. */
function groupByMonth(entries: JournalEntry[]): [string, JournalEntry[]][] {
  const groups = new Map<string, JournalEntry[]>();
  for (const entry of entries) {
    const key = entry.cookedAt.slice(0, 7); // YYYY-MM
    const bucket = groups.get(key);
    if (bucket) bucket.push(entry);
    else groups.set(key, [entry]);
  }
  return Array.from(groups.entries());
}

/** "2026-04" -> "APRIL 2026". Built from local y/m components, no timezone shift. */
function formatMonthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase();
}
