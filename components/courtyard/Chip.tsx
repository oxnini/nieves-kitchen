import Link from 'next/link';
import type { ReactNode, MouseEventHandler } from 'react';

/**
 * Chip — a "Jump in" pill: creamDeep fill, cobalt text, a faint teal inset
 * ring that firms up on hover. Places and quick filters as fast entry points.
 * The active chip fills cobalt-deep (inverted to brown-dark on the night
 * page via the `.chip-on` rule in globals.css). Renders a `next/link` when
 * given `href`, otherwise a `<button>`.
 */
const INACTIVE =
  'bg-cream-deep text-cobalt shadow-[inset_0_0_0_1.5px_rgba(51,118,119,0.13)] hover:shadow-[inset_0_0_0_1.5px_rgba(51,118,119,0.22)]';

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
  const cls = `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body text-[13px] font-semibold leading-none transition-shadow duration-200 ${
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
      <Link href={href} onClick={onClick} aria-current={active ? 'page' : undefined} className={cls}>
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
