'use client';

/**
 * The italic line under the recipe title: its attribution, then what it riffs
 * on ("Inspired by …"), composed by the caller. Newsreader italic in muted ink,
 * on the paper. Renders nothing when there is nothing to say.
 */
export default function AttributionLine({ text }: { text?: string }) {
  const trimmed = text?.trim();
  if (!trimmed) return null;

  return (
    <p className="mt-2.5 font-heading italic text-lg leading-snug text-brown-medium">
      {trimmed}
    </p>
  );
}
