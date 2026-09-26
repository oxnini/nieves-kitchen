import { Eyebrow } from '@/components/courtyard/Eyebrow';
import type { JournalEntry } from '@/lib/journal';
import JournalEntryRow from './JournalEntryRow';

export interface JournalLogProps {
  entries: JournalEntry[];
}

interface MonthGroup {
  /** Local-basis `YYYY-MM` group key. */
  key: string;
  /** "Month YYYY" divider label, from the same local components. */
  label: string;
  entries: JournalEntry[];
}

/**
 * The Log: a reverse-chronological feed of every cook (including re-cooks),
 * grouped by month, with its own section head ("The log" / "N meals",
 * Phase 8 restyle R102). `entries` arrive newest-first from
 * `buildJournalEntries`, and grouping preserves that order, so months
 * descend naturally without any extra sorting. Renders all entries — no
 * windowing/pagination at this scale (YAGNI). Renders nothing (head
 * included) when there are no entries yet; the empty state is the
 * masthead's job.
 *
 * Month grouping uses the cook's LOCAL calendar day (same basis as each row's
 * date), so a row's date can never fall outside the month header it sits
 * under, regardless of the viewer's timezone.
 */
export default function JournalLog({ entries }: JournalLogProps) {
  if (entries.length === 0) return null;

  const groups = groupByMonth(entries);

  return (
    <section className="flex flex-col gap-1.5">
      <h2 className="font-heading font-normal text-[25px] text-brown-dark mb-1.5 pb-2.5 border-b border-teal flex justify-between items-baseline gap-4">
        The log
        <small className="font-body text-[13.5px] font-normal text-brown-medium">
          {plural(entries.length, 'meal', 'meals')}
        </small>
      </h2>

      {groups.map((group) => (
        <section key={group.key} className="mb-8 last:mb-0">
          <h3 className="mt-5 mb-2 first:mt-0">
            <Eyebrow as="span">{group.label}</Eyebrow>
          </h3>
          <ul className="flex flex-col">
            {group.entries.map((entry) => (
              <JournalEntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}

function plural(n: number, singular: string, pluralWord: string): string {
  return `${n} ${n === 1 ? singular : pluralWord}`;
}

/**
 * Groups entries by local-timezone month, preserving input order. Key and
 * label both derive from `new Date(cookedAt)` local components — the same
 * basis as each row's date — so a September-header group only ever holds
 * rows whose local date is in September. Given newest-first input,
 * local-month keys stay monotonically descending. Label is normal case
 * ("September 2026"); `Eyebrow` applies the visual uppercase transform.
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
        label: d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
        entries: [entry],
      });
    }
  }
  return Array.from(groups.values());
}
