'use client';

/**
 * RETIRED SURFACE — the passport booklet, parked as a dev-only sandbox.
 *
 * The passport was replaced by the Cook's Journal (`/journal`) on 2026-07-05.
 * It was not retired for lack of craft: its *shape* was the problem. A booklet
 * presents a fixed universe (all 11 regions, every country) and shows the cook
 * that most of it is blank, which reads as debt. See
 * `docs/superpowers/specs/2026-07-05-cooks-journal-design.md` §1-§2, and the
 * file-by-file reused/retired inventory in §8 of that same spec.
 *
 * This route used to live at `/passport`, where it shipped in the production
 * bundle and sat at a public, unlinked URL. It now sits under `app/dev/`, so
 * `app/dev/layout.tsx` 404s it in production while it stays fully reviewable
 * under `npm run dev`.
 *
 * DO NOT treat anything here as live work. Before building on it, read
 * `docs/retired/passport.md` — it covers what is safe to revive, what is
 * shared with the live journal, and what must never come back.
 */

import { Suspense } from 'react';
import PassportBooklet from '@/components/passport/PassportBooklet';

function PassportSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 py-8 animate-pulse">
      {/* Booklet shell shape */}
      <div className="w-full max-w-md sm:max-w-2xl aspect-[3/4] sm:aspect-[1.4/1] rounded-xl bg-brown-dark/10 shadow-[0_30px_60px_-20px_rgba(60,30,15,0.2)] overflow-hidden relative">
        {/* Spine line */}
        <div className="absolute top-[2%] bottom-[2%] left-1/2 -translate-x-1/2 w-[2px] bg-brown-dark/10 hidden sm:block" />
        {/* Left page */}
        <div className="absolute inset-0 sm:right-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-3 bg-brown-light/20 rounded w-1/3" />
            <div className="h-5 bg-brown-light/20 rounded w-2/3" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-brown-light/15" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-brown-medium">Opening your passport…</p>
    </div>
  );
}

export default function PassportPage() {
  return (
    <div className="bg-parchment py-3 sm:py-10 px-4 sm:px-6 sm:min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<PassportSkeleton />}>
          <PassportBooklet />
        </Suspense>
      </div>
    </div>
  );
}
