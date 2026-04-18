'use client';

import Link from 'next/link';
import type { PassportSummary } from '@/lib/passport';

interface Props {
  summary: PassportSummary;
}

const HIGHLIGHT_COUNT = 5;

export default function BackCoverSpread({ summary }: Props) {
  const all: Array<{ country: string; slug: string; cookedAt: string }> = [];
  for (const [country, stamps] of summary.stampsPerCountry) {
    for (const s of stamps) {
      all.push({ country, slug: s.recipe_slug, cookedAt: s.cooked_at });
    }
  }
  all.sort((a, b) => b.cookedAt.localeCompare(a.cookedAt));
  const recent = all.slice(0, HIGHLIGHT_COUNT);

  return (
    <div className="grid md:grid-cols-2 h-full w-full gap-6">
      <div className="flex flex-col">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Highlights
        </div>
        <h2 className="font-heading text-2xl font-bold text-brown-dark mb-4">
          Recent stamps
        </h2>
        {recent.length === 0 && (
          <p className="text-sm text-brown-medium">No stamps yet. Your journey starts with a single recipe.</p>
        )}
        <ul className="space-y-2">
          {recent.map(r => (
            <li key={r.slug + r.cookedAt} className="flex items-baseline justify-between gap-3 border-b border-dotted border-brown-light/50 pb-1.5">
              <Link href={`/recipes/${r.slug}`} className="font-heading text-sm text-brown-dark hover:text-terracotta truncate">
                {r.country}
              </Link>
              <span className="text-xs text-brown-medium font-body whitespace-nowrap">
                {new Date(r.cookedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-start justify-center">
        <p className="font-heading italic text-lg text-brown-dark leading-relaxed mb-6">
          &ldquo;Every meal is a small expedition.&rdquo;
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 bg-terracotta text-parchment px-5 py-3 rounded-xl font-medium shadow hover:bg-terracotta/90 transition-colors"
        >
          Browse more recipes →
        </Link>
      </div>
    </div>
  );
}
