'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';

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
  const previousActiveRef = useRef<HTMLElement | null>(null);

  function close() {
    router.back();
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

      {/* Desktop: centered card */}
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
        <div className="relative bg-parchment border border-brown-light/20 rounded-2xl shadow-2xl w-full max-w-[880px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          <ModalHeader closeRef={closeButtonRef} slug={slug} onClose={close} />
          <div className="pt-10">{children}</div>
        </div>
      </motion.div>

      {/* Mobile: bottom sheet */}
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
        <div className="relative bg-parchment border-t border-brown-light/20 rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-parchment pt-2 pb-1 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-brown-light/40" aria-hidden="true" />
          </div>
          <ModalHeader closeRef={closeButtonRef} slug={slug} onClose={close} />
          <div className="pt-10">{children}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ModalHeader({
  closeRef,
  slug,
  onClose,
}: {
  closeRef: React.RefObject<HTMLButtonElement | null>;
  slug: string;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
      <a
        href={`/recipes/${slug}`}
        title="Open full recipe"
        aria-label="Open full recipe"
        className="p-2 rounded-full text-brown-medium hover:text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta bg-parchment/85 backdrop-blur-sm"
      >
        <Maximize2 size={16} aria-hidden="true" />
      </a>
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close recipe"
        className="p-2 rounded-full text-brown-medium hover:text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta bg-parchment/85 backdrop-blur-sm"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
