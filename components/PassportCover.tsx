'use client';

import { Stamp } from 'lucide-react';
import type { PassportSummary } from '@/lib/passport';

export default function PassportCover({ summary }: { summary: PassportSummary }) {
  const { totalStamps, uniqueCountries, regionsTouched, title, nextTier } = summary;

  return (
    <div className="bg-gradient-to-br from-terracotta to-paprika rounded-3xl shadow-xl p-8 sm:p-10 text-parchment">
      <div className="flex items-center gap-2 text-parchment/80 text-sm font-medium tracking-wide uppercase">
        <Stamp size={14} />
        Culinary Passport
      </div>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-1 mb-6">
        Your travels in food
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Stamps" value={totalStamps} />
        <Stat label="Countries" value={uniqueCountries.size} />
        <Stat label="Regions" value={regionsTouched.size} />
      </div>

      <div className="bg-brown-dark/25 rounded-2xl p-4">
        <div className="text-xs text-parchment/70 uppercase tracking-wide font-semibold">
          Current title
        </div>
        <div className="font-heading text-xl font-bold mt-0.5">{title}</div>
        {nextTier && (
          <div className="text-sm text-parchment/80 mt-2">
            Next: <span className="font-semibold text-turmeric">{nextTier.title}</span>
            {' — '}
            {progressHint(totalStamps, regionsTouched.size, nextTier.minStamps, nextTier.minRegions)}
          </div>
        )}
        {!nextTier && (
          <div className="text-sm text-parchment/80 mt-2">
            You&apos;ve reached the highest title. The world is yours 🌍
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-brown-dark/20 rounded-2xl px-4 py-3">
      <div className="font-heading text-3xl font-bold">{value}</div>
      <div className="text-xs text-parchment/75 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function progressHint(
  stamps: number,
  regions: number,
  minStamps: number,
  minRegions: number,
): string {
  const stampsNeeded = Math.max(0, minStamps - stamps);
  const regionsNeeded = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (stampsNeeded > 0) parts.push(`${stampsNeeded} more stamp${stampsNeeded === 1 ? '' : 's'}`);
  if (regionsNeeded > 0) parts.push(`${regionsNeeded} more region${regionsNeeded === 1 ? '' : 's'}`);
  return parts.length ? parts.join(' and ') + ' to go' : 'unlocked on next cook';
}
