import Link from 'next/link';
import type { ReactNode, MouseEventHandler } from 'react';

/**
 * Button — the brand's action control.
 *  primary   = cobalt fill, cream text (the workhorse)
 *  secondary = cobalt-ink text with a 2px cobalt-ink inset ring, transparent
 *              fill. Uses the theme-swapping ink token (brown-dark) so the
 *              control lifts to cream on the dark night page.
 *  accent    = terracotta fill, cream text (one strong CTA per view)
 * Lifts -2px on hover. The label names the action ("Browse recipes").
 *
 * Renders a `next/link` when given an internal `href`, otherwise a `<button>`.
 */
const SIZES = {
  sm: 'px-3.5 py-2 text-[14px]',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-6 py-3 text-[16px]',
} as const;

const VARIANTS = {
  primary: 'bg-cobalt text-cream hover:bg-cobalt-deep hover:-translate-y-0.5 hover:shadow-md',
  secondary:
    'text-brown-dark bg-transparent shadow-[inset_0_0_0_2px_var(--color-brown-dark)] hover:bg-cobalt/[0.06]',
  accent: 'bg-terracotta text-cream hover:bg-[#B0542F] hover:-translate-y-0.5 hover:shadow-md',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  iconLeft,
  iconRight,
  fullWidth = false,
  href,
  onClick,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
}: {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  href?: string;
  onClick?: MouseEventHandler;
  type?: 'button' | 'submit';
  className?: string;
  'aria-label'?: string;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-md font-body font-bold leading-none transition-[transform,background-color,box-shadow] duration-200 ${
    fullWidth ? 'w-full' : ''
  } ${SIZES[size]} ${VARIANTS[variant]} ${className}`;
  const inner = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} aria-label={ariaLabel} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={cls}>
      {inner}
    </button>
  );
}
