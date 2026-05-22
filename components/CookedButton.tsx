'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Undo2, X } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { useLogCook, useUndoCook, type CookResult } from '@/hooks/useLogCook';
import { useCookedStamps } from '@/hooks/useCookedStamps';

interface ErrorToast {
  message: string;
}

// Perforated postage-stamp silhouette via CSS mask. Four edge layers cut circular
// bites out of a solid fill, composited with subtract. Tile 11×11 with a 5px bite
// gives ~6px between perforations — postal-stamp scale, not a doily.
const STAMP_MASK_STYLE: CSSProperties = {
  WebkitMaskImage: [
    'radial-gradient(circle 5px at 0% 50%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 100% 50%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 50% 0%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 50% 100%, #000 99%, transparent 100%)',
    'linear-gradient(#000, #000)',
  ].join(', '),
  maskImage: [
    'radial-gradient(circle 5px at 0% 50%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 100% 50%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 50% 0%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 50% 100%, #000 99%, transparent 100%)',
    'linear-gradient(#000, #000)',
  ].join(', '),
  WebkitMaskPosition: '0 0, 100% 0, 0 0, 0 100%, 0 0',
  maskPosition: '0 0, 100% 0, 0 0, 0 100%, 0 0',
  WebkitMaskSize: '11px 11px, 11px 11px, 11px 11px, 11px 11px, 100% 100%',
  maskSize: '11px 11px, 11px 11px, 11px 11px, 11px 11px, 100% 100%',
  WebkitMaskRepeat: 'repeat-y, repeat-y, repeat-x, repeat-x, no-repeat',
  maskRepeat: 'repeat-y, repeat-y, repeat-x, repeat-x, no-repeat',
  WebkitMaskComposite: 'source-out, source-out, source-out, source-out, source-over',
  maskComposite: 'subtract, subtract, subtract, subtract, add',
};

export default function CookedButton({ recipe }: { recipe: Recipe }) {
  const logCook = useLogCook();
  const undoCook = useUndoCook();
  const cooked = useCookedStamps();
  const [errorToast, setErrorToast] = useState<ErrorToast | null>(null);
  // Optimistic flag set on click. The server-derived `existingStamp` takes over
  // once the query refetches; this just bridges the round-trip so the visual
  // doesn't sit on the idle state for ~300ms after a successful tap.
  const [justStamped, setJustStamped] = useState(false);

  const existingStamp = cooked.stamps.find((s) => s.recipe_slug === recipe.id) ?? null;
  const isStamped = !!existingStamp || justStamped;
  const isPending = logCook.isPending;

  useEffect(() => {
    if (!errorToast) return;
    const t = setTimeout(() => setErrorToast(null), 8000);
    return () => clearTimeout(t);
  }, [errorToast]);

  async function handleClick() {
    if (isStamped || isPending) return;
    setJustStamped(true);
    try {
      const result = await logCook.mutateAsync(recipe);
      fireConfetti(result.tier);
    } catch {
      setJustStamped(false);
      setErrorToast({ message: 'Couldn’t log this cook. Check your connection and try again.' });
    }
  }

  async function handleUndo() {
    if (!existingStamp || undoCook.isPending) return;
    try {
      await undoCook.mutateAsync(existingStamp.id);
      setJustStamped(false);
    } catch {
      setErrorToast({ message: 'Couldn’t undo. Try again in a moment.' });
    }
  }

  const heroLabel = isPending ? 'LOGGING…' : isStamped ? 'COOKED' : 'I COOKED THIS';
  const postmarkDate = existingStamp
    ? formatPostmarkDate(new Date(existingStamp.cooked_at))
    : formatPostmarkDate();

  return (
    <>
      <div className="flex flex-col items-center gap-2.5 w-full">
        <motion.button
          onClick={handleClick}
          disabled={isPending || isStamped}
          whileTap={!isPending && !isStamped ? { scale: 0.96, rotate: -2.4 } : undefined}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          aria-label={isStamped ? 'Cooked, recorded in your passport' : isPending ? 'Logging cook' : 'I cooked this, add to passport'}
          className="group relative block w-full max-w-md min-h-[88px] font-stamp disabled:cursor-default focus-visible:outline-2 focus-visible:outline-turmeric focus-visible:outline-offset-[6px] outline-none rounded-[2px]"
        >
          {/* perforated paper — same parchment-dark fill in both states. Stamped
              state stays quiet on purpose: the signal is the tinted outline + the
              `COOKED` label, not a dramatic background swap. */}
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              ...STAMP_MASK_STYLE,
              backgroundColor: 'var(--color-parchment-dark)',
              backgroundImage:
                'radial-gradient(ellipse at 28% 22%, oklch(0.96 0.025 70 / 0.55), transparent 60%), radial-gradient(ellipse at 80% 80%, oklch(0.45 0.04 50 / 0.06), transparent 55%)',
            }}
          />

          {/* hover ink wash — quiet by default, blooms on hover (idle only) */}
          {!isStamped && !isPending && (
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                ...STAMP_MASK_STYLE,
                backgroundColor: 'oklch(0.82 0.14 75 / 0.22)',
              }}
            />
          )}

          {/* inner ink frame — the engraved border on real postage stamps. On
              the stamped state it picks up a faint terracotta tint, which is the
              primary visual signal that this recipe has been recorded. */}
          <span
            aria-hidden
            className="absolute inset-[7px] border transition-colors duration-500"
            style={{
              borderColor: isStamped
                ? 'oklch(0.55 0.13 35 / 0.45)'
                : 'oklch(0.40 0.05 50 / 0.32)',
            }}
          />

          {/* content — three editorial bands: kicker / hero / postmark date.
              Stamped state shifts the hero to terracotta ink (the "marked"
              signal) and lifts the date opacity since it's now a real date. */}
          <span className="relative flex flex-col items-center justify-center gap-1.5 py-4 px-6">
            <span
              className="text-[9px] tracking-[0.42em] text-brown-dark"
              style={{ opacity: 0.55 }}
            >
              PASSPORT ENTRY
            </span>

            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isPending ? 'pending' : isStamped ? 'stamped' : 'idle'}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.22 }}
                className="text-[20px] leading-none tracking-[0.18em] transition-colors duration-500"
                style={{ color: isStamped ? 'oklch(0.55 0.13 35)' : 'var(--color-brown-dark)' }}
              >
                {heroLabel}
              </motion.span>
            </AnimatePresence>

            <span
              suppressHydrationWarning
              className="text-[9px] tracking-[0.32em] tabular-nums text-brown-dark transition-opacity duration-500"
              style={{ opacity: isStamped ? 0.7 : 0.5 }}
            >
              {postmarkDate}
            </span>
          </span>
        </motion.button>

        {/* caption: idle invites action; stamped offers a quiet undo escape hatch */}
        {isStamped ? (
          <button
            type="button"
            onClick={handleUndo}
            disabled={undoCook.isPending || !existingStamp}
            className="text-[11px] tracking-[0.18em] text-brown-medium/65 hover:text-brown-dark transition-colors flex items-center gap-1.5 disabled:opacity-50 focus-visible:outline-1 focus-visible:outline-brown-medium focus-visible:outline-offset-4 outline-none"
          >
            <Undo2 size={11} />
            {undoCook.isPending ? 'UNDOING…' : 'UNDO STAMP'}
          </button>
        ) : (
          <span className="text-[12px] tracking-wide text-brown-medium/70">
            Add this to your culinary passport
          </span>
        )}
      </div>

      <AnimatePresence>
        {errorToast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]"
          >
            <div className="bg-paprika text-white rounded-2xl shadow-2xl px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-heading text-base font-semibold mb-0.5">
                    Something went wrong
                  </div>
                  <div className="text-sm text-white/80">
                    {errorToast.message}
                  </div>
                </div>
                <button
                  onClick={() => setErrorToast(null)}
                  className="shrink-0 p-1 rounded-full hover:bg-white/15 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// "17 · MAY · 2026" — postmark date band. Middle dots (not em dashes) keep the
