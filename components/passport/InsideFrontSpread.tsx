'use client';

import type { PassportSummary } from '@/lib/passport';
import type { PageDescriptor } from './hooks/usePassportPages';

interface Props {
  summary: PassportSummary;
  pages: PageDescriptor[];
  onJumpToSubRegion: (pageIndex: number) => void;
  stampsPerCountry: PassportSummary['stampsPerCountry'];
}

export default function InsideFrontSpread({
  summary, pages, onJumpToSubRegion, stampsPerCountry,
}: Props) {
  const { totalStamps, uniqueCountries, regionsTouched, title, nextTier } = summary;
  return (
    <div className="grid md:grid-cols-2 h-full w-full gap-6">
      <div className="flex flex-col">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Traveler profile
        </div>
        <h2 className="font-heading text-3xl font-bold text-brown-dark mb-4">
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Stamps" value={totalStamps} />
          <Stat label="Countries" value={uniqueCountries.size} />
          <Stat label="Regions" value={regionsTouched.size} />
        </div>
        {nextTier && (
          <div className="text-sm text-brown-medium font-body">
            Next: <span className="font-semibold text-brown-dark">{nextTier.title}</span> —{' '}
            <ProgressHint
              stamps={totalStamps}
              regions={regionsTouched.size}
              minStamps={nextTier.minStamps}
              minRegions={nextTier.minRegions}
            />
          </div>
        )}
        {!nextTier && (
          <div className="text-sm text-brown-medium font-body">
            You&apos;ve reached the highest title. The world is yours.
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Contents
        </div>
        <ul className="space-y-1.5 overflow-y-auto pr-1">
          {pages.map((p, i) =>
            p.kind === 'sub-region' ? (
              <li key={p.subRegion}>
                <button
                  type="button"
                  onClick={() => onJumpToSubRegion(i)}
                  className="w-full flex items-baseline justify-between gap-3 py-1.5 border-b border-dotted border-brown-light/50 hover:text-terracotta text-left"
                >
                  <span className="font-heading text-sm text-brown-dark truncate">
                    {p.subRegion.replace(' (sub)', '')}
                  </span>
                  <span className="font-body text-xs text-brown-medium whitespace-nowrap">
                    {p.countries.filter(c => (stampsPerCountry.get(c)?.length ?? 0) > 0).length}
                    {' / '}{p.countries.length}
                  </span>
                </button>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-brown-dark/5 rounded-xl px-3 py-2">
      <div className="font-heading text-2xl font-bold text-brown-dark leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-brown-medium mt-1 font-body">{label}</div>
    </div>
  );
}

function ProgressHint({
  stamps, regions, minStamps, minRegions,
}: { stamps: number; regions: number; minStamps: number; minRegions: number }) {
  const s = Math.max(0, minStamps - stamps);
  const r = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (s > 0) parts.push(`${s} stamp${s === 1 ? '' : 's'}`);
  if (r > 0) parts.push(`${r} region${r === 1 ? '' : 's'}`);
  return <>{parts.length ? `${parts.join(' and ')} to go` : 'unlocked on next cook'}</>;
}
