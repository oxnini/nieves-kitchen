'use client';

import { runIn, withLinks } from './SupplementarySections';

/**
 * Numbered recipe notes, RecipeTin Eats style: an ingredient's small number,
 * or "(see note N)" in a step, jumps here. Shown in read and cook mode alike,
 * since a cook mid-recipe is exactly who goes looking for a note, and placed
 * straight after the ingredients and method so it is never far away.
 */

export const noteId = (n: number) => `note-${n}`;

/** The small number after an ingredient (or the link a step reference becomes). */
export function NoteRef({ n, label }: { n: number; label?: string }) {
  return (
    <a
      href={`#${noteId(n)}`}
      aria-label={`Note ${n}`}
      className={
        label
          ? 'text-teal underline decoration-teal/35 underline-offset-[3px] hover:decoration-teal'
          : 'ml-1 align-super text-[13px] leading-none font-semibold text-teal no-underline hover:underline'
      }
    >
      {label ?? n}
    </a>
  );
}

const STEP_REF = /\(see note (\d+)\)/g;

/** Split step text around "(see note N)" so each reference renders as a link. */
export function splitNoteRefs(text: string): Array<string | number> {
  const out: Array<string | number> = [];
  let last = 0;
  for (const m of text.matchAll(STEP_REF)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(Number(m[1]));
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function RecipeNotes({ notes }: { notes: string[] }) {
  return (
    <section aria-labelledby="recipe-notes">
      <h2
        id="recipe-notes"
        className="font-heading text-[25px] font-normal text-brown-dark border-b border-brown-dark pb-2.5 mb-1"
      >
        Notes
      </h2>
      <ol className="md:columns-2 md:gap-x-14">
        {notes.map((note, i) => {
          const [term, rest] = runIn(note);
          return (
            <li
              key={i}
              id={noteId(i + 1)}
              className="relative break-inside-avoid scroll-mt-[calc(var(--nav-h)+16px)] py-3 pl-8 border-b border-line font-body text-[16px] sm:text-[17px] text-brown-dark leading-[1.7] target:bg-parchment-dark"
            >
              <span aria-hidden className="absolute left-0 top-3 font-heading text-lg tabular-nums text-teal">
                {i + 1}
              </span>
              {term && <b className="font-heading text-[18px] font-semibold">{term}</b>} {withLinks(rest)}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
