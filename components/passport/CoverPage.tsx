'use client';

import Image from 'next/image';
import type { PassportSummary } from '@/lib/passport';

export default function CoverPage({ summary }: { summary: PassportSummary }) {
  return (
    <div className="passport-cover relative h-full w-full bg-[#F5F0E4] overflow-hidden rounded-lg">
      {/* Stamp image as the full cover */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/passport-stamp.png"
          alt="Nieves' Kitchen seal"
          width={600}
          height={600}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Text at the bottom */}
      <div className="relative h-full w-full flex flex-col items-center justify-end px-10 pb-[15%] text-center">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-brown-dark">
          Culinary Passport
        </h1>
        <div className="mt-2 text-brown-dark/60 text-xs uppercase tracking-[0.3em] font-body">
          {summary.title}
        </div>
      </div>
    </div>
  );
}
