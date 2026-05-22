'use client';

/**
 * Single postal-feeling line on the page. Cutive Mono, small caps, brown-medium.
 * Flanked by thin rules so it reads as a postmark rather than ordinary text.
 */
export default function AttributionLine({ text }: { text?: string }) {
  const trimmed = text?.trim();
  if (!trimmed) return null;

  return (
    <div className="flex items-center gap-3 mb-10 mt-1">
      <span className="h-px flex-1 bg-brown-light/30" aria-hidden="true" />
      <span className="font-stamp text-[11px] text-brown-medium whitespace-normal text-center">
        {trimmed}
      </span>
      <span className="h-px flex-1 bg-brown-light/30" aria-hidden="true" />
    </div>
  );
}
