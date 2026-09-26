import { Eyebrow } from '@/components/courtyard/Eyebrow';
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
    <header className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-end gap-5 sm:gap-8 border-b border-brown-dark pb-7">
      <div>
        <Eyebrow tone="muted">Nieves&#39;s Kitchen</Eyebrow>
        <h1
          className="mt-2.5 font-heading font-normal text-[clamp(2.6rem,5.4vw,4.2rem)] text-brown-dark"
          style={{ lineHeight: 1 }}
        >
          The Cook&#39;s Journal
        </h1>
        {keptSince && (
          <p className="mt-1 font-heading italic text-[17px] text-brown-medium">
            Kept since {keptSince}
          </p>
        )}
      </div>

      {hasStats && (
        <div className="flex gap-[22px] sm:gap-8">
          {stats.meals > 0 && (
            <JournalStat
              value={stats.meals}
              label={`${stats.meals === 1 ? 'meal' : 'meals'} cooked`}
            />
          )}
          {stats.dishes > 0 && (
            <JournalStat value={stats.dishes} label={stats.dishes === 1 ? 'dish' : 'dishes'} />
          )}
          {stats.countries > 0 && (
            <JournalStat
              value={stats.countries}
              label={stats.countries === 1 ? 'country' : 'countries'}
            />
          )}
        </div>
      )}
    </header>
  );
}
