'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { ensureAnonymousSession } from '@/lib/supabase/anonymous';
import PassportOverlayProvider from './passport/PassportOverlay';

/**
 * Why an anonymous session could not be established. Each maps to one line of
 * user-facing copy in `components/StampsUnavailable.tsx`; keep them in sync.
 */
export type SessionFailure =
  | 'no-captcha-key'      // NEXT_PUBLIC_TURNSTILE_SITE_KEY missing from the build
  | 'captcha-failed'      // widget errored, expired unsolved, or was blocked
  | 'captcha-unsupported' // browser can't run the challenge at all
  | 'sign-in-failed'      // captcha solved, but signInAnonymously rejected
  | 'timeout';            // nothing resolved inside SESSION_TIMEOUT_MS

/**
 * - `checking`: reading any existing session from storage (milliseconds).
 * - `none`: no session, and nobody has asked for one. Nothing is loaded. A new
 *   visitor stays here until they cook, so most never meet the captcha.
 * - `verifying`: someone tapped "I cooked this"; the Turnstile widget is
 *   mounted in that slip and the handshake is running.
 */
export type SessionStatus = 'checking' | 'none' | 'verifying' | 'ready' | 'unavailable';

export interface SessionState {
  status: SessionStatus;
  failure: SessionFailure | null;
  /** Cloudflare is showing a visible challenge in the slip. */
  awaitingHuman: boolean;
  /**
   * Start the handshake, rendering the widget into `host` (the slip's check
   * slot). A no-op unless the status is `none`.
   */
  begin: (host: HTMLElement) => void;
  /** The host is unmounting: tear its widget down and fall back to `none`. */
  release: (host: HTMLElement) => void;
  /** Tear the widget down and start the whole handshake again. */
  retry: () => void;
}

const SessionContext = createContext<SessionState>({
  status: 'checking',
  failure: null,
  awaitingHuman: false,
  begin: () => {},
  release: () => {},
  retry: () => {},
});

/** True only once stamps can actually be read/written. */
export function useSessionReady() {
  return useContext(SessionContext).status === 'ready';
}

