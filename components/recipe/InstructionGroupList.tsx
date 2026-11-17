'use client';

import type { StepGroup } from '@/lib/types';
import { usePageTimerContext } from './PageTimerContext';
import DurationToken from './DurationToken';
import { NoteRef, splitNoteRefs } from './RecipeNotes';

interface Props {
  groups: StepGroup[];
  isChecked: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => boolean;
  toggle: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => void;
  /** When true, prose renders duration tokens as tappable timer seeds. */
  cookMode?: boolean;
  /** Cook mode: index (0-based, across groups) of the step the cook is on. */
  currentStep?: number;
  /** Cook mode: tapping a step's number makes it the current step. */
  onSelectStep?: (index: number) => void;
}

/**
 * Grouped step rendering. Numbering is continuous across groups:
 * group 1 ends at step 3, group 2 begins at step 4. Per-group headings
 * and headnotes are italic Newsreader in muted ink when present; step
 * numbers are teal Newsreader numerals, rows ruled by hairlines. In cook mode each step's
 * prose runs through `DurationToken`, which underlines tappable durations
 * and seeds the page timer on tap.
 */
export default function InstructionGroupList({
  groups,
  isChecked,
  toggle,
  cookMode = false,
  currentStep,
  onSelectStep,
}: Props) {
  const showHeadings = groups.length > 1 || !!groups[0]?.heading;
  const timer = usePageTimerContext();

  let stepNumber = 0;

  return (
    <div className="space-y-4">
      {groups.map((group, gIdx) => {
        const heading = group.heading?.trim();
        const headnote = group.headnote?.trim();
        return (
          <section key={`${gIdx}-${heading ?? 'group'}`}>
            {showHeadings && heading && (
              <h3 className={`pt-4 font-heading italic font-normal text-base text-brown-medium ${headnote ? 'mb-1' : 'mb-0.5'}`}>
                {heading}
              </h3>
            )}
            {headnote && (
              <p className="font-heading italic text-brown-medium text-[15px] leading-relaxed mb-1 max-w-prose">
                {headnote}
              </p>
            )}
            <ol className="list-none pl-0">
              {group.items.map((step, i) => {
                stepNumber += 1;
                const n = stepNumber;
                const index = n - 1;
                const checked = isChecked('steps', gIdx, i);
                // The step the card is on: a deep-mist band with a teal rule
                // at its left edge, so the list and the card agree (audit C3).
                const isCurrent = cookMode && currentStep === index;
                const numeral = (
                  <span className="font-heading text-[24px] leading-none text-teal tabular-nums">{n}</span>
                );
                return (
                  <li
                    key={i}
                    data-step={index}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`flex gap-3 py-3 border-b border-line transition-[opacity,background-color] ${
                      checked && !isCurrent ? 'opacity-50' : ''
                    } ${isCurrent ? '-mx-3 px-3 bg-parchment-dark shadow-[inset_3px_0_0_var(--color-teal)]' : ''}`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle('steps', gIdx, i)}
                        className="editorial-check mt-[5px]"
                      />
                      {cookMode && onSelectStep ? (
                        // A button inside the label: activating an interactive
                        // descendant never toggles the label's checkbox.
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectStep(index);
                          }}
                          aria-label={`Go to step ${n}`}
                          className="w-7 shrink-0 -my-2 pt-2.5 pb-2 text-right rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                        >
                          {numeral}
                        </button>
                      ) : (
                        <span aria-hidden="true" className="w-7 text-right shrink-0 pt-0.5">{numeral}</span>
                      )}
                      <p className={`text-base text-brown-dark leading-relaxed max-w-prose ${
                        checked ? 'line-through' : ''
                      }`}>
                        {splitNoteRefs(step).map((part, k) =>
                          typeof part === 'number' ? (
                            <span key={k}>(<NoteRef n={part} label={`see note ${part}`} />)</span>
                          ) : (
                            <DurationToken
                              key={k}
                              text={part}
                              cookMode={cookMode && !!timer}
                              onTap={(ms) => timer?.start(ms, `Step ${n}`)}
                            />
                          ),
                        )}
                      </p>
                    </label>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
