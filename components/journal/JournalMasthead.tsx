import JournalStat from './JournalStat';

export interface JournalMastheadProps {
  stats: {
    meals: number;
    dishes: number;
    countries: number;
  };
  /** "February 2026" — the month the journal was first kept (earliest cook).
   *  Omitted in the empty/nascent state, where nothing has been kept yet. */
  keptSince?: string;
}

/**
 * The journal's masthead: "who you are" (design brief §4.1). Just the
 * title and an only-counts-up stats row — `meals`/`dishes`/`countries` each
 * render only when > 0, so a brand-new cook never sees a row of zeroes.
 *
 * No cook name/handle line: there is no name/handle data source in the app
 * today (no user profile system), so per §4.1's "if available" clause this
 * intentionally has no prop for it and renders nothing in its place — add
 * a handle prop here (never a placeholder) once that data exists.
 *
 * Never a "next tier" / "N from the next title" line — that forward pull
 * lives on the Atlas, not here (§4.1, and the additive-mirror rule in
 * feedback_journal_additive_not_scoreboard.md).
 */
export default function JournalMasthead({ stats, keptSince }: JournalMastheadProps) {
  const hasStats = stats.meals > 0 || stats.dishes > 0 || stats.countries > 0;

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b-2 border-brown-dark pb-4">
      <div>
        <div className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80">
          Nieves&#39; Kitchen
        </div>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl font-bold text-brown-dark tracking-tight leading-[1.05]">
          The Cook&#39;s Journal
        </h1>
        {keptSince && (
          <div className="mt-2.5 font-stamp text-[10px] uppercase tracking-[0.18em] text-brown-medium/70">
            Kept since {keptSince}
          </div>
        )}
      </div>

      {hasStats && (
        <div className="flex items-end gap-6 sm:gap-9">
          {stats.meals > 0 && <JournalStat value={stats.meals} label="MEALS COOKED" />}
          {stats.dishes > 0 && <JournalStat value={stats.dishes} label="DISHES" />}
          {stats.countries > 0 && (
            <JournalStat value={stats.countries} label="COUNTRIES" />
          )}
        </div>
      )}
    </header>
  );
}
