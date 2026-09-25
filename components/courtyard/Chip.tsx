import Link from 'next/link';
import type { ReactNode, MouseEventHandler } from 'react';

/**
 * Chip — the configurator's pill: transparent fill, a 1px `line` inset ring,
 * regular-weight body text in ink. The active chip fills cobalt-deep with
 * cream text (inverted to brown-dark on the night page via the `.chip-on`
 * rule in globals.css). Renders a `next/link` when given `href`, otherwise
 * a `<button>`.
 */
const INACTIVE =
  'text-brown-dark shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_var(--color-brown-light)]';

export function Chip({
  children,
  active = false,
  iconLeft,
  href,
  onClick,
  className = '',
}: {
  children: ReactNode;
  active?: boolean;
  iconLeft?: ReactNode;
  href?: string;
  onClick?: MouseEventHandler;
  className?: string;
}) {
  const cls = `inline-flex items-center gap-1.5 rounded-full px-[15px] py-2 font-body text-[14px] font-normal leading-none transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
    active ? 'chip-on bg-cobalt-deep text-cream' : INACTIVE
  } ${className}`;
  const inner = (
    <>
      {iconLeft}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} scroll={false} onClick={onClick} aria-current={active ? 'page' : undefined} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cls}>
      {inner}
    </button>
  );
}
