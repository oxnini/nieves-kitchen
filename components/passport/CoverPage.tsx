'use client';

import type { PassportSummary } from '@/lib/passport';

export default function CoverPage({ summary }: { summary: PassportSummary }) {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-brown-dark via-brown-medium to-brown-dark text-parchment overflow-hidden rounded-lg">
      <div className="absolute inset-0 [filter:url(#passport-grain)] opacity-30 mix-blend-overlay pointer-events-none" />

      <div className="relative h-full w-full flex flex-col items-center justify-center px-10 py-14 text-center">
        <svg viewBox="0 0 80 80" className="w-20 h-20 mb-6 text-turmeric" aria-hidden>
          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="40" cy="40" r="27" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M40 18 L44 32 L58 32 L47 40 L51 54 L40 46 L29 54 L33 40 L22 32 L36 32 Z"
                fill="currentColor" opacity="0.9" />
        </svg>

        <div className="text-parchment/60 text-xs uppercase tracking-[0.35em] mb-3 font-body">
          Nieves Kitchen
        </div>
        <h1
          className="font-heading text-4xl sm:text-5xl font-bold tracking-wide"
          style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.08), -1px -1px 0 rgba(0,0,0,0.4)' }}
        >
          Culinary Passport
        </h1>
        <div className="mt-8 text-parchment/75 text-xs uppercase tracking-[0.3em] font-body">
          {summary.title}
        </div>
      </div>
    </div>
  );
}
