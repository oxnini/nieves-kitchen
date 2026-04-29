'use client';

import { Suspense } from 'react';
import PassportBooklet from '@/components/passport/PassportBooklet';
import PassportModal from '@/components/passport/PassportModal';

export default function InterceptedPassportPage() {
  return (
    <PassportModal>
      <Suspense
        fallback={
          <div className="py-10 text-center text-brown-medium">
            Opening your passport…
          </div>
        }
      >
        <PassportBooklet />
      </Suspense>
    </PassportModal>
  );
}
