'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { animate, motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { ModalScrollContext } from './recipe/ModalScrollContext';
import { useScrollLock } from '@/hooks/useScrollLock';

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

/** Drag distance, or fling speed, past which releasing dismisses the sheet. */
const DISMISS_DISTANCE_PX = 110;
const DISMISS_VELOCITY_PX_S = 700;

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

  // Freezes the page behind the sheet and disables Chrome Android's
  // pull-to-refresh, which used to reload the route when you dragged the
  // backdrop.
  useScrollLock();

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

  // Swipe-down-to-dismiss.
  //
  // Written by hand rather than with framer-motion's `drag` prop on purpose:
  // `drag="y"` stamps `touch-action: pan-x` onto the sheet, and touch-action is
  // intersected down the ancestor chain, so it would kill vertical scrolling in
  // the recipe content underneath. Driving a motion value from pointer events on
  // two small, deliberately non-scrolling surfaces — the grabber and the
  // backdrop — leaves the content's own scrolling untouched.
  const dragY = useMotionValue(0);
  const dragStartRef = useRef<{ y: number; t: number } | null>(null);
  const lastMoveRef = useRef<{ y: number; t: number } | null>(null);
  // Set once a gesture travels far enough to count as a drag. The backdrop also
  // closes on click, and without this a drag that springs back would be followed
  // by a click that closes anyway.
  const draggedRef = useRef(false);

  const onDragStart = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const now = { y: e.clientY, t: e.timeStamp };
    dragStartRef.current = now;
    lastMoveRef.current = now;
    draggedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    const start = dragStartRef.current;
    if (!start) return;
    const travelled = e.clientY - start.y;
    if (Math.abs(travelled) > 4) draggedRef.current = true;
    lastMoveRef.current = { y: e.clientY, t: e.timeStamp };
    // Downward only. Dragging up must not lift the sheet off the bottom edge.
    dragY.set(Math.max(0, travelled));
  }, [dragY]);

  const onDragEnd = useCallback((e: React.PointerEvent) => {
    const start = dragStartRef.current;
    if (!start) return;
    dragStartRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const travelled = e.clientY - start.y;
    // Velocity over the last move only, so a slow drag that ends in a flick
    // still reads as a flick.
    const last = lastMoveRef.current;
    const dt = last ? e.timeStamp - last.t : 0;
    const velocity = dt > 0 ? ((e.clientY - last!.y) / dt) * 1000 : 0;

    if (travelled > DISMISS_DISTANCE_PX || (travelled > 24 && velocity > DISMISS_VELOCITY_PX_S)) {
      close();
      return;
    }
    animate(dragY, 0, { type: 'spring', stiffness: 420, damping: 36 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragY]);

  const dragHandlers = {
    onPointerDown: onDragStart,
    onPointerMove: onDragMove,
    onPointerUp: onDragEnd,
    onPointerCancel: onDragEnd,
  };

  return (
    <ModalScrollContext.Provider value={scrollContainerRef}>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITION}
          onClick={() => { if (!draggedRef.current) close(); }}
          aria-hidden="true"
          {...dragHandlers}
          // touch-action:none claims the vertical gesture for the sheet instead
          // of letting the browser treat it as a page pull.
          style={{ touchAction: 'none' }}
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
          <div className="relative bg-parchment border border-brown-light/20 rounded-2xl shadow-2xl w-full max-w-[880px] max-h-[90dvh] overflow-hidden pointer-events-auto">
            <div
              ref={scrollContainerRef}
              className="max-h-[90dvh] overflow-y-auto scrollbar-quiet"
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
          {/* Separate motion element from the one running the enter/exit
              variants, so the drag offset and the slide animation never fight
              over the same `y`. */}
          <motion.div
            style={{ y: dragY }}
            className="relative bg-parchment border-t border-brown-light/20 rounded-t-2xl shadow-2xl overflow-hidden"
          >
            <div
              ref={scrollContainerRef}
              className="max-h-[92dvh] overflow-y-auto scrollbar-quiet"
            >
              {children}
            </div>
            {/* Overlay line: the close/expand controls only. pointer-events pass
                through to the photo except on the controls themselves. */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-end gap-2 px-3 pt-2.5 pb-3 pointer-events-none">
              <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                <ModalControls closeRef={closeButtonRef} slug={slug} onClose={close} />
              </div>
            </div>

            {/* Drag handle. The grabber used to be decoration: it looked
                draggable and did nothing. It is now the real handle, and it is
                positioned independently of the controls row so its hit area can
                be generous without shoving the controls around.

                The visible pill is 6px tall but the target is 144x44 — the whole
                top-centre band of the sheet — because on a device people grab
                near the line, not exactly on it. 144px keeps it clear of the
                controls at the right edge. */}
            <span
              {...dragHandlers}
              aria-hidden="true"
              style={{ touchAction: 'none' }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-36 h-11 flex items-start justify-center pt-2 pointer-events-auto cursor-grab active:cursor-grabbing"
            >
              <span className="block h-1.5 w-11 rounded-full bg-white/70 shadow-sm" />
            </span>
          </motion.div>
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
