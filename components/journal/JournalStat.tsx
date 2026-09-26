export interface JournalStatProps {
  value: number;
  /** Lowercase, already singular/plural-resolved by the caller, e.g. "meals cooked" or "meal cooked". */
  label: string;
}

/**
 * A single tally in the journal's stat row (meals cooked, dishes, countries
 * cooked from). Purely presentational — the caller decides whether to render it
 * at all (omit when `value` is 0 so the row only counts up, never down to
 * zero) and resolves the singular/plural label text.
 */
export default function JournalStat({ value, label }: JournalStatProps) {
  return (
    <div className="flex flex-col gap-1 text-left sm:text-right">
      <span className="font-heading font-light text-[32px] sm:text-[40px] leading-none text-brown-dark nums-tabular">
        {value}
      </span>
      <span className="font-body text-[13px] text-brown-medium">{label}</span>
    </div>
  );
}
