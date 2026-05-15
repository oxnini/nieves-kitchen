'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { getPassportOrigin } from '@/lib/passport-origin';
import { useFocusTrap } from './hooks/useFocusTrap';

const OPEN_MS = 220;
const CLOSE_MS = 180;

const PassportModalContext = createContext<(() => void) | null>(null);

export function usePassportModalClose(): (() => void) | null {
  return useContext(PassportModalContext);
}

export default function PassportModal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  // Capture the focused element at render time, BEFORE child effects fire.
  // Saving it inside a useEffect runs after BookletShell's mount effect
  // moves focus to the close button, so we'd capture the close button
  // itself and "restore" focus to an unmounting node — leaving the user
  // on document.body after the passport closes.
  const [previouslyFocused] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null),
  );
  const [closing, setClosing] = useState(false);

  const origin = typeof window === 'undefined' ? null : getPassportOrigin();
  const transformOrigin = origin ? `${origin.x}px ${origin.y}px` : 'top right';

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    return () => {
      previouslyFocused?.focus?.();
    };
  }, [previouslyFocused]);

  function startClose() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, reducedMotion ? 60 : CLOSE_MS);
  }

  useFocusTrap(overlayRef, { onEscape: startClose });

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) startClose();
  }

  const baseDuration = reducedMotion ? 120 : closing ? CLOSE_MS : OPEN_MS;
  const useTransform = !reducedMotion;
  const scale = closing ? 0.96 : 1;
  const opacity = closing ? 0 : 1;

  return (
    <PassportModalContext.Provider value={startClose}>
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Passport"
        data-passport-root
        onClick={onBackdropClick}
        className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-brown-dark/45 backdrop-blur-sm transition-opacity"
          style={{
            opacity,
            transitionDuration: `${baseDuration}ms`,
            transitionTimingFunction: 'ease-out',
          }}
        />

        <div
          className="passport-light relative w-full h-full overflow-y-auto bg-parchment sm:w-auto sm:h-auto sm:max-w-[95vw] sm:max-h-[95vh] sm:overflow-visible sm:bg-transparent"
          style={{
            opacity,
            transform: useTransform ? `scale(${closing ? scale : 1})` : undefined,
            transformOrigin,
            transition: useTransform
              ? `opacity ${baseDuration}ms ease-out, transform ${baseDuration}ms ease-out`
              : `opacity ${baseDuration}ms ease-out`,
            animation: closing
              ? undefined
              : useTransform
                ? `passport-open ${OPEN_MS}ms ease-out`
                : `passport-fade ${baseDuration}ms ease-out`,
          }}
        >
          <div className="px-4 sm:px-0 pt-4 sm:pt-0 pb-10 sm:pb-0">{children}</div>
        </div>

        <style jsx>{`
          @keyframes passport-open {
            from {
              opacity: 0;
              transform: scale(0.92);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes passport-fade {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </PassportModalContext.Provider>
  );
}
