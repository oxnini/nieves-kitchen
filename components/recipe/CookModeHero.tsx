'use client';

import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { useModalScrollRef } from './ModalScrollContext';

interface Props {
  title: string;
  /** Null for origin-less recipes — the country label is simply omitted. */
  country: string | null;
  onExit: () => void;
  /** Phones: jump to the Ingredients / Method headings (audit C7). */
  onJumpIngredients?: () => void;
  onJumpMethod?: () => void;
  inModal?: boolean;
}

/**
 * 56px sticky ribbon shown in cook mode, replacing the editorial hero. Sits at
 * the top of the recipe scroll surface (page or modal scroll container).
 * Title is reduced to a single line with the country beside it.
 *
 * The exit is a labelled text button, not a bare ✕: in the overlay the sheet
 * has its own ✕ (close the recipe), and two identical icons that do different
 * things was audit C5. The sheet hides its controls while cook mode is on.
 *
 * Below md, where Ingredients and Method stack into one long column, two jump
 * links save the scroll back and forth between an amount and its step.
 *
 * Once the cook is reading, the ribbon slides up out of view on scroll-down and
 * returns on scroll-up (same affordance as the navbar pill).
 */
export default function CookModeHero({
  title,
  country,
  onExit,
  onJumpIngredients,
  onJumpMethod,
  inModal = false,
}: Props) {
  const modalScrollRef = useModalScrollRef();
  const hidden = useHideOnScroll(64, inModal ? modalScrollRef : null);

  const jumpClass =
    'min-h-11 px-1.5 inline-flex items-center text-[14px] text-teal underline decoration-teal/40 underline-offset-4 hover:decoration-teal rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal';

  return (
    <div
      className={`sticky ${inModal ? 'top-0' : 'top-16'} z-30 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 h-14 px-4 sm:px-6 lg:px-8 flex items-center gap-3 bg-parchment border-b border-line transition-transform duration-300 ${
        hidden ? '-translate-y-[calc(100%+5rem)]' : 'translate-y-0'
      }`}
    >
      <div className="flex flex-1 items-baseline gap-3 min-w-0">
        {/* Inline line-height: the global `h1` rule (line-height: 1.15) is
            unlayered, so it beats a `leading-*` utility. `truncate` clips with
            overflow:hidden, and 1.15 is too tight to contain the serif's
            descenders, so they get cut off (g, p). A looser line box fixes it. */}
        <h1
          className="font-heading text-lg sm:text-xl font-normal text-brown-dark truncate"
          style={{ lineHeight: 1.5 }}
        >
          {title}
        </h1>
        {country && (
          <span className="hidden sm:inline text-[13px] text-brown-medium shrink-0">
            {country}
          </span>
        )}
      </div>

      {(onJumpIngredients || onJumpMethod) && (
        <nav aria-label="Jump to" className="md:hidden shrink-0 flex items-center">
          {onJumpIngredients && (
            <button type="button" onClick={onJumpIngredients} className={jumpClass}>
              Ingredients
            </button>
          )}
          {onJumpMethod && (
            <button type="button" onClick={onJumpMethod} className={jumpClass}>
              Method
            </button>
          )}
        </nav>
      )}

      <button
        type="button"
        onClick={onExit}
        className="shrink-0 min-h-11 sm:min-h-0 px-3 py-1.5 rounded-full text-[14px] text-brown-dark ring-1 ring-inset ring-line bg-surface hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        Exit<span className="max-sm:sr-only"> cook mode</span>
      </button>
    </div>
  );
}
