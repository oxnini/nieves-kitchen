'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, RotateCcw, Undo2, X } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import type { ExplorerTitle } from '@/lib/passport';
import { useLogCook, useUndoCook, type CookTier } from '@/hooks/useLogCook';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import { Eyebrow } from '@/components/courtyard';
import CountryStampSlot from '@/components/passport/CountryStampSlot';
import PaperTexture from '@/components/passport/PaperTexture';
import StampsUnavailable from '@/components/StampsUnavailable';

/**
 * "I cooked this": a perforated stamp slip (spec 2026-09-25 §8, variant C
 * from /dev/cook-stamp). Before cooking it is the button; once cooked it
 * records how often and when, with "I cooked it again" and a two-step
 * "Remove" underneath.
 *
 * The one transient message slot:
 *  - `cooked` fires straight after a successful cook and carries Undo. No
 *    confirmation: the message IS the confirmation step, and it expires.
 *  - `undone` / `limit` / `error` are quiet acknowledgements.
 */
type Toast =
  | {
      kind: 'cooked';
      tier: CookTier;
      title: ExplorerTitle | null;
      count: number;
      stampId: string;
    }
  | { kind: 'undone' }
  | { kind: 'limit' }
  | { kind: 'error'; message: string };

const UNDO_TOAST_MS = 9000;
const NOTICE_TOAST_MS = 6000;

// Slip geometry, the user's picks in the lab, then 15% smaller (2026-09-28,
// user). The perforation and the 14px text keep their size.
const SLIP_MAX_WIDTH = 357;
const BITE = 5;
const COOKED_WASH = 6;

/**
 * Perforated postage-stamp silhouette via CSS mask. The paper layer comes
 * FIRST and the four rows of bites below it: the paper composites as "source
 * minus what is under it", which leaves the paper with holes. Listing the
 * bites first (the old order) reads the other way round in current Chrome's
 * unprefixed mask-composite and drops the paper, leaving a strip of dots.
 */
function perforation(bite: number): CSSProperties {
  const tile = bite * 2 + 1;
  const dot = (at: string) => `radial-gradient(circle ${bite}px at ${at}, #000 99%, transparent 100%)`;
  const layers = ['linear-gradient(#000, #000)', dot('0% 50%'), dot('100% 50%'), dot('50% 0%'), dot('50% 100%')].join(', ');
  const t = `${tile}px ${tile}px`;
  const size = `100% 100%, ${t}, ${t}, ${t}, ${t}`;
  const pos = '0 0, 0 0, 100% 0, 0 0, 0 100%';
  const rep = 'no-repeat, repeat-y, repeat-y, repeat-x, repeat-x';
  return {
    WebkitMaskImage: layers, maskImage: layers,
    WebkitMaskPosition: pos, maskPosition: pos,
    WebkitMaskSize: size, maskSize: size,
    WebkitMaskRepeat: rep, maskRepeat: rep,
    WebkitMaskComposite: 'source-out, source-over, source-over, source-over, source-over',
    maskComposite: 'subtract, add, add, add, add',
  };
}

const MASK = perforation(BITE);

/** "12 September", with the year only when it is not this year. */
function longDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    ...(d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}),
  });
}

function cookedTimes(n: number): string {
  return n <= 1 ? 'Cooked' : n === 2 ? 'Cooked twice' : `Cooked ${n} times`;
}

/** The DB trigger (2026-05-05-rate-limit-stamps.sql) allows 5 cooks of one
 *  recipe per 24h and raises `rate_limit_exceeded` past that. */
function isRateLimited(err: unknown): boolean {
  const message = (err as { message?: unknown } | null)?.message;
  return typeof message === 'string' && message.includes('rate_limit_exceeded');
}

