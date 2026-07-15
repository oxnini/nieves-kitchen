import type { ReactNode } from 'react';

/**
 * DropCap — opens a recipe intro with a large Fraunces initial, floated left, in
 * terracotta. Pass the paragraph as a string child and its first character
 * becomes the cap; pass non-string children (e.g. inline-nav prose) and provide
 * the initial explicitly via `cap`.
 */
export function DropCap({
  children,
  cap,
  className = '',
}: {
  children: ReactNode;
  /** Explicit initial letter when `children` is not a plain string. */
  cap?: string;
  className?: string;
}) {
  const isString = typeof children === 'string';
  const letter = cap ?? (isString ? children.charAt(0) : '');
  const rest = isString && !cap ? children.slice(1) : children;

  return (
    <p className={`font-body text-[18px] leading-[1.7] text-ink ${className}`}>
      {letter && (
        <span
          aria-hidden
          className="float-left mr-2.5 pt-1.5 font-heading font-normal text-terracotta"
          style={{ fontSize: 60, lineHeight: 0.82 }}
        >
          {letter}
        </span>
      )}
      {rest}
    </p>
  );
}
