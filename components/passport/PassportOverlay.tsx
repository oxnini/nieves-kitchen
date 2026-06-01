'use client';

import { Suspense, createContext, useCallback, useContext, useState } from 'react';
import dynamic from 'next/dynamic';

import BookletLoading from './BookletLoading';
import PassportModal from './PassportModal';

// The booklet pulls in BookletShell, SpreadView, every Spread, the region chip
// strip, and a chain of page-turn hooks. None of that is needed unless the user
// opens the passport, so split it into a separate client chunk.
//
// PassportAffordance warms this chunk on pointerEnter/focus via a manual
// `void import('./PassportBooklet')`, so by the time the user clicks the
// affordance the bundle is usually already in cache.
const PassportBooklet = dynamic(() => import('./PassportBooklet'), {
  ssr: false,
  loading: () => <BookletLoading variant="shell" />,
});

type PassportOverlayContextValue = {
  isOpen: boolean;
  open: () => void;
  openTo: (spreadSlug: string) => void;
  close: () => void;
  pendingSpread: string | null;
  consumePendingSpread: () => void;
};

const PassportOverlayContext = createContext<PassportOverlayContextValue | null>(null);

export function usePassportOverlay() {
  const ctx = useContext(PassportOverlayContext);
  if (!ctx) {
    throw new Error('usePassportOverlay must be used inside PassportOverlayProvider');
  }
  return ctx;
}

export default function PassportOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingSpread, setPendingSpread] = useState<string | null>(null);
  const open = useCallback(() => setIsOpen(true), []);
  const openTo = useCallback((slug: string) => {
    setPendingSpread(slug);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const consumePendingSpread = useCallback(() => setPendingSpread(null), []);

  return (
    <PassportOverlayContext.Provider value={{ isOpen, open, openTo, close, pendingSpread, consumePendingSpread }}>
      {children}
      {isOpen && (
        <PassportModal onClose={close}>
          <Suspense fallback={<BookletLoading variant="shell" />}>
            <PassportBooklet />
          </Suspense>
        </PassportModal>
      )}
    </PassportOverlayContext.Provider>
  );
}
