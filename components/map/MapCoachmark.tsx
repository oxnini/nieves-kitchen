'use client';

/**
 * First-visit coachmark for the mobile map. An abstract terracotta dot
 * (fingertip indicator) demonstrates the gesture: it drags across, pauses
 * briefly, then double-pulses with an expanding ripple before lifting,
 * resetting, and resting at the left edge before the next loop.
 *
 * Three layered animations on a single 2.8s loop (defined in globals.css):
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
 * (including the pan caused by a double-tap zoom), localStorage flag.
 */

interface Props {
  onDismiss: () => void;
}

export default function MapCoachmark({ onDismiss }: Props) {
  return (
    <button
      onClick={onDismiss}
      aria-label="Dismiss hint"
      className="absolute left-1/2 -translate-x-1/2 bottom-[88px] z-30 px-3.5 py-2 rounded-full bg-parchment/95 backdrop-blur-md border border-brown-light/30 shadow-lg flex items-center gap-2.5"
    >
      <span
        aria-hidden="true"
        className="relative inline-block"
        style={{ width: 56, height: 24 }}
      >
        {/* Drag wrapper — slides L→R, carries both dot and ripple together */}
        <span className="absolute inset-0 coachmark-drag">
          {/* Ripple — sits under the dot, expands outward on each tap.
              Sibling of the dot so the pulse's scale doesn't squash it. */}
          <span
            className="absolute rounded-full border-2 coachmark-ripple"
            style={{
              width: 20,
              height: 20,
              top: 2,
              left: 18,
              borderColor: 'var(--color-terracotta)',
            }}
          />
          {/* Dot — the fingertip contact point, scales twice during tap phase */}
          <span
            className="absolute coachmark-pulse"
            style={{ top: 6, left: 22, transformOrigin: 'center' }}
          >
            <span
              className="block rounded-full"
              style={{
                width: 12,
                height: 12,
                background: 'var(--color-terracotta)',
                boxShadow: '0 1px 2px rgba(60,40,20,0.35), inset 0 1px 0 rgba(255,250,240,0.5)',
              }}
            />
          </span>
        </span>
      </span>
      <span className="font-body text-[13px] text-brown-dark whitespace-nowrap">
        Swipe, then double-tap
      </span>
    </button>
  );
}
