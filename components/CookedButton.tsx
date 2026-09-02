'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Undo2, X } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { useLogCook, useUndoCook, type CookResult } from '@/hooks/useLogCook';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import StampsUnavailable from '@/components/StampsUnavailable';

/**
 * The one transient message slot under the stamp.
 *  - `undo`  fires straight after a successful stamp and carries the escape
 *            hatch for the action the user just took. No confirmation: the
 *            toast IS the confirmation step, and it expires on its own.
 *  - `undone`/`error` are quiet acknowledgements.
 */
type Toast =
  | { kind: 'undo'; stampId: string; recipeName: string }
  | { kind: 'undone' }
  | { kind: 'error'; message: string };

const UNDO_TOAST_MS = 9000;
const NOTICE_TOAST_MS = 6000;

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
  // Cooking writes a stamp scoped to the anonymous Supabase session, which only
  // exists after the Turnstile captcha completes. Gate the button on it so an
  // early tap shows a quiet "preparing" state instead of failing with "No
  // session" the instant the page loads. `failure` is the other end of that
  // handshake: the session is never coming, so say so instead of waiting.
  const sessionReady = !cooked.isLoading && cooked.failure === null;
  const [toast, setToast] = useState<Toast | null>(null);
  // Deliberate removal of an older stamp is a two-step: the caption swaps to a
  // confirm row. Toast-undo skips this by design (see `Toast`).
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  // Optimistic flag set on click. The server-derived `existingStamp` takes over
  // once the query refetches; this just bridges the round-trip so the visual
  // doesn't sit on the idle state for ~300ms after a successful tap.
  const [justStamped, setJustStamped] = useState(false);

  // Repeat cooks exist (the passport counts them), so take the LAST stamp for
  // this recipe: "undo" has to reverse the most recent cook, not the first one
  // the user ever logged.
  const matching = cooked.stamps.filter((s) => s.recipe_slug === recipe.id);
  const existingStamp = matching[matching.length - 1] ?? null;
  const cookCount = matching.length;
  const isStamped = !!existingStamp || justStamped;
  const isPending = logCook.isPending;

  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (dismissRef.current) clearTimeout(dismissRef.current);
    if (!toast) return;
    const ms = toast.kind === 'undo' ? UNDO_TOAST_MS : NOTICE_TOAST_MS;
    dismissRef.current = setTimeout(() => setToast(null), ms);
    return () => {
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [toast]);

  async function handleClick() {
    if (isStamped || isPending || !sessionReady) return;
    setJustStamped(true);
    try {
      const result = await logCook.mutateAsync(recipe);
      fireConfetti(result.tier);
      setToast({ kind: 'undo', stampId: result.newStamp.id, recipeName: recipe.name });
    } catch (err) {
      console.error('Failed to log cook:', err);
      setJustStamped(false);
      setToast({ kind: 'error', message: 'Couldn’t log this cook. Check your connection and try again.' });
    }
  }

  async function removeStamp(stampId: string) {
    if (undoCook.isPending) return;
    try {
      await undoCook.mutateAsync(stampId);
      setJustStamped(false);
      setConfirmingRemove(false);
      setToast({ kind: 'undone' });
    } catch (err) {
      console.error('Failed to undo cook:', err);
      setToast({ kind: 'error', message: 'Couldn’t remove that stamp. Try again in a moment.' });
    }
  }

  const heroLabel = isPending
    ? 'LOGGING…'
    : isStamped
      ? 'COOKED'
      : cooked.failure
        ? 'UNAVAILABLE'
        : !sessionReady
          ? 'PREPARING…'
          : 'I COOKED THIS';

  const postmarkDate = existingStamp
    ? formatPostmarkDate(new Date(existingStamp.cooked_at))
    : formatPostmarkDate();

  return (
    <>
      <div className="flex flex-col items-center gap-2.5 w-full">
        <motion.button
          onClick={handleClick}
          disabled={isPending || isStamped || !sessionReady}
          whileTap={!isPending && !isStamped && sessionReady ? { scale: 0.96, rotate: -2.4 } : undefined}
          // The stamped state settles at a slight angle with a cast shadow: a
          // piece of gummed paper pressed onto the page, not a form control.
          // This "applied" cue is the change a passing glance actually reads.
          animate={stampFaceMotion(isStamped)}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          aria-label={
            isStamped
              ? `Cooked, recorded in your passport${cookCount > 1 ? `, ${cookCount} times` : ''}`
              : isPending
                ? 'Logging cook'
                : cooked.failure
                  ? 'Passport unavailable'
                  : !sessionReady
                    ? 'Preparing your passport'
                    : 'I cooked this, add to passport'
          }
          className={STAMP_FACE_CLASS}
        >
          <StampFace
            stamped={isStamped}
            interactive={!isStamped && !isPending && sessionReady}
            kicker={isStamped ? 'ENTERED' : 'PASSPORT ENTRY'}
            label={heroLabel}
            labelKey={isPending ? 'pending' : isStamped ? 'stamped' : cooked.failure ? 'failed' : !sessionReady ? 'preparing' : 'idle'}
            cookCount={cookCount}
            dateLabel={postmarkDate}
          />
        </motion.button>

        {/* caption row: idle invites action; stamped offers a two-step removal;
            a dead session explains itself instead of saying "preparing" forever */}
        {cooked.failure && !isStamped ? (
          <StampsUnavailable
            compact
            className="mt-2 w-full max-w-md"
            title="Your passport did not open"
            failure={cooked.failure}
            onRetry={cooked.retry}
            retrying={cooked.isRetrying}
          />
        ) : isStamped ? (
          confirmingRemove ? (
            <div className="flex items-center gap-3 text-[11px] tracking-[0.14em] text-brown-medium">
              <span>REMOVE THIS STAMP?</span>
              <button
                type="button"
                onClick={() => existingStamp && removeStamp(existingStamp.id)}
                disabled={undoCook.isPending || !existingStamp}
                className="text-terracotta hover:underline underline-offset-4 disabled:opacity-50 focus-visible:outline-1 focus-visible:outline-terracotta focus-visible:outline-offset-4 outline-none"
              >
                {undoCook.isPending ? 'REMOVING…' : 'REMOVE'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingRemove(false)}
                className="text-brown-medium hover:text-brown-dark focus-visible:outline-1 focus-visible:outline-brown-medium focus-visible:outline-offset-4 outline-none"
              >
                KEEP
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingRemove(true)}
              disabled={!existingStamp}
              className="text-[11px] tracking-[0.18em] text-brown-medium/65 hover:text-brown-dark transition-colors flex items-center gap-1.5 disabled:opacity-50 focus-visible:outline-1 focus-visible:outline-brown-medium focus-visible:outline-offset-4 outline-none"
            >
              <Undo2 size={11} />
              {cookCount > 1 ? 'REMOVE LATEST STAMP' : 'REMOVE STAMP'}
            </button>
          )
        ) : (
          <span className="text-[12px] tracking-wide text-brown-medium/70">
            {sessionReady ? 'Add this to your culinary passport' : 'Setting up your passport…'}
          </span>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]"
          >
            {toast.kind === 'error' ? (
              <div className="bg-paprika text-white rounded-2xl shadow-2xl px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-heading text-base font-semibold mb-0.5">
                      Something went wrong
                    </div>
                    <div className="text-sm text-white/80">{toast.message}</div>
                  </div>
                  <ToastDismiss onClick={() => setToast(null)} tone="light" />
                </div>
              </div>
            ) : (
              <div className="bg-brown-dark text-parchment rounded-2xl shadow-2xl px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-heading text-base font-semibold mb-0.5">
                      {toast.kind === 'undone' ? 'Stamp removed' : 'Stamped'}
                    </div>
                    <div className="text-sm text-parchment/75 truncate">
                      {toast.kind === 'undone'
                        ? 'Your passport is back the way it was.'
                        : `${toast.recipeName} is in your passport.`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {toast.kind === 'undo' && (
                      <button
                        type="button"
                        onClick={() => removeStamp(toast.stampId)}
                        disabled={undoCook.isPending}
                        className="font-stamp text-[11px] tracking-[0.18em] px-3 py-2 rounded-full border border-parchment/35 hover:bg-parchment/15 transition-colors disabled:opacity-50"
                      >
                        {undoCook.isPending ? 'UNDOING…' : 'UNDO'}
                      </button>
                    )}
                    <ToastDismiss onClick={() => setToast(null)} tone="dark" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ToastDismiss({ onClick, tone }: { onClick: () => void; tone: 'light' | 'dark' }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 p-1 rounded-full transition-colors ${
        tone === 'light' ? 'hover:bg-white/15' : 'hover:bg-parchment/15'
      }`}
      aria-label="Dismiss"
    >
      <X size={16} />
    </button>
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
    colors: colors.length > 0 ? colors : ['#CE6B39', '#D9A845', '#8AB3AD', '#4A6A70'],
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

/**
 * The postage-stamp face, minus any behaviour. Exported so `/dev/cooked-button`
 * can put every state side by side without a Supabase session.
 *
 * The idle and cooked states differ on four axes at once, deliberately: the
 * paper takes a terracotta ink wash, the engraved rule doubles and inks, the
 * kicker changes word, and the hero gains a check plus the cook count. The old
 * treatment moved only the border tint and the hero colour, which is why the
 * two states read as the same control.
 */
/**
 * The cooked hero/date ink: terracotta pulled toward the theme's own ink so it
 * stays legible on the tinted paper. Straight `--color-terracotta` measured
 * ~2.7:1 against the stamp face; this lands near 3.8:1 while still reading as
 * terracotta, and it inverts correctly at night (brown-dark is cream there).
 */
const STAMPED_INK = 'color-mix(in srgb, var(--color-terracotta) 70%, var(--color-brown-dark))';

export function StampFace({
  stamped,
  interactive,
  kicker,
  label,
  labelKey,
  cookCount = 0,
  dateLabel,
}: {
  stamped: boolean;
  /** Enables the hover ink wash. Idle, session-ready state only. */
  interactive: boolean;
  kicker: string;
  label: string;
  /** Drives the hero's enter/exit animation; change it when the label changes. */
  labelKey: string;
  cookCount?: number;
  dateLabel: string;
}) {
  return (
    <>
      {/* perforated paper. Idle is bare parchment stock; the stamped state
          takes a terracotta ink wash right through the fill, so the two read
          differently from across the room rather than on inspection. */}
      <span
        aria-hidden
        className="absolute inset-0 transition-[background-color] duration-500"
        style={{
          ...STAMP_MASK_STYLE,
          backgroundColor: stamped
            ? 'color-mix(in srgb, var(--color-terracotta) 22%, var(--color-parchment-dark))'
            : 'var(--color-parchment-dark)',
          // The cream highlight is pulled back on the stamped face, otherwise it
          // washes the ink tint straight back out to plain parchment.
          backgroundImage: stamped
            ? 'radial-gradient(ellipse at 28% 22%, oklch(0.96 0.025 70 / 0.30), transparent 60%), radial-gradient(ellipse at 80% 80%, oklch(0.45 0.04 50 / 0.10), transparent 55%)'
            : 'radial-gradient(ellipse at 28% 22%, oklch(0.96 0.025 70 / 0.55), transparent 60%), radial-gradient(ellipse at 80% 80%, oklch(0.45 0.04 50 / 0.06), transparent 55%)',
        }}
      />

      {/* hover ink wash — quiet by default, blooms on hover (idle only) */}
      {interactive && (
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ ...STAMP_MASK_STYLE, backgroundColor: 'oklch(0.82 0.14 75 / 0.22)' }}
        />
      )}

      {/* inner ink frame — the engraved border on real postage stamps.
          Stamped doubles the rule and inks it terracotta. */}
      <span
        aria-hidden
        className="absolute inset-[7px] transition-colors duration-500"
        style={{
          border: stamped
            ? '1.5px solid color-mix(in srgb, var(--color-terracotta) 72%, transparent)'
            : '1px solid oklch(0.40 0.05 50 / 0.32)',
        }}
      />
      {stamped && (
        <span
          aria-hidden
          className="absolute inset-[11px] border"
          style={{ borderColor: 'color-mix(in srgb, var(--color-terracotta) 34%, transparent)' }}
        />
      )}

      {/* content — three editorial bands: kicker / hero / postmark date. */}
      <span className="relative flex flex-col items-center justify-center gap-1.5 py-4 px-6">
        <span
          className="text-[9px] tracking-[0.42em] transition-colors duration-500"
          style={{
            color: stamped ? STAMPED_INK : 'var(--color-brown-dark)',
            opacity: stamped ? 0.85 : 0.55,
          }}
        >
          {kicker}
        </span>

        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={labelKey}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-2 text-[20px] leading-none tracking-[0.18em] transition-colors duration-500"
            style={{ color: stamped ? STAMPED_INK : 'var(--color-brown-dark)' }}
          >
            {stamped && <Check size={17} strokeWidth={2.5} aria-hidden />}
            {label}
            {stamped && cookCount > 1 && (
              <span className="text-[13px] tracking-[0.12em] opacity-75">{`\u00d7${cookCount}`}</span>
            )}
          </motion.span>
        </AnimatePresence>

        <span
          suppressHydrationWarning
          className="text-[9px] tracking-[0.32em] tabular-nums transition-colors duration-500"
          style={{
            color: stamped ? STAMPED_INK : 'var(--color-brown-dark)',
            opacity: stamped ? 0.9 : 0.5,
          }}
        >
          {dateLabel}
        </span>
      </span>
    </>
  );
}

/** Shared by the real button and the dev harness so they cannot drift. */
export const STAMP_FACE_CLASS =
  'group relative block w-full max-w-md min-h-[88px] font-stamp disabled:cursor-default ' +
  'focus-visible:outline-2 focus-visible:outline-turmeric focus-visible:outline-offset-[6px] outline-none rounded-[2px]';

/** The "pressed onto the page" settle: a slight angle plus a cast ink shadow. */
export function stampFaceMotion(stamped: boolean) {
  return stamped
    ? { rotate: -1.6, scale: 1, filter: 'drop-shadow(0 6px 10px oklch(0.35 0.05 45 / 0.22))' }
    : { rotate: 0, scale: 1, filter: 'drop-shadow(0 0 0 transparent)' };
}