// year and month separable at the small caps tracking we use on the stamp.
function formatPostmarkDate(d: Date = new Date()): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return `${day} · ${month} · ${d.getFullYear()}`;
}

// Brand-warm confetti palette. Pulled from CSS tokens so it auto-themes between
// parchment and sepia. Paprika is intentionally OUT: its hot red read "party
// store" against the warm parchment of the rest of the site. Brown-medium is IN
// for warm earth grounding alongside terracotta, turmeric, and sage.
function getConfettiColors(): string[] {
  const style = getComputedStyle(document.documentElement);
  return [
    style.getPropertyValue('--color-terracotta').trim(),
    style.getPropertyValue('--color-turmeric').trim(),
    style.getPropertyValue('--color-sage').trim(),
    style.getPropertyValue('--color-brown-medium').trim(),
  ].filter(Boolean);
}

async function fireConfetti(tier: CookResult['tier']) {
  if (tier === 'repeat') return;

  const confetti = (await import('canvas-confetti')).default;

  const colors = getConfettiColors();
  // Editorial confetti: paper squares drifting down slowly, lingering on screen
  // ~3–4s. Gravity 0.8 + ticks 280 trade the "rain of specks" carnival feel for
  // "warm-weather paper bits floating down." Scalar 1.1 makes each piece read
  // as printed matter rather than a pixel. Reduced-motion users opt out
  // automatically.
  const base = {
    colors: colors.length > 0 ? colors : ['#E07A50', '#D4A843', '#8DB9A4', '#664E4C'],
    origin: { y: 0.7 },
    gravity: 0.8,
    ticks: 280,
    scalar: 1.1,
    shapes: ['square'] as ('square' | 'circle' | 'star')[],
    disableForReducedMotion: true,
  };

  if (tier === 'new_country') {
    confetti({ ...base, particleCount: 160, spread: 120, startVelocity: 48 });
    setTimeout(() => confetti({ ...base, particleCount: 70, spread: 140, angle: 60, startVelocity: 40 }), 180);
    setTimeout(() => confetti({ ...base, particleCount: 70, spread: 140, angle: 120, startVelocity: 40 }), 260);
  } else {
    confetti({ ...base, particleCount: 70, spread: 100, startVelocity: 35 });
  }
}
