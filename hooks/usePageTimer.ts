'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';

export interface PageTimerState {
  status: TimerStatus;
  remainingMs: number;
  totalMs: number;
}

export interface PageTimer extends PageTimerState {
  start: (ms: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  dismiss: () => void;
}

const TICK_MS = 250;

/**
 * Dev-only speed multiplier read off window. Values >1 shrink the timer's
 * scheduled duration so the done state is reachable in seconds instead of
 * minutes during visual iteration on /dev/cook-mode. Production reads `1`.
 */
function readSpeed(): number {
  if (typeof window === 'undefined') return 1;
  const w = window as unknown as { __nievesTimerSpeed?: number };
  const n = w.__nievesTimerSpeed;
  if (typeof n === 'number' && Number.isFinite(n) && n >= 1 && n <= 1000) return n;
  return 1;
}

type ACtor = typeof AudioContext | undefined;

function getAudioCtor(): ACtor {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { AudioContext?: ACtor; webkitAudioContext?: ACtor };
  return w.AudioContext ?? w.webkitAudioContext;
}

/**
 * One timer per page. Setting a new duration always replaces the running one.
 * Render cadence is a 250ms interval, but the *math* is wall-clock so the
 * countdown stays accurate even when the tab is backgrounded and the browser
 * throttles setInterval to 1 Hz.
 *
 * The done bell is synthesised in WebAudio (two-partial soft sine, exponential
 * decay) rather than loading an audio asset. Pre-warmed on the first user
 * gesture inside the timer so autoplay policies stay happy.
 *
 * TODO: replace synthesised bell with a real warm bell sample if the tone
 * doesn't sit well next to the rest of the app's palette.
 */
export function usePageTimer(): PageTimer {
  const [state, setState] = useState<PageTimerState>({
    status: 'idle',
    remainingMs: 0,
    totalMs: 0,
  });

  const endsAtRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playedDoneRef = useRef(false);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const ensureAudio = useCallback((): AudioContext | null => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const AC = getAudioCtor();
    if (!AC) return null;
    try {
      audioCtxRef.current = new AC();
    } catch {
      return null;
    }
    return audioCtxRef.current;
  }, []);

  const playBell = useCallback(() => {
    const ctx = audioCtxRef.current ?? ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const now = ctx.currentTime;
    // Two soft partials, exponential decay. Warm, short — no kitchen buzzer.
    const partials = [
      { freq: 660, gain: 0.18, decay: 1.6 },
      { freq: 990, gain: 0.07, decay: 1.1 },
    ];
    for (const p of partials) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(p.gain, now + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + p.decay + 0.05);
    }
  }, [ensureAudio]);

  const tick = useCallback(() => {
    const endsAt = endsAtRef.current;
    if (endsAt === null) return;
    const remaining = Math.max(0, endsAt - Date.now());
    if (remaining <= 0) {
      stopInterval();
      endsAtRef.current = null;
      setState((s) => ({ ...s, status: 'done', remainingMs: 0 }));
      if (!playedDoneRef.current) {
        playedDoneRef.current = true;
        playBell();
      }
      return;
    }
    setState((s) => ({ ...s, remainingMs: remaining }));
  }, [playBell, stopInterval]);

  const start = useCallback(
    (ms: number) => {
      if (ms <= 0) return;
      const ctx = ensureAudio();
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
      const scaled = Math.max(250, Math.round(ms / readSpeed()));
      stopInterval();
      playedDoneRef.current = false;
      pausedRemainingRef.current = null;
      endsAtRef.current = Date.now() + scaled;
      setState({ status: 'running', remainingMs: scaled, totalMs: scaled });
      intervalRef.current = window.setInterval(tick, TICK_MS);
    },
    [ensureAudio, stopInterval, tick],
  );

  const pause = useCallback(() => {
    if (endsAtRef.current === null) return;
    const remaining = Math.max(0, endsAtRef.current - Date.now());
    pausedRemainingRef.current = remaining;
    endsAtRef.current = null;
    stopInterval();
    setState((s) => ({ ...s, status: 'paused', remainingMs: remaining }));
  }, [stopInterval]);

  const resume = useCallback(() => {
    const paused = pausedRemainingRef.current;
    if (paused === null) return;
    endsAtRef.current = Date.now() + paused;
    pausedRemainingRef.current = null;
    setState((s) => ({ ...s, status: 'running' }));
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(tick, TICK_MS);
    }
  }, [tick]);

  const reset = useCallback(() => {
    stopInterval();
    endsAtRef.current = null;
    pausedRemainingRef.current = null;
    playedDoneRef.current = false;
    setState({ status: 'idle', remainingMs: 0, totalMs: 0 });
  }, [stopInterval]);

  const dismiss = useCallback(() => {
    stopInterval();
    endsAtRef.current = null;
    pausedRemainingRef.current = null;
    playedDoneRef.current = false;
    setState({ status: 'idle', remainingMs: 0, totalMs: 0 });
  }, [stopInterval]);

  useEffect(() => {
    return () => {
      stopInterval();
      const ctx = audioCtxRef.current;
      audioCtxRef.current = null;
      if (ctx) ctx.close().catch(() => {});
    };
  }, [stopInterval]);

  return {
    ...state,
    start,
    pause,
    resume,
    reset,
    dismiss,
  };
}
