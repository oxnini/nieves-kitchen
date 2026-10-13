'use client';

/**
 * First-visit hint for the mobile map: the top row of the bottom dock
 * (WorldMapMobile, mobile atlas spec "Bottom dock", audit F12). It was a
 * floating pill above the rail; it now lives inside the dock so the bottom
 * of the screen is one piece of paper instead of five overlapping layers.
 *
 * An abstract terracotta dot (fingertip indicator) demonstrates the gesture:
 * it drags across, pauses briefly, then double-pulses with an expanding
 * ripple before lifting, resetting, and resting at the left edge before the
 * next loop.
 *
 * Three layered animations on a single 2.6s loop (defined in globals.css):
 *   .coachmark-drag    outer wrapper, slides left → right (the swipe)
 *   .coachmark-pulse   dot scale pulse during each tap (press down + back)
 *   .coachmark-ripple  expanding ring under the dot on each tap
 *
 * The ripple is a sibling of the dot (not a child), so the pulse's scale
 * doesn't squash it. Both translate together with the drag wrapper so the
 * ripple always expands from the contact point.
 *
 * Why a dot instead of an anatomical finger: tested side-by-side at
 * /dev/coachmark; the dot reads more universally as a touch indicator
 * and feels less product-y against the parchment context. Brand voice
 * stays "warm restraint" rather than "literal illustration."
 *
 * prefers-reduced-motion: the global rule in globals.css collapses
 * animation-duration to 0.01ms, freezing all three layers at 0% (dot
 * resting at left, ripple invisible). Caption carries the meaning.
 *
 * Dismissal is owned by the parent (WorldMapMobile): tap, first pan
 * (including the pan caused by a region tap or double-tap), localStorage flag.
 */

interface Props {
  onDismiss: () => void;
}

export default function MapCoachmark({ onDismiss }: Props) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Tap a region to see its dishes. Tap to dismiss."
      className="flex w-full items-center gap-2.5 border-b border-line px-4 py-2.5 text-left rounded-t-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-terracotta"
    >
      <span
        aria-hidden="true"
        className="relative inline-block shrink-0"
        style={{ width: 44, height: 20 }}
      >
        {/* Drag wrapper — slides L→R, carries both dot and ripple together */}
        <span className="absolute inset-0 coachmark-drag">
          {/* Ripple — sits under the dot, expands outward on each tap.
              Sibling of the dot so the pulse's scale doesn't squash it. */}
          <span
            className="absolute rounded-full border-2 coachmark-ripple"
            style={{
              width: 16,
              height: 16,
              top: 2,
              left: 12,
              borderColor: 'var(--color-terracotta)',
            }}
          />
          {/* Dot — the fingertip contact point, scales twice during tap phase */}
          <span
            className="absolute coachmark-pulse"
            style={{ top: 5, left: 15, transformOrigin: 'center' }}
          >
            <span
              className="block rounded-full"
              style={{
                width: 10,
                height: 10,
                background: 'var(--color-terracotta)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,250,240,0.5)',
              }}
            />
          </span>
        </span>
      </span>
      <span className="font-body text-[14px] leading-snug text-brown-dark">
        Tap a region to see its dishes
      </span>
    </button>
  );
}
