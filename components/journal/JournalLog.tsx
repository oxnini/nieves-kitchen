import type { JournalEntry } from '@/lib/journal';
import JournalEntryRow from './JournalEntryRow';

export interface JournalLogProps {
  entries: JournalEntry[];
}

interface MonthGroup {
  /** Local-basis `YYYY-MM` group key. */
  key: string;
  /** "MONTH YYYY" divider label, from the same local components. */
  label: string;
  entries: JournalEntry[];
}

/**
 * The Log: a reverse-chronological feed of every cook (including re-cooks),
 * grouped by month. `entries` arrive newest-first from `buildJournalEntries`,
 * and grouping preserves that order, so months descend naturally without any
 * extra sorting. Renders all entries — no windowing/pagination at this scale
 * (YAGNI). Renders nothing when there are no entries yet; the empty state is
 * the masthead's job (a later task).
 *
 * Month grouping uses the cook's LOCAL calendar day (same basis as each row's
 * `formatLedger` date), so a row's date can never fall outside the month
 * header it sits under, regardless of the viewer's timezone.
 */
export default function JournalLog({ entries }: JournalLogProps) {
  if (entries.length === 0) return null;

  const groups = groupByMonth(entries);

  return (
    <div className="flex flex-col">
      {groups.map((group) => (
        <section key={group.key} className="mb-10 last:mb-0">
          <h2 className="font-stamp text-xs tracking-[0.28em] text-brown-medium mb-3">
            {group.label}
          </h2>
          <ul className="flex flex-col">
            {group.entries.map((entry) => (
              <JournalEntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * Groups entries by local-timezone month, preserving input order. Key and
 * label both derive from `new Date(cookedAt)` local components — the same
 * basis as `JournalEntryRow`'s `formatLedger` — so a February-header group
 * only ever holds rows whose local date is in February. Given newest-first
 * input, local-month keys stay monotonically descending.
 */
function groupByMonth(entries: JournalEntry[]): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();
  for (const entry of entries) {
    const d = new Date(entry.cookedAt);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-11, local
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const existing = groups.get(key);
    if (existing) {
      existing.entries.push(entry);
    } else {
      groups.set(key, {
        key,
        label: d
          .toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
          .toUpperCase(),
        entries: [entry],
      });
    }
  }
  return Array.from(groups.values());
}
