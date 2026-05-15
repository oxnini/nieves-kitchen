'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

interface Options {
  /** When false, the trap is inert. Default true. */
  active?: boolean;
  /** Called when Escape is pressed; omit to let Escape pass through. */
  onEscape?: () => void;
  /** Move focus into `ref` when the trap activates. Default false. */
  autoFocus?: boolean;
}

/**
 * Keep keyboard focus inside `ref` while the trap is active. Tab/Shift+Tab
 * cycle through focusable descendants; Escape calls `onEscape` if provided.
 *
 * The escape callback is read through a ref, so callers can pass an inline
 * function without re-binding the keydown listener on every render.
 */
export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: Options = {},
): void {
  const { active = true, onEscape, autoFocus = false } = options;

  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    if (autoFocus) ref.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const handler = onEscapeRef.current;
        if (handler) {
          e.preventDefault();
          handler();
        }
        return;
      }
      if (e.key !== 'Tab') return;
      const root = ref.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, autoFocus, ref]);
}
