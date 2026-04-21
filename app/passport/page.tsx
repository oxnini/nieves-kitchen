'use client';

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
    <div className="min-h-screen bg-parchment py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<PassportSkeleton />}>
          <PassportBooklet />
        </Suspense>
      </div>
    </div>
  );
}
