import type { ReactNode } from 'react';

/**
 * DropCap — opens a recipe intro with a large Newsreader initial, floated left, in
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
  // Only the plain-string case slices the initial off the visible text; with
  // an explicit `cap`, children already omit it.
  const rest = isString && !cap ? children.slice(1) : children;

  // Assistive tech reads the paragraph once, whole.
  //  - String child: the visual cap and the sliced rest are aria-hidden and an
  //    sr-only copy carries the full string (plain text, safe to duplicate).
  //  - Explicit `cap`: children may hold links, so they are NOT duplicated
  //    (that would add hidden-but-focusable tab stops). Only the visual cap is
  //    hidden; an sr-only copy of the letter sits right before the children.
  if (letter && isString && !cap) {
    return (
      <p className={`font-body text-[18px] leading-[1.7] text-ink ${className}`}>
        <span className="sr-only">{children}</span>
        <span aria-hidden="true">
          <span className="font-heading font-normal text-[80px] leading-[0.8] float-left pt-2 pr-3 text-terracotta">
            {letter}
          </span>
          {rest}
        </span>
      </p>
    );
  }

  return (
    <p className={`font-body text-[18px] leading-[1.7] text-ink ${className}`}>
      {letter && (
        <>
          <span
            aria-hidden="true"
            className="font-heading font-normal text-[80px] leading-[0.8] float-left pt-2 pr-3 text-terracotta"
          >
            {letter}
          </span>
          <span className="sr-only">{letter}</span>
        </>
      )}
      {rest}
    </p>
  );
}
