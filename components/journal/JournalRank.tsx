import { EXPLORER_TITLES, type PassportSummary } from '@/lib/passport';
import JournalSectionHead, { plural } from './JournalSectionHead';

export interface JournalRankProps {
  summary: PassportSummary;
}

/**
 * The journal's "Titles" contents page (Phase 8 restyle): the five-title
 * ladder as a ruled list, the current title marked with a small terracotta
 * diamond and "Your title", titles ahead showing their country + region
 * needs, and one "N more ... to <next>" line. No meters, no title trail —
 * the universal linear ladder is allowed (it's not "parts that aren't
 * yours"), but progress within it reads as plain language, not a bar.
 */
export default function JournalRank({ summary }: JournalRankProps) {
  const { title, nextTier, totalStamps, regionsTouched } = summary;
  const countries = totalStamps;
  const regions = regionsTouched.size;
  const currentIndex = EXPLORER_TITLES.findIndex((t) => t.title === title);

  return (
    <section className="flex flex-col gap-1.5">
      <JournalSectionHead title="Titles" count="countries and regions cooked" />

      <ol className="list-none m-0 p-0">
        {EXPLORER_TITLES.map((tier, i) => {
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isAhead = i > currentIndex;
          const requirement = isCurrent
            ? 'Your title'
            : tier.minStamps === 0
              ? 'Where everyone starts'
              : `${plural(tier.minStamps, 'country', 'countries')}, ${plural(tier.minRegions, 'region', 'regions')}`;

          return (
            <li
              key={tier.title}
              aria-current={isCurrent ? 'true' : undefined}
              className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 py-[11px] border-b border-line ${
                isAhead ? 'opacity-[.62]' : ''
              }`}
            >
              <span
                className={`font-heading text-[21px] inline-flex items-baseline gap-2.5 ${
                  isPast ? 'text-brown-medium' : 'text-brown-dark'
                }`}
              >
                {isCurrent && (
                  <span
                    aria-hidden
                    className="inline-block w-[9px] h-[9px] bg-terracotta rotate-45 shrink-0"
                  />
                )}
                {tier.title}
              </span>
              <span
                aria-hidden
                className="hidden min-[441px]:block flex-1 min-w-[12px] -translate-y-1 border-b border-dotted border-brown-medium/50"
              />
              <span
                className={`w-full min-[441px]:w-auto text-left min-[441px]:text-right font-body text-sm ${
                  isCurrent ? 'text-terracotta font-semibold' : 'text-brown-medium'
                }`}
              >
                {requirement}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-1 font-body text-[15px] text-brown-medium">
        {nextTier ? (
          <>
            {nextTierPhrase(countries, regions, nextTier.minStamps, nextTier.minRegions)} to{' '}
            <span className="font-semibold text-brown-dark">{nextTier.title}</span>.
          </>
        ) : (
          <>You&rsquo;ve reached the highest title. The world is yours.</>
        )}
      </p>
    </section>
  );
}

/** "3 more countries and 1 region", singular-aware; "One more cook" when both met. */
function nextTierPhrase(
  countries: number,
  regions: number,
  minCountries: number,
  minRegions: number,
): string {
  const c = Math.max(0, minCountries - countries);
  const r = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (c > 0) parts.push(`${c} more ${c === 1 ? 'country' : 'countries'}`);
  if (r > 0) parts.push(`${r} ${r === 1 ? 'region' : 'regions'}`);
  if (parts.length === 0) return 'One more cook';
  return parts.join(' and ');
}
