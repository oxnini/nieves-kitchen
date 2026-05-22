'use client';

import Image from 'next/image';
import type { PassportSummary } from '@/lib/passport';

export default function CoverPage({ summary }: { summary: PassportSummary }) {
  const isEmpty = summary.totalStamps === 0;

  return (
    <div className="passport-cover relative h-full w-full bg-parchment overflow-hidden rounded-lg">
      {/* Stamp image as the full cover. Dimmed on an empty passport so the
          seal doesn't read as a rank that hasn't been earned yet. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/passport-stamp.webp"
          alt="Nieves' Kitchen seal"
          width={600}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
          className={`w-full h-full object-contain ${isEmpty ? 'opacity-70' : ''}`}
          priority
        />
      </div>

      {/* Text at the bottom */}
      <div className="relative h-full w-full flex flex-col items-center justify-end px-10 pb-[15%] text-center">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-brown-dark">
          Culinary Passport
        </h1>
        {isEmpty ? (
          <p className="mt-2 font-heading italic text-sm sm:text-base text-brown-dark/75 leading-snug">
            Cook a recipe to earn your first stamp.
          </p>
        ) : (
          <div className="mt-2 text-brown-dark/60 text-xs uppercase tracking-[0.3em] font-body">
            {summary.title}
          </div>
        )}
      </div>
    </div>
  );
}
