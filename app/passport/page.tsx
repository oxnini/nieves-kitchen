'use client';

import { Suspense } from 'react';
import PassportBooklet from '@/components/passport/PassportBooklet';

export default function PassportPage() {
  return (
    <div className="min-h-screen bg-parchment py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Suspense
          fallback={
            <div className="text-brown-medium py-20 text-center">
              Opening your passport…
            </div>
          }
        >
          <PassportBooklet />
        </Suspense>
      </div>
    </div>
  );
}
