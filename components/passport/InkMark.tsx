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
  { glyph, label, hitSize = 44, size = 16, className = '', disabled, ...rest },
  ref,
) {
  const style = {
    width: `${hitSize}px`,
    height: `${hitSize}px`,
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      style={style}
      className={[
        'group inline-flex items-center justify-center bg-transparent border-0 outline-none',
        'text-brown-dark cursor-pointer',
        'transition-opacity motion-reduce:transition-none duration-150',
        'opacity-[0.55] hover:opacity-100 focus-visible:opacity-100',
        'focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:rounded-sm',
        'disabled:opacity-[0.2] disabled:cursor-not-allowed disabled:hover:opacity-[0.2]',
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
