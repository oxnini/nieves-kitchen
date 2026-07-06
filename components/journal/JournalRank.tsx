import { EXPLORER_TITLES, type PassportSummary } from '@/lib/passport';

export interface JournalRankProps {
  summary: PassportSummary;
}

/**
 * The journal's rank block (Edition 2, "type-first"): the earned title set in
 * the stamped mono face, two progress meters toward the next title (countries
 * and regions — tiers are two-dimensional, so a single bar would lie), a
 * plain-language "toward" line, and the full title ladder as a trail of
 * passed -> current -> ahead. No badge art (the flat tier WebPs were dropped).
 * At the highest tier the meters and toward-line give way to a closing line.
 */
export default function JournalRank({ summary }: JournalRankProps) {
  const { title, nextTier, totalStamps, regionsTouched } = summary;
  const countries = totalStamps;
  const regions = regionsTouched.size;
  const currentIndex = EXPLORER_TITLES.findIndex((t) => t.title === title);

  return (
    <section className="flex flex-col gap-5 border-t border-b border-brown-light/40 py-6">
      <div>
        <div className="font-stamp text-[10px] uppercase tracking-[0.24em] text-brown-medium/80">
          Your title
        </div>
        <div className="mt-1.5 font-stamp uppercase tracking-[0.16em] text-2xl sm:text-3xl text-brown-dark">
          {title}
        </div>
      </div>

      {nextTier ? (
        <>
          <div className="flex flex-wrap gap-6">
            <Meter label="Countries" value={countries} min={nextTier.minStamps} tone="terracotta" />
            <Meter label="Regions" value={regions} min={nextTier.minRegions} tone="teal" />
          </div>
          <p className="font-body text-sm text-brown-medium">
            {nextTierPhrase(countries, regions, nextTier.minStamps, nextTier.minRegions)} to{' '}
            <span className="font-semibold text-brown-dark">{nextTier.title}</span>.
          </p>
        </>
      ) : (
        <p className="font-body text-sm text-brown-medium">
          You&rsquo;ve reached the highest title. The world is yours.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-stamp text-[10px] uppercase tracking-[0.08em]">
        {EXPLORER_TITLES.map((tier, i) => (
          <span key={tier.title} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-brown-light/60" aria-hidden>
                —
              </span>
            )}
            <span
              className={
                i < currentIndex
                  ? 'text-brown-medium'
                  : i === currentIndex
                    ? 'rounded border border-brown-light/50 px-2 py-[3px] tracking-[0.12em] text-brown-dark'
                    : 'text-brown-light'
              }
            >
              {tier.title}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

function Meter({
  label,
  value,
  min,
  tone,
}: {
  label: string;
  value: number;
  min: number;
  tone: 'terracotta' | 'teal';
}) {
  const filled = Math.min(value, min);
  const onClass = tone === 'terracotta' ? 'bg-terracotta border-terracotta' : 'bg-teal border-teal';
  return (
    <div className="min-w-[8.5rem] flex-1">
      <div className="mb-1.5 flex items-baseline justify-between font-stamp text-[10px] uppercase tracking-wider text-brown-medium">
        <span>{label}</span>
        <span className="nums-tabular text-brown-dark">
          {value} / {min}
        </span>
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: min }).map((_, i) => (
          <span
            key={i}
            className={`h-[7px] flex-1 rounded-[1px] border ${
              i < filled ? onClass : 'border-brown-light/30 bg-surface-alt'
            }`}
          />
        ))}
      </div>
    </div>
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
