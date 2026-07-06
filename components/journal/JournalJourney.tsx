import type { JourneyRecap } from '@/lib/journal';

export interface JournalJourneyProps {
  recap: JourneyRecap;
}

/**
 * "Journey so far": a small retrospective recap ledger. Each row is a
 * LABEL … value pair. Rows that would be empty or redundant (most-recent when
 * there is only one cook, most-cooked when nothing has been repeated) are
 * omitted upstream by `buildJourneyRecap` returning null for them.
 */
export default function JournalJourney({ recap }: JournalJourneyProps) {
  const rows: { k: string; v: string }[] = [
    { k: 'First cook', v: `${recap.firstCook.title} · ${formatDay(recap.firstCook.cookedAt)}` },
  ];
  if (recap.mostRecent) {
    rows.push({
      k: 'Most recent',
      v: `${recap.mostRecent.title} · ${formatDay(recap.mostRecent.cookedAt)}`,
    });
  }
  if (recap.topRegion) {
    rows.push({
      k: 'Top region',
      v: `${recap.topRegion.region} · ${recap.topRegion.count} ${recap.topRegion.count === 1 ? 'dish' : 'dishes'}`,
    });
  }
  if (recap.mostCooked) {
    rows.push({ k: 'Most cooked', v: `${recap.mostCooked.title} · ${recap.mostCooked.count}×` });
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-stamp text-xs uppercase tracking-[0.28em] text-brown-medium">
        Journey so far
      </h2>
      <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.k}
            className="flex items-baseline justify-between gap-4 border-b border-dotted border-brown-light/40 py-2"
          >
            <dt className="font-stamp text-[10px] uppercase tracking-wider text-brown-medium">
              {row.k}
            </dt>
            <dd className="font-heading text-sm text-brown-dark text-right">{row.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** "18 Apr" — short retrospective day. */
function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
