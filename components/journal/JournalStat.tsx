export interface JournalStatProps {
  value: number;
  label: string;
}

/**
 * A single tally in the journal's stat row (meals cooked, dishes, countries
 * cooked from). Purely presentational — the caller decides whether to render it
 * at all (omit when `value` is 0 so the row only counts up, never down to
 * zero).
 */
export default function JournalStat({ value, label }: JournalStatProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="font-heading text-3xl sm:text-4xl text-brown-dark nums-tabular">
        {value}
      </span>
      <span className="font-stamp text-[11px] text-brown-medium">{label}</span>
    </div>
  );
}