export default function CookedButton({ recipe }: { recipe: Recipe }) {
  const logCook = useLogCook();
  const undoCook = useUndoCook();
  const cooked = useCookedStamps();
  // Cooking writes a stamp scoped to the anonymous Supabase session, which only
  // exists after the Turnstile captcha completes. Gate the button on it so an
  // early tap shows a quiet "opening" state instead of failing with "No
  // session" the instant the page loads. `failure` is the other end of that
  // handshake: the session is never coming, so say so instead of waiting.
  const sessionReady = !cooked.isLoading && cooked.failure === null;
  const [toast, setToast] = useState<Toast | null>(null);
  // Deliberate removal is a two-step: the actions row swaps to a confirm.
  // Undo from the message skips this by design (see `Toast`).
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  // Optimistic flag set on a successful first cook. The server-derived
  // `latestStamp` takes over once the query refetches; this just bridges the
  // round-trip so the slip doesn't sit on the idle state after the save.
  const [justStamped, setJustStamped] = useState(false);

  // Repeat cooks exist (the journal counts them), so take the LAST stamp for
  // this recipe: removing has to reverse the most recent cook, not the first.
  const matching = cooked.stamps.filter((s) => s.recipe_slug === recipe.id);
  const latestStamp = matching[matching.length - 1] ?? null;
  const isStamped = !!latestStamp || justStamped;
  const cookCount = Math.max(matching.length, isStamped ? 1 : 0);
  const lastCooked = latestStamp ? new Date(latestStamp.cooked_at) : justStamped ? new Date() : null;
  const isPending = logCook.isPending;

  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (dismissRef.current) clearTimeout(dismissRef.current);
    if (!toast) return;
    const ms = toast.kind === 'cooked' ? UNDO_TOAST_MS : NOTICE_TOAST_MS;
    dismissRef.current = setTimeout(() => setToast(null), ms);
    return () => {
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [toast]);

  // Shared by the slip (first cook) and "I cooked it again" (a repeat).
  async function handleCook() {
    if (isPending || !sessionReady) return;
    setConfirmingRemove(false);
    try {
      const result = await logCook.mutateAsync(recipe);
      setJustStamped(true);
      void fireConfetti(result.tier);
      setToast({
        kind: 'cooked',
        tier: result.tier,
        title: result.titleUnlocked,
        count: result.cookCount,
        stampId: result.newStamp.id,
      });
    } catch (err) {
      if (isRateLimited(err)) {
        setToast({ kind: 'limit' });
        return;
      }
      console.error('Failed to log cook:', err);
      setToast({ kind: 'error', message: 'We could not save this cook. Check your connection and try again.' });
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
      console.error('Failed to remove cook:', err);
      setToast({ kind: 'error', message: 'We could not remove that cook. Try again in a moment.' });
    }
  }

  // The first cook shows "Adding…" on the slip; a repeat keeps the cooked
  // slip and puts "Adding…" on the "I cooked it again" link instead.
  const state: 'cooked' | 'pending' | 'failed' | 'preparing' | 'idle' = isStamped
    ? 'cooked'
    : isPending
      ? 'pending'
      : cooked.failure
        ? 'failed'
        : !sessionReady
          ? 'preparing'
          : 'idle';
  const isCooked = state === 'cooked';

  const ariaLabel =
    state === 'cooked'
      ? `Cooked, in your Cook's Journal${cookCount > 1 ? `, ${cookCount} times` : ''}`
      : state === 'pending'
        ? 'Adding this cook'
        : state === 'failed'
          ? 'Journal unavailable'
          : state === 'preparing'
            ? 'Opening your journal'
            : "I cooked this, add it to your Cook's Journal";

  const idleLabel =
    state === 'pending'
      ? 'Adding…'
      : state === 'preparing'
        ? 'Opening your journal…'
        : state === 'failed'
          ? 'Journal unavailable'
          : 'I cooked this';

  const actionLink =
    'inline-flex items-center gap-1.5 underline-offset-4 hover:underline disabled:opacity-60 disabled:hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal outline-none';

  return (
    <>
      <div className="flex w-full flex-col items-center gap-3">
        <motion.button
          type="button"
          onClick={handleCook}
          disabled={state !== 'idle'}
          aria-label={ariaLabel}
          whileTap={state === 'idle' ? { scale: 0.96, rotate: -2 } : undefined}
          // No tilt in any state. The cooked slip just sits a little higher
          // off the page: a deeper cast shadow.
          animate={isCooked
            ? { filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.20))' }
            : { filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.10))' }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="cook-slip group relative block w-full rounded-[2px] outline-none disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-teal"
          style={{ maxWidth: SLIP_MAX_WIDTH }}
        >
          {/* perforated paper; the cooked state takes a faint terracotta wash */}
          <span
            aria-hidden
            className="absolute inset-0 transition-[background-color] duration-500"
            style={{
              ...MASK,
              backgroundColor: isCooked
                ? `color-mix(in srgb, var(--color-terracotta) ${COOKED_WASH}%, var(--color-surface))`
                : 'var(--color-surface)',
            }}
          />
          {state === 'idle' && (
            <span
              aria-hidden
              className="absolute inset-0 bg-teal/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={MASK}
            />
          )}
          {/* the engraved frame: single before cooking, doubled once cooked */}
          <span
            aria-hidden
            className="absolute transition-colors duration-500"
            style={{
              inset: BITE + 4,
              border: isCooked
                ? '1.5px solid var(--color-terracotta)'
                : '1.5px solid color-mix(in srgb, var(--color-terracotta) 70%, transparent)',
            }}
          />
          {isCooked && (
            <span
              aria-hidden
              className="absolute"
              style={{ inset: BITE + 8, border: '1px solid color-mix(in srgb, var(--color-terracotta) 45%, transparent)' }}
            />
          )}
          <span className="relative flex flex-col items-center gap-[5px] px-[27px] py-5">
            {isCooked ? (
              <>
                <Eyebrow as="span">In your journal</Eyebrow>
                <span className="flex items-center gap-2 font-heading text-[24px] italic leading-none text-brown-dark">
                  <Check size={19} strokeWidth={2.4} className="text-terracotta" aria-hidden />
                  {cookedTimes(cookCount)}
                </span>
                {lastCooked && (
                  <span suppressHydrationWarning className="font-body text-[14px] text-brown-dark">
                    {cookCount > 1 ? 'Last on ' : ''}
                    {longDate(lastCooked)}
                  </span>
                )}
              </>
            ) : (
              <>
                <Eyebrow as="span" tone="muted">The Cook&apos;s Journal</Eyebrow>
                <span className="font-heading text-[24px] leading-none text-brown-dark">{idleLabel}</span>
                <span className="font-body text-[14px] text-brown-dark">
                  {state === 'preparing' ? 'One moment' : 'Tap once you have made it'}
                </span>
              </>
            )}
          </span>
        </motion.button>

        {/* under the slip: a dead session explains itself; a cooked slip
            offers "again" and a two-step removal of the latest cook */}
        {cooked.failure && !isStamped ? (
          <StampsUnavailable
            compact
            className="mt-2 w-full max-w-md"
            title="Your journal did not open"
            failure={cooked.failure}
            onRetry={cooked.retry}
            retrying={cooked.isRetrying}
          />
        ) : isCooked && (
          confirmingRemove ? (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-body text-[14px]">
              <span className="text-brown-dark">{cookCount > 1 ? 'Remove the latest cook?' : 'Remove this cook?'}</span>
              <button
                type="button"
                onClick={() => latestStamp && removeStamp(latestStamp.id)}
                disabled={undoCook.isPending || !latestStamp}
                className={`${actionLink} font-semibold text-paprika`}
              >
                {undoCook.isPending ? 'Removing…' : 'Remove'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingRemove(false)}
                className={`${actionLink} text-brown-dark`}
              >
                Keep
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-body text-[14px]">
              <button
                type="button"
                onClick={handleCook}
                disabled={isPending || !sessionReady}
                className={`${actionLink} text-teal`}
              >
                <RotateCcw size={16} aria-hidden /> {isPending ? 'Adding…' : 'I cooked it again'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingRemove(true)}
                disabled={!latestStamp || isPending}
                className="inline-flex items-center gap-1.5 text-brown-medium hover:text-brown-dark disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal outline-none"
              >
                <Undo2 size={16} aria-hidden /> {cookCount > 1 ? 'Remove the latest cook' : 'Remove this cook'}
              </button>
            </div>
          )
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
            <CookToast
              toast={toast}
              recipe={recipe}
              onUndo={(id) => removeStamp(id)}
              undoing={undoCook.isPending}
              onClose={() => setToast(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** The message: light paper by day, the night band at night (`.cook-toast`
 *  in globals.css). The ink inside is theme-aware, so it flips with it. */
function CookToast({
  toast,
  recipe,
  onUndo,
  undoing,
  onClose,
}: {
  toast: Toast;
  recipe: Recipe;
  onUndo: (stampId: string) => void;
  undoing: boolean;
  onClose: () => void;
}) {
  const name = recipe.name;
  const country = recipe.country;
  let heading: string;
  let body: string;
  let showStamp = false;
  let title: ExplorerTitle | null = null;

  if (toast.kind === 'error') {
    heading = 'Something went wrong';
    body = toast.message;
  } else if (toast.kind === 'limit') {
    heading = 'That is plenty for today';
    body = 'You have logged this one a lot today. Try again tomorrow.';
  } else if (toast.kind === 'undone') {
    heading = 'Cook removed';
    body = 'Your journal is back the way it was.';
  } else if (toast.tier === 'new_country' && country) {
    heading = `A new country: ${country}`;
    body = `${name} is your first dish from ${country}. Its stamp is in your journal.`;
    showStamp = true;
    title = toast.title;
  } else if (toast.tier === 'repeat') {
    heading = 'Cooked again';
    body = `That is ${toast.count} times for ${name}.`;
  } else {
    heading = 'In your journal';
    body = `${name} is in your Cook's Journal.`;
  }

  return (
    <div
      className="cook-toast rounded-[4px] px-5 py-4 text-brown-dark"
    >
      <div className="flex items-center gap-4">
        {showStamp && country && (
          <>
            {/* the stamp's rough-ink filter lives in PaperTexture, which only
                /journal mounts; recipe pages need their own copy */}
            <PaperTexture />
            <div
              inert
              aria-hidden
              className="cook-toast-stamp ink-plinth shrink-0 rounded-[3px]"
              style={{ '--stamp-size': '40px', transform: 'rotate(-6deg)' } as CSSProperties}
            >
              <CountryStampSlot
                country={country}
                stamps={[{ id: 'toast', recipe_slug: recipe.id, recipe_country: country, cooked_at: new Date().toISOString() }]}
                onClick={() => {}}
              />
            </div>
          </>
        )}
        <div className="min-w-0 flex-1">
          <p className={`font-heading text-[19px] leading-tight ${toast.kind === 'error' ? 'text-paprika' : ''}`}>
            {heading}
          </p>
          <p className="mt-1 font-body text-[14px] leading-snug text-brown-medium">{body}</p>
          {title && (
            <p className="mt-2 flex items-center gap-2 font-body text-[14px]">
              <span aria-hidden className="size-[7px] rotate-45 bg-terracotta" />
              <span>You are now a <strong className="font-semibold">{title}</strong>.</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {toast.kind === 'cooked' && (
            <button
              type="button"
              onClick={() => onUndo(toast.stampId)}
              disabled={undoing}
              className="rounded-sm px-3 py-2 font-body text-[14px] font-semibold ring-1 ring-brown-dark/40 transition-colors hover:bg-brown-dark/[0.06] disabled:opacity-60"
            >
              {undoing ? 'Undoing…' : 'Undo'}
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="Dismiss" className="rounded-full p-1.5 hover:bg-brown-dark/[0.06]">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Brand confetti palette, read from CSS tokens so it follows the theme.
function getConfettiColors(): string[] {
  const style = getComputedStyle(document.documentElement);
  return ['--color-terracotta', '--color-turmeric', '--color-sage', '--color-brown-medium']
    .map((v) => style.getPropertyValue(v).trim())
    .filter(Boolean);
}

// 70% of the original counts (user pick, /dev/cook-stamp).
const CONFETTI_STRENGTH = 0.7;

async function fireConfetti(tier: CookTier) {
  if (tier === 'repeat') return;

  const confetti = (await import('canvas-confetti')).default;
  const colors = getConfettiColors();
  const n = (x: number) => Math.round(x * CONFETTI_STRENGTH);
  // Editorial confetti: paper squares drifting down slowly, lingering ~3-4s.
  // Reduced-motion users opt out automatically.
  const base = {
    colors: colors.length > 0 ? colors : ['#B4532E', '#F0A988', '#B9CBC7', '#337677'],
    origin: { y: 0.7 },
    gravity: 0.8,
    ticks: 280,
    scalar: 1.1,
    shapes: ['square'] as ('square' | 'circle' | 'star')[],
    disableForReducedMotion: true,
  };

  // A new country, a new title and a new dish all get the same full burst
  // (user, 2026-09-28: a new dish should feel as big as a new country).
  confetti({ ...base, particleCount: n(160), spread: 120, startVelocity: 48 });
  setTimeout(() => confetti({ ...base, particleCount: n(70), spread: 140, angle: 60, startVelocity: 40 }), 180);
  setTimeout(() => confetti({ ...base, particleCount: n(70), spread: 140, angle: 120, startVelocity: 40 }), 260);
}
