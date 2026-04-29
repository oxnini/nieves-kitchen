'use client';

import { Suspense, createContext, useCallback, useContext, useState } from 'react';

import PassportBooklet from './PassportBooklet';
import PassportModal from './PassportModal';

type PassportOverlayContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
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
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <PassportOverlayContext.Provider value={{ isOpen, open, close }}>
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