/** The full handshake state, for surfaces that must explain a dead end. */
export function useSessionState() {
  return useContext(SessionContext);
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * How long the handshake may run before we call it. Generous enough for a
 * slow connection plus a Cloudflare round trip, short enough that a blocked
 * widget (ad blocker, strict privacy mode, offline) stops pretending to load.
 * The clock is paused while Cloudflare is waiting on a human: the challenge
 * sits in the slip the cook just tapped, with a line saying what it is, so
 * their thinking time is not a failure. An abandoned challenge ends through
 * Turnstile's own `onTimeout`.
 */
const SESSION_TIMEOUT_MS = 15000;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5 },
    },
  }));

  const [status, setStatus] = useState<SessionStatus>('checking');
  const [failure, setFailure] = useState<SessionFailure | null>(null);
  // Bumped by `retry()`. Re-runs the getSession effect and remounts the widget
  // (it's keyed on this), which is the only reliable way to re-arm Turnstile
  // after an error.
  const [attempt, setAttempt] = useState(0);
  const [awaitingHuman, setAwaitingHuman] = useState(false);
  // Where the widget renders: the check slot of the slip that asked. Mirrored
  // in a ref so the getSession effect can tell whether a cook is waiting.
  const [host, setHost] = useState<HTMLElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  const fail = useCallback((reason: SessionFailure) => {
    setStatus(prev => (prev === 'ready' ? prev : 'unavailable'));
    setFailure(prev => prev ?? reason);
  }, []);

  // A cook is waiting on a session: run the check, or explain why it can't.
  const startVerifying = useCallback(() => {
    if (!TURNSTILE_SITE_KEY) {
      // No site key means the widget never renders, so no anonymous session
      // can ever be created. Say so now rather than spinning for 15s.
      fail('no-captcha-key');
      return;
    }
    setStatus('verifying');
  }, [fail]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabaseRef.current = supabase;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) {
        setStatus('ready');
        return;
      }
      // No session is not a failure: the journal is simply empty. Only start
      // the check if a cook is already waiting on it (a retry from the slip).
      if (hostRef.current) startVerifying();
      else setStatus('none');
    }).catch((error: unknown) => {
      if (cancelled) return;
      console.error('Could not read the Supabase session:', error);
      fail('sign-in-failed');
    });

    return () => { cancelled = true; };
  }, [attempt, fail, startVerifying]);

  useEffect(() => {
    if ((status !== 'checking' && status !== 'verifying') || awaitingHuman) return;
    const t = setTimeout(() => fail('timeout'), SESSION_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [status, awaitingHuman, attempt, fail]);

  const begin = useCallback((el: HTMLElement) => {
    if (status !== 'none') return;
    hostRef.current = el;
    setHost(el);
    startVerifying();
  }, [status, startVerifying]);

  const release = useCallback((el: HTMLElement) => {
    if (hostRef.current !== el) return;
    hostRef.current = null;
    setHost(null);
    setAwaitingHuman(false);
    // Leaving mid-check is not a failure; the next tap starts afresh.
    setStatus(prev => (prev === 'verifying' ? 'none' : prev));
  }, []);

  const handleCaptchaSuccess = useCallback(async (token: string) => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    const session = await ensureAnonymousSession(supabase, token);
    if (session) {
      setStatus('ready');
      setFailure(null);
      setAwaitingHuman(false);
    } else {
      fail('sign-in-failed');
    }
  }, [fail]);

  // Surface captcha failures. Without these, a domain/hostname mismatch (e.g.
  // loading the dev server over a LAN IP that isn't in the Turnstile widget's
  // allowed hostnames) fails silently: no token, no session, and the only
  // downstream symptom is a vague "couldn't log this cook" toast.
  const handleCaptchaError = useCallback((error?: unknown) => {
    console.error(
      'Turnstile challenge failed — no anonymous session will be created. ' +
        'Confirm this hostname is in the widget’s allowed domains.',
      error,
    );
    setAwaitingHuman(false);
    fail('captcha-failed');
  }, [fail]);

  // An expired token is only fatal if we never got a session out of it; the
  // widget re-issues on its own, so we stay in `verifying` and let the timeout
  // decide.
  const handleCaptchaExpire = useCallback(() => {
    console.warn('Turnstile token expired; the widget will re-issue a new one.');
  }, []);

  const retry = useCallback(() => {
    setStatus('checking');
    setFailure(null);
    setAwaitingHuman(false);
    setAttempt(a => a + 1);
  }, []);

  const sessionState = useMemo<SessionState>(
    () => ({ status, failure, awaitingHuman, begin, release, retry }),
    [status, failure, awaitingHuman, begin, release, retry],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={sessionState}>
        {/* reducedMotion="user" makes every framer-motion animation across the
            app honour the OS "reduce motion" setting (transforms/layout become
            instant; opacity is kept). No effect for users who haven't set it. */}
        <MotionConfig reducedMotion="user">
        <PassportOverlayProvider>{children}</PassportOverlayProvider>
        {/* The widget lives in the slip that asked for it, so an interactive
            challenge appears beside the button the cook just tapped. Mounting
            it only then also keeps Cloudflare's script off every other page
            view. It stays mounted after a failure so a late success still
            lands; `retry` remounts it via the key. */}
        {host && TURNSTILE_SITE_KEY && status !== 'ready'
          ? createPortal(
              <Turnstile
                key={attempt}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={handleCaptchaSuccess}
                onError={handleCaptchaError}
                onExpire={handleCaptchaExpire}
                onTimeout={handleCaptchaError}
                onUnsupported={() => fail('captcha-unsupported')}
                onBeforeInteractive={() => setAwaitingHuman(true)}
                onAfterInteractive={() => setAwaitingHuman(false)}
                options={{ appearance: 'interaction-only', theme: 'auto' }}
              />,
              host,
            )
          : null}
        </MotionConfig>
      </SessionContext.Provider>
    </QueryClientProvider>
  );
}
