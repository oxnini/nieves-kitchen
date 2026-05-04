'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface InkMarkProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The glyph (Lucide icon or inline SVG) shown inside the mark. */
  glyph: ReactNode;
  /** Required accessible label. */
  label: string;
  /** Hit area square size in px. Default 44. */
  hitSize?: number;
  /** Visible glyph size in px. Default 16. */
  size?: number;
  /**
   * Visual variant.
   * - `ink` (default): dark brown ink on parchment, ~0.55 resting opacity.
   * - `translucent`: white at 40% resting, brightens on hover/focus. For
   *   marks that sit on the dark modal scrim instead of the page material.
   */
  variant?: 'ink' | 'translucent';
}

/**
 * Inked passport mark — minimal hairline glyph on the page material.
 *
 * IMPORTANT: This component applies NO positioning utilities in its base
 * classes. Consumers must position it themselves via `className`
 * (e.g. `absolute top-4 right-4`). Do not add `relative` / `absolute`
 * here — a previous attempt baked `relative` into the base and silently
 * broke consumers' absolute positioning.
 */
const InkMark = forwardRef<HTMLButtonElement, InkMarkProps>(function InkMark(
  {
    glyph,
    label,
    hitSize = 44,
    size = 16,
    className = '',
    disabled,
    variant = 'ink',
    ...rest
  },
  ref,
) {
  const style = {
    width: `${hitSize}px`,
    height: `${hitSize}px`,
  };

  const variantClasses =
    variant === 'translucent'
      ? [
          'text-white',
          'opacity-40 hover:opacity-90 focus-visible:opacity-90',
          'disabled:opacity-15 disabled:cursor-not-allowed disabled:hover:opacity-15',
        ].join(' ')
      : [
          'text-brown-dark',
          'opacity-[0.55] hover:opacity-100 focus-visible:opacity-100',
          'disabled:opacity-[0.2] disabled:cursor-not-allowed disabled:hover:opacity-[0.2]',
        ].join(' ');

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      style={style}
      className={[
        'group inline-flex items-center justify-center bg-transparent border-0 outline-none cursor-pointer',
        'transition-opacity motion-reduce:transition-none duration-150',
        'focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:rounded-sm',
        variantClasses,
        className,
      ].join(' ')}
      {...rest}
    >
      <span
        aria-hidden
        className="inline-flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {glyph}
      </span>
    </button>
  );
});

export default InkMark;
