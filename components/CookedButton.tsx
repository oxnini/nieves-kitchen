'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Undo2, X } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import type { ExplorerTitle } from '@/lib/passport';
import { useLogCook, useUndoCook, type CookTier } from '@/hooks/useLogCook';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import { Eyebrow } from '@/components/courtyard';
import CountryStampSlot from '@/components/passport/CountryStampSlot';
import PaperTexture from '@/components/passport/PaperTexture';
import StampsUnavailable from '@/components/StampsUnavailable';
import { useSessionState } from '@/components/Providers';

/**
 * "I cooked this": the journal slip (spec 2026-09-25 §8, variant B from
 * /dev/cook-stamp, picked 2026-10-15). A paper card: before cooking it asks
 * "Made this one?" over a teal button; once cooked it says how often and
 * when, carries "Open your journal", "I cooked it again" and a two-step
 * "Remove", and shows the country's own stamp.
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

// The country stamp's --stamp-size: the lab's "Country stamp size" (2026-10-15,
// user: at least 90px, never tilted). Image stamps cover 1.4x this square.
const STAMP_SIZE = 90;

/** "12 September", with the year only when it is not this year. */
function longDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    ...(d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}),
  });
}

/** "Cooked on 12 September." / "Cooked twice. Last on 12 September." */
function cookedLine(n: number, d: Date): string {
  if (n <= 1) return `Cooked on ${longDate(d)}.`;
  return `${n === 2 ? 'Cooked twice' : `Cooked ${n} times`}. Last on ${longDate(d)}.`;
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
  const session = useSessionState();
  const { begin, release } = session;
  // Cooking writes a stamp scoped to the anonymous Supabase session. A new
  // cook has none, and the captcha that creates one is only started here, on
  // the first tap (audit F1): the tap is remembered in `wantsCook` and the
  // stamp lands by itself once the check clears. `failure` is the other end
  // of that handshake: the session is never coming, so say so instead of
  // waiting.
  const sessionReady =
    session.status === 'ready' && !cooked.isLoading && cooked.failure === null;
  const [wantsCook, setWantsCook] = useState(false);
  // Turnstile renders into this slot (portalled from Providers), so any
  // visible challenge sits under the slip that asked for it.
  const checkSlotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = checkSlotRef.current;
    return () => {
      if (el) release(el);
    };
  }, [release]);
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
    if (isPending) return;
    if (session.status === 'none' && checkSlotRef.current) {
      setWantsCook(true);
      begin(checkSlotRef.current);
      return;
    }
    if (!sessionReady) return;
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

  // The check cleared: finish the cook that started it. A failure leaves the
  // wish in place, so "Try again" carries on to the stamp without a re-tap.
  useEffect(() => {
    if (!wantsCook || !sessionReady) return;
    setWantsCook(false);
    void handleCook();
    // handleCook is re-created every render; firing once on the transition
    // to ready is the point, so it is deliberately left out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsCook, sessionReady]);

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
  // `none` counts as idle: the tap itself is what starts the check.
  const state: 'cooked' | 'pending' | 'failed' | 'preparing' | 'idle' = isStamped
    ? 'cooked'
    : cooked.failure
      ? 'failed'
      : isPending || wantsCook
        ? 'pending'
        : sessionReady || session.status === 'none'
          ? 'idle'
          : 'preparing';
  const isCooked = state === 'cooked';

  const ariaLabel =
    state === 'pending'
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

  // The stamp line only promises what the tap will do: a country already in
  // the journal brings no new stamp.
  const country = recipe.country;
  const countryStamped = !!country && cooked.stamps.some((s) => s.recipe_country === country);
  const idleLine =
    state === 'preparing'
      ? 'Setting up your journal. This only takes a moment.'
      : `Log it and it goes in your journal.${country && !countryStamped ? ` Your first dish from ${country} brings its stamp.` : ''}`;

  const actionLink =
    'inline-flex items-center gap-1.5 underline-offset-4 hover:underline disabled:opacity-60 disabled:hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal outline-none';

  return (
    <>
      <div className="flex w-full flex-col items-center gap-3">
        {/* The card lays out by its own width: stamp beside the text on a
            recipe page (phones included), stacked in cook mode's narrow
            step card. */}
        <div className="@container w-full max-w-[460px]">
          <div className="rounded-[3px] border-t-2 border-teal bg-surface p-5 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.35)] ring-1 ring-line">
            <div className={`flex flex-col gap-4 ${isCooked ? '@xs:flex-row @xs:items-center @xs:justify-between' : ''}`}>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Eyebrow tone="muted">The Cook&apos;s Journal</Eyebrow>
                {isCooked ? (
                  <>
                    <p className="font-heading text-[22px] leading-tight text-brown-dark">In your journal</p>
                    {lastCooked && (
                      <p suppressHydrationWarning className="font-body text-[14px] text-brown-medium">
                        {cookedLine(cookCount, lastCooked)}
                      </p>
                    )}
                    <div className="mt-1.5">
                      {confirmingRemove ? (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-[14px]">
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
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-[14px]">
                          <Link href="/journal" className={`${actionLink} text-teal`}>
                            Open your journal
                          </Link>
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
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-heading text-[22px] leading-tight text-brown-dark">Made this one?</p>
                    <p className="max-w-[40ch] font-body text-[14px] leading-snug text-brown-medium">{idleLine}</p>
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={handleCook}
                        disabled={state !== 'idle'}
                        aria-label={ariaLabel}
                        className="inline-flex h-11 items-center justify-center rounded-sm bg-teal px-5 font-body text-[15px] font-semibold leading-none text-cream transition-[transform,background-color,opacity] duration-200 hover:-translate-y-px hover:bg-cobalt-deep active:translate-y-0 motion-reduce:hover:translate-y-0 disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal outline-none"
                      >
                        {idleLabel}
                      </button>
                    </div>
                  </>
                )}
              </div>
              {isCooked && (
                // Lands with a short spring on a cook made here; already
                // cooked on arrival, it is simply there.
                <motion.div
                  key={latestStamp?.id ?? 'new'}
                  initial={justStamped ? { scale: 1.3, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                  className="shrink-0 self-center"
                >
                  {country ? (
                    <>
                      {/* the stamp's rough-ink filter lives in PaperTexture,
                          which only /journal mounts */}
                      <PaperTexture />
                      <div
                        inert
                        aria-hidden
                        className="cook-card-stamp ink-plinth rounded-[3px]"
                        style={{ '--stamp-size': `${STAMP_SIZE}px` } as CSSProperties}
                      >
                        <CountryStampSlot
                          country={country}
                          stamps={[{ id: 'card', recipe_slug: recipe.id, recipe_country: country, cooked_at: (lastCooked ?? new Date()).toISOString() }]}
                          onClick={() => {}}
                        />
                      </div>
                    </>
                  ) : (
                    <Postmark size={STAMP_SIZE} date={lastCooked} count={cookCount} />
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* The browser check. Empty and invisible unless Cloudflare decides
            to ask, in which case it says why, right where the cook is
            looking. The slot itself must never remount (it is the portal
            target), so it is always rendered, hidden unless this card is
            the one that started the check (cook mode mounts two). */}
        <div
          role={wantsCook && session.awaitingHuman ? 'status' : undefined}
          className={`${wantsCook ? 'flex' : 'hidden'} w-full max-w-md flex-col items-center gap-2 text-center`}
        >
          {session.awaitingHuman && (
            <>
              <p className="font-heading text-[19px] leading-tight text-brown-dark">One quick check</p>
              <p className="max-w-[40ch] font-body text-[14px] leading-snug text-brown-medium">
                Your journal lives in this browser. This check keeps it yours, and you only do it once.
              </p>
            </>
          )}
          <div ref={checkSlotRef} />
          {session.awaitingHuman && (
            <p className="font-body text-[14px] text-brown-medium">
              The stamp lands as soon as it clears.
            </p>
          )}
        </div>

        {/* a dead session explains itself */}
        {cooked.failure && !isStamped && (
          <StampsUnavailable
            compact
            className="mt-2 w-full max-w-md"
            title="Your journal did not open"
            failure={cooked.failure}
            onRetry={cooked.retry}
            retrying={cooked.isRetrying}
          />
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
    title = toast.title;
  } else if (toast.tier === 'repeat') {
    heading = 'Cooked again';
    body = `That is ${toast.count} times for ${name}.`;
  } else {
    heading = 'In your journal';
    body = `${name} is in your Cook's Journal.`;
  }

  // Every cooked message carries the country's stamp, and the stamp opens
  // the journal (2026-09-28, user). It used to show on a new country only.
  if (toast.kind === 'cooked' && country) showStamp = true;

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
            <Link
              href="/journal"
              aria-label={`Open your journal: the ${country} stamp`}
              title="Open your journal"
              className="cook-toast-stamp ink-plinth block shrink-0 rounded-[3px] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              style={{ '--stamp-size': '40px' } as CSSProperties}
            >
              {/* CountryStampSlot is itself a button: keep it out of the
                  tab order and the tree so the link is the one control */}
              <div inert aria-hidden>
                <CountryStampSlot
                  country={country}
                  stamps={[{ id: 'toast', recipe_slug: recipe.id, recipe_country: country, cooked_at: new Date().toISOString() }]}
                  onClick={() => {}}
                />
              </div>
            </Link>
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


/**
 * A round postmark in stamp ink, for a cooked recipe with no country (so no
 * country stamp): two rings, "Cooked" over the top, the kitchen's name under
 * the bottom, the date in the middle. Decorative: the same facts are written
 * out beside it. From the /dev/cook-stamp lab.
 */
function Postmark({ size, date, count }: { size: number; date: Date | null; count: number }) {
  const id = useId().replace(/:/g, '');
  const d = date ?? new Date();
  const dayMonth = `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-GB', { month: 'short' }).toUpperCase()}`;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className="text-terracotta">
      <defs>
        <path id={`${id}t`} d="M 20,60 A 40,40 0 0 1 100,60" />
        <path id={`${id}b`} d="M 12,60 A 48,48 0 0 0 108,60" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <g fill="currentColor" style={{ fontFamily: 'var(--font-stamp), ui-monospace, monospace' }}>
        <text fontSize="11" letterSpacing="3">
          <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">COOKED</textPath>
        </text>
        <text fontSize="8.5" letterSpacing="1.6">
          <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">NIEVES&apos;S KITCHEN</textPath>
        </text>
        <text x="60" y="58" fontSize="14" textAnchor="middle" suppressHydrationWarning>{dayMonth}</text>
        <text x="60" y="73" fontSize={count > 1 ? 9 : 10.5} textAnchor="middle" letterSpacing="1">
          {count > 1 ? `${count} TIMES` : d.getFullYear()}
        </text>
      </g>
      <circle cx="16" cy="60" r="2" fill="currentColor" />
      <circle cx="104" cy="60" r="2" fill="currentColor" />
    </svg>
  );
}
