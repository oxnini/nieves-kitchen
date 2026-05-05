'use client';

import { Suspense, createContext, useCallback, useContext, useState } from 'react';

import PassportBooklet from './PassportBooklet';
import PassportModal from './PassportModal';

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
      )}
    </PassportOverlayContext.Provider>
  );
}
