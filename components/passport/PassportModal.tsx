'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { getPassportOrigin } from '@/lib/passport-origin';

const OPEN_MS = 220;
const CLOSE_MS = 180;

const PassportModalContext = createContext<(() => void) | null>(null);

export function usePassportModalClose(): () => void {
  const fn = useContext(PassportModalContext);
  if (!fn) throw new Error('usePassportModalClose must be used inside PassportModal');
  return fn;
}

export default function PassportModal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
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
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        startClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startClose() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, reducedMotion ? 60 : CLOSE_MS);
  }

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) startClose();
  }

  function onKeyDownTrap(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return;
    const root = overlayRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
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
        onKeyDown={onKeyDownTrap}
        onClick={onBackdropClick}
        className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-brown-dark/40 backdrop-blur-sm transition-opacity"
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
