import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import {
  PROMISE_HEADLINE,
  PROMISE_INTRO,
  METHODOLOGY,
  DIFFERING_OPINIONS_NOTE,
  INGREDIENT_GUIDE,
  STATUS_LABEL,
  type HalalStatus,
} from '@/lib/halal';

export const metadata = {
  title: "The Halal Promise · Nieves's Kitchen",
  description:
    "How every recipe on Nieves's Kitchen is kept 100% halal: personally cooked, every ingredient checked, the questionable ones researched against trusted sources.",
};

const STATUS_STYLE: Record<HalalStatus, string> = {
  'generally-accepted': 'bg-sage/20 text-brown-dark',
  'depends-on-source': 'bg-turmeric/25 text-brown-dark',
  'scholars-differ': 'bg-teal/15 text-brown-dark',
  'generally-avoided': 'bg-paprika/15 text-brown-dark',
};

export default function PromisePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 pt-6 pb-14 sm:pt-10 sm:pb-20">
      {/* Header */}
      <header className="mb-8 sm:mb-10 max-w-3xl">
        <p className="font-stamp text-xs sm:text-sm text-teal tracking-[0.18em] uppercase flex items-center gap-2 mb-4">
          <BadgeCheck size={16} aria-hidden="true" />
          Kitchen-tested &middot; 100% Halal
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-dark tracking-tight leading-[1.1]">
          The Halal Promise
        </h1>
      </header>

      <article className="text-brown-dark leading-relaxed text-base sm:text-lg">
        {/* The promise, stated plainly */}
        <div className="max-w-[65ch]">
          <p className="font-heading text-2xl sm:text-3xl text-brown-dark leading-snug mb-5">
            {PROMISE_HEADLINE}
          </p>
          <p className="mb-6">{PROMISE_INTRO}</p>
        </div>

        {/* How I keep it halal */}
        <section className="mt-14 sm:mt-16">
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-brown-dark mb-8">
            How I keep it halal
          </h2>
          <ol className="space-y-8 max-w-[68ch]">
            {METHODOLOGY.map((pillar, i) => (
              <li key={pillar.title} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="font-stamp text-2xl text-terracotta/70 leading-none pt-0.5 tabular-nums"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-brown-dark mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-brown-dark/90">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* When scholars differ */}
        <blockquote className="relative my-14 sm:my-20 pt-8 sm:pt-10 max-w-3xl border-t-2 border-brown-light/50">
          <h2 className="font-heading text-xl sm:text-2xl font-semibold text-brown-dark mb-4">
            When scholars differ
          </h2>
          <p className="font-heading text-lg sm:text-xl text-brown-dark italic leading-snug">
            {DIFFERING_OPINIONS_NOTE}
          </p>
        </blockquote>

        {/* Ingredient guide */}
        <section className="mt-4">
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-brown-dark mb-2">
            The ingredient guide
          </h2>
          <p className="text-brown-medium text-base max-w-[65ch] mb-3">
            A growing reference for the ingredients that come up most often. Where
            a position is contested, I lay out the views rather than pick for you.
          </p>
          <p className="font-stamp text-[11px] uppercase tracking-[0.12em] text-brown-light max-w-[65ch] mb-8">
            Every entry is checked against recognised halal authorities and linked
            to its source.
          </p>

          <div className="space-y-px rounded-2xl overflow-hidden border border-brown-light/20">
            {INGREDIENT_GUIDE.map((item) => (
              <div key={item.name} className="bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2">
                  <h3 className="font-heading text-lg font-semibold text-brown-dark">
                    {item.name}
                    {item.aka && (
                      <span className="font-body font-normal text-sm text-brown-medium ml-2">
                        ({item.aka})
                      </span>
                    )}
                  </h3>
                  <span
                    className={`font-stamp text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${STATUS_STYLE[item.status]}`}
                  >
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
                <p className="text-sm text-brown-medium mb-2">{item.whatItIs}</p>
                <p className="text-base text-brown-dark/90">{item.guidance}</p>
                {item.positions && item.positions.length > 0 && (
                  <ul className="mt-3 space-y-2 border-l-2 border-brown-light/30 pl-4">
                    {item.positions.map((pos, i) => (
                      <li key={i} className="text-sm text-brown-dark/85 leading-relaxed">
                        {pos}
                      </li>
                    ))}
                  </ul>
                )}
                {item.sources.length > 0 && (
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brown-medium">
                    <span className="font-stamp uppercase tracking-[0.12em] text-brown-light">
                      Sources
                    </span>
                    {item.sources.map((src) => (
                      <a
                        key={src.url}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal underline decoration-teal/30 underline-offset-2 hover:decoration-teal/60 transition-colors"
                      >
                        {src.label}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* CTAs */}
      <div className="mt-14 sm:mt-16 flex flex-wrap items-center gap-4">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal/90 transition-colors"
        >
          Browse the recipes
        </Link>
        <Link
          href="/about"
          className="text-sm text-brown-medium hover:text-brown-dark transition-colors underline underline-offset-4 decoration-brown-light/40"
        >
          More about Nieves&#39;s Kitchen
        </Link>
      </div>

      {/* Colophon */}
      <footer className="mt-20 sm:mt-24 pt-8 border-t border-brown-light/30">
        <p className="font-stamp text-xs sm:text-sm text-brown-light tracking-[0.15em]">
          Cooked, Checked &amp; Kept Halal &middot; One Kitchen at a Time
        </p>
      </footer>
    </div>
  );
}
