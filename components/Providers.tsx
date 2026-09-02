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
  | 'awaiting-human'      // Cloudflare is showing a challenge nobody answered
  | 'timeout';            // nothing resolved inside SESSION_TIMEOUT_MS

export type SessionStatus = 'checking' | 'ready' | 'unavailable';

export interface SessionState {
  status: SessionStatus;
  failure: SessionFailure | null;
  /** Tear the widget down and start the whole handshake again. */
  retry: () => void;
}

const SessionContext = createContext<SessionState>({
  status: 'checking',
  failure: null,
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
 * How long the handshake may sit in `checking` before we call it. Generous
 * enough for a slow connection plus a Cloudflare round trip, short enough that
 * a blocked widget (ad blocker, strict privacy mode, offline) stops pretending
 * to load. The clock is paused while Cloudflare is waiting on a human, since
 * an interactive challenge legitimately takes as long as the user takes.
 */
const SESSION_TIMEOUT_MS = 15000;

/**
 * The backstop that is never paused. `appearance: 'interaction-only'` puts any
 * real challenge in a small widget in the bottom corner, which is very easy to
 * miss — so "waiting on a human" cannot be allowed to mean "waiting forever".
 * When this fires we say what is actually happening and point at the widget,
 * rather than reporting a generic timeout.
 */
const SESSION_HARD_TIMEOUT_MS = 45000;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5 },
    },
  }));

  const [status, setStatus] = useState<SessionStatus>('checking');
  const [failure, setFailure] = useState<SessionFailure | null>(null);
  const [needsCaptcha, setNeedsCaptcha] = useState(false);
  // Bumped by `retry()`. Re-runs the getSession effect and remounts the widget
  // (it's keyed on this), which is the only reliable way to re-arm Turnstile
  // after an error.
  const [attempt, setAttempt] = useState(0);
  // Cloudflare has put a visible challenge in front of the user. Their thinking
  // time is not a failure, so it holds the timeout open.
  const [awaitingHuman, setAwaitingHuman] = useState(false);
  // Read by the hard timeout, which must not restart every time the challenge
  // flips between visible and not.
  const awaitingHumanRef = useRef(false);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  const fail = useCallback((reason: SessionFailure) => {
    setStatus(prev => (prev === 'ready' ? prev : 'unavailable'));
    setFailure(prev => prev ?? reason);
  }, []);

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
      if (!TURNSTILE_SITE_KEY) {
        // No site key means the widget never renders, so no anonymous session
        // can ever be created. Say so now rather than spinning for 15s.
        fail('no-captcha-key');
        return;
      }
      setNeedsCaptcha(true);
    }).catch((error: unknown) => {
      if (cancelled) return;
      console.error('Could not read the Supabase session:', error);
      fail('sign-in-failed');
    });

    return () => { cancelled = true; };
  }, [attempt, fail]);

  useEffect(() => {
    if (status !== 'checking' || awaitingHuman) return;
    const t = setTimeout(() => fail('timeout'), SESSION_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [status, awaitingHuman, attempt, fail]);

  // `awaitingHuman` deliberately does not clear this one.
  useEffect(() => {
    if (status !== 'checking') return;
    const t = setTimeout(
      () => fail(awaitingHumanRef.current ? 'awaiting-human' : 'timeout'),
      SESSION_HARD_TIMEOUT_MS,
    );
    return () => clearTimeout(t);
  }, [status, attempt, fail]);

  const handleCaptchaSuccess = useCallback(async (token: string) => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    const session = await ensureAnonymousSession(supabase, token);
    if (session) {
      setStatus('ready');
      setFailure(null);
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
    fail('captcha-failed');
  }, [fail]);

  // An expired token is only fatal if we never got a session out of it; the
  // widget re-issues on its own, so we stay in `checking` and let the timeout
  // decide.
  const handleCaptchaExpire = useCallback(() => {
    console.warn('Turnstile token expired; the widget will re-issue a new one.');
  }, []);

  const setAwaiting = useCallback((v: boolean) => {
    awaitingHumanRef.current = v;
    setAwaitingHuman(v);
  }, []);

  const retry = useCallback(() => {
    setStatus('checking');
    setFailure(null);
    setNeedsCaptcha(false);
    setAwaiting(false);
    setAttempt(a => a + 1);
  }, [setAwaiting]);

  const sessionState = useMemo<SessionState>(
    () => ({ status, failure, retry }),
    [status, failure, retry],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={sessionState}>
        {/* reducedMotion="user" makes every framer-motion animation across the
            app honour the OS "reduce motion" setting (transforms/layout become
            instant; opacity is kept). No effect for users who haven't set it. */}
        <MotionConfig reducedMotion="user">
        <PassportOverlayProvider>{children}</PassportOverlayProvider>
        {needsCaptcha && TURNSTILE_SITE_KEY ? (
          // z-[80] sits above the recipe modal (backdrop z-[60], sheet z-[70]) so
          // that if Cloudflare serves an *interactive* challenge while a recipe is
          // open — common on mobile — the checkbox is reachable instead of buried.
          <div className="fixed bottom-4 right-4 z-[80]">
            <Turnstile
              key={attempt}
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={handleCaptchaSuccess}
              onError={handleCaptchaError}
              onExpire={handleCaptchaExpire}
              onTimeout={handleCaptchaError}
              onUnsupported={() => fail('captcha-unsupported')}
              onBeforeInteractive={() => setAwaiting(true)}
              onAfterInteractive={() => setAwaiting(false)}
              options={{ appearance: 'interaction-only', theme: 'auto' }}
            />
          </div>
        ) : null}
        </MotionConfig>
      </SessionContext.Provider>
    </QueryClientProvider>
  );
}
