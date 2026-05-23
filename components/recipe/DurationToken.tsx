'use client';

import { Fragment, type ReactNode } from 'react';
import { detectDurations } from '@/lib/recipes/duration-detect';

interface Props {
  text: string;
  onTap: (ms: number) => void;
  cookMode: boolean;
}

/**
 * Returns the step prose. In read mode the function is a no-op and emits
 * the raw string. In cook mode any matched duration ("for 25 minutes",
 * "20–30 mins") is wrapped in a button with a quiet dotted underline; tap
 * starts the page timer at the lower bound of the range.
 *
 * Render is plain text + buttons, no chip backgrounds. The token should
 * read as text that happens to be underlined.
 */
export default function DurationToken({ text, onTap, cookMode }: Props) {
  if (!cookMode || !text) return <>{text}</>;
  const matches = detectDurations(text);
  if (matches.length === 0) return <>{text}</>;

  const parts: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) parts.push(text.slice(cursor, m.start));
    const segment = text.slice(m.start, m.end);
    parts.push(
      <button
        key={`dur-${i}-${m.start}`}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTap(m.lowerBoundMs);
        }}
        className="duration-token"
        aria-label={`Start timer for ${segment}`}
      >
        {segment}
      </button>,
    );
    cursor = m.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
