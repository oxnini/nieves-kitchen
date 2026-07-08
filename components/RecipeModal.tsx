'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { ModalScrollContext } from './recipe/ModalScrollContext';

const TRANSITION = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

const DESKTOP_VARIANTS = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.96 },
};

const MOBILE_VARIANTS = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit:    { y: '100%' },
};

export default function RecipeModal({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  function close() {
    // Modal lives in the @modal parallel slot; closing means popping the slot via
    // router.back(). If history has nothing to pop (e.g. opened in a fresh tab or
    // history was pruned), fall through to the catalog so the user stays on-site
    // with the recipe still reachable.
    if (typeof window !== 'undefined' && window.history.length <= 1) {
      router.push('/recipes');
    } else {
      router.back();
    }
  }

  // Capture the previously focused element on mount and restore on unmount.
  // Focus the close button on open.
  useEffect(() => {
    previousActiveRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      const prev = previousActiveRef.current;
      if (prev && document.contains(prev)) {
        prev.focus();
      } else {
        document.body.focus();
      }
    };
  }, []);

  // Escape key dismisses
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalScrollContext.Provider value={scrollContainerRef}>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITION}
          onClick={close}
          aria-hidden="true"
          className="fixed inset-0 z-[60] bg-brown-dark/55 backdrop-blur-sm"
        />

        {/* Desktop: centered card. The read-mode hero bleeds to the rounded top
            edge (RecipeDetail heroBleed), so the sheet opens on the photograph
            and the close/expand controls rest on the hero scrim. */}
        <motion.div
          key="dialog-desktop"
          role="dialog"
          aria-modal="true"
          aria-label="Recipe detail"
          variants={DESKTOP_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={TRANSITION}
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[70] hidden sm:flex items-center justify-center p-6 pointer-events-none"
        >
          <div className="relative bg-parchment border border-brown-light/20 rounded-2xl shadow-2xl w-full max-w-[880px] max-h-[90vh] overflow-hidden pointer-events-auto">
            <div
              ref={scrollContainerRef}
              className="max-h-[90vh] overflow-y-auto scrollbar-quiet"
            >
              {children}
            </div>
            <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5">
              <ModalControls closeRef={closeButtonRef} slug={slug} onClose={close} />
            </div>
          </div>
        </motion.div>

        {/* Mobile: bottom sheet. The grabber and the close/expand controls share
            one translucent line laid over the top of the sheet, so the photo
            runs edge to edge with no parchment band above it. */}
        <motion.div
          key="dialog-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Recipe detail"
          variants={MOBILE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={TRANSITION}
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-x-0 bottom-0 z-[70] sm:hidden"
        >
          <div className="relative bg-parchment border-t border-brown-light/20 rounded-t-2xl shadow-2xl overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="max-h-[92vh] overflow-y-auto scrollbar-quiet"
            >
              {children}
            </div>
            {/* Overlay line: left spacer balances the control cluster so the
                grabber reads as centered. pointer-events pass through to the
                photo except on the controls themselves. */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-2 px-3 pt-2.5 pb-3 pointer-events-none">
              <span className="w-[70px] shrink-0" aria-hidden="true" />
              <span className="h-1 w-10 rounded-full bg-white/70 shadow-sm" aria-hidden="true" />
              <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                <ModalControls closeRef={closeButtonRef} slug={slug} onClose={close} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </ModalScrollContext.Provider>
  );
}

// Close + open-full controls, styled as scrim chips (white ink on a warm
// translucent fill) so they read clearly over the hero photo, matching the
// Copy/favorite buttons already on that image.
function ModalControls({
  closeRef,
  slug,
  onClose,
}: {
  closeRef: React.RefObject<HTMLButtonElement | null>;
  slug: string;
  onClose: () => void;
}) {
  return (
    <>
      <a
        href={`/recipes/${encodeURIComponent(slug)}`}
        title="Open full recipe"
        aria-label="Open full recipe"
        className="p-2 rounded-full bg-scrim/30 backdrop-blur-sm text-white/90 hover:bg-scrim/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <Maximize2 size={16} aria-hidden="true" />
      </a>
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close recipe"
        className="p-2 rounded-full bg-scrim/30 backdrop-blur-sm text-white/90 hover:bg-scrim/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </>
  );
}
