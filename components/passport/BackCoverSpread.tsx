'use client';

import Image from 'next/image';
import type { PassportSummary } from '@/lib/passport';

export default function BackCoverSpread({ summary }: { summary: PassportSummary }) {
  return (
    <div className="passport-cover relative h-full w-full bg-parchment overflow-hidden rounded-lg">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/passport-stamp.webp"
          alt=""
          aria-hidden
          width={600}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
          className="w-full h-full object-contain opacity-25"
        />
      </div>

      <div className="relative h-full w-full flex flex-col items-center justify-center gap-3 px-10 text-center">
        <span
          aria-hidden
          className="block w-12 h-px bg-brown-dark/30"
        />
        <div className="font-stamp text-xs uppercase tracking-[0.45em] text-brown-dark/60">
          {summary.title}
        </div>
        <span
          aria-hidden
          className="block w-12 h-px bg-brown-dark/30"
        />
        <p className="mt-4 font-heading italic text-sm sm:text-base text-brown-dark/70 leading-snug max-w-[28ch]">
          End of journal. Begin a new volume?
        </p>
      </div>
    </div>
  );
}
