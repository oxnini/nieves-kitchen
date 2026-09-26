export interface JournalSectionHeadProps {
  /** "Titles" / "The log" / "Stamps collected". */
  title: string;
  /** Right-hand muted count, e.g. "8 meals", "3 countries, 2 regions". */
  count: string;
}

/**
 * The shared section head for Titles / The log / Stamps collected (R102,
 * R112 — replaces three copy-pasted heads with one component): `<h2>`
 * Newsreader 400 ~25px, flex justify-between items-baseline, `pb-2.5
 * border-b border-teal`, right-hand `<small>` muted sans 13.5px count.
 *
 * The `journal-sh` class carries no styling of its own — it's a CSS-only
 * hook (`app/globals.css`, under `[data-theme="sepia"]`) that lifts the
 * border-teal rule to the legible link teal at night, the same problem
 * `.text-teal` already solves for text (C2, Phase 8 review round 1): the
 * unlit `--color-teal` fill value is ~1.87:1 on the night page.
 */
export default function JournalSectionHead({ title, count }: JournalSectionHeadProps) {
  return (
    <h2 className="journal-sh font-heading font-normal text-[25px] text-brown-dark mb-1.5 pb-2.5 border-b border-teal flex justify-between items-baseline gap-4">
      {title}
      <small className="font-body text-[13.5px] font-normal text-brown-medium">{count}</small>
    </h2>
  );
}

/** "N country"/"N countries" etc, singular-aware. Shared by Titles/Log/Stamps counts. */
export function plural(n: number, singular: string, pluralWord: string): string {
  return `${n} ${n === 1 ? singular : pluralWord}`;
}
