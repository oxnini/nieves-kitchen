'use client';

import { RotateCw } from 'lucide-react';
import type { SessionFailure } from '@/components/Providers';

/** `SessionFailure` plus the one non-session way stamps can fail to arrive. */
export type StampsFailure = SessionFailure | 'load-failed';

/**
 * One honest line per failure. Every stamp surface reads from this table so
 * /journal, the passport and the cooked button never contradict each other.
 * Deliberately blame-free and specific enough to be actionable: the common
 * real cause is a privacy extension eating the Cloudflare browser check.
 */
const EXPLANATION: Record<StampsFailure, string> = {
  'no-captcha-key':
    'The browser check this site uses to open a passport is not configured on this build, so nothing can be recorded here yet.',
  'captcha-failed':
    'The browser check did not finish. A privacy extension or a strict content blocker is the usual reason.',
  'captcha-unsupported':
    'This browser cannot run the check that opens a passport. A current version of Chrome, Safari, Firefox or Edge will work.',
  'sign-in-failed':
    'The check passed but the passport would not open. This is almost always momentary.',
  'awaiting-human':
    'There is a quick browser check waiting in the bottom corner of the screen. Finish it and this opens straight away.',
  timeout:
    'This is taking longer than it should. The connection may be down, or a privacy extension may be holding up the browser check.',
  'load-failed':
    'Your stamps did not come back from the kitchen. The connection may have dropped mid-request.',
};

/**
 * The shared dead-end state for anything that depends on a Supabase session:
 * `/journal`, the passport booklet, and the cooked button. Replaces the
 * indefinite skeleton those surfaces used to show when the anonymous session
 * never established.
 *
 * Sits on whatever surface it is dropped into (parchment, sepia, or the
 * `passport-light`-locked booklet paper) because every token here is
 * theme-aware.
 */
export default function StampsUnavailable({
  title,
  failure,
  onRetry,
  retrying = false,
  compact = false,
  className = '',
}: {
  title: string;
  failure: StampsFailure;
  onRetry: () => void;
  /** Disables the control and swaps its label while a retry is in flight. */
  retrying?: boolean;
  /** Tighter type and spacing, for the cooked button's inline slot. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={`flex flex-col items-start gap-3 ${className}`}
    >
      <h2
        className={
          compact
            ? 'font-heading text-base font-semibold text-brown-dark'
            : 'font-heading text-2xl sm:text-3xl font-bold text-brown-dark leading-tight'
        }
      >
        {title}
      </h2>

      <p
        className={
          compact
            ? 'font-body text-[13px] leading-relaxed text-brown-medium max-w-[46ch]'
            : 'font-body text-base leading-relaxed text-brown-medium max-w-[54ch]'
        }
      >
        {EXPLANATION[failure]}
      </p>

      {failure !== 'no-captcha-key' && (
        <p
          className={
            compact
              ? 'font-body text-[13px] leading-relaxed text-brown-medium/80 max-w-[46ch]'
              : 'font-body text-base leading-relaxed text-brown-medium/80 max-w-[54ch]'
          }
        >
          Nothing has been lost. Every dish you have already cooked is still recorded.
        </p>
      )}

      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className={
          'mt-1 inline-flex items-center gap-2 rounded-md font-body font-bold leading-none ' +
          'text-brown-dark bg-transparent shadow-[inset_0_0_0_2px_var(--color-brown-dark)] ' +
          'hover:bg-cobalt/[0.06] transition-colors disabled:opacity-55 disabled:cursor-default ' +
          'focus-visible:outline-2 focus-visible:outline-turmeric focus-visible:outline-offset-2 outline-none ' +
          (compact ? 'px-3.5 py-2 text-[14px]' : 'px-5 py-2.5 text-[15px]')
        }
      >
        <RotateCw
          size={compact ? 13 : 15}
          aria-hidden
          className={retrying ? 'animate-spin motion-reduce:animate-none' : ''}
        />
        {retrying ? 'Trying again' : 'Try again'}
      </button>
    </div>
  );
}
