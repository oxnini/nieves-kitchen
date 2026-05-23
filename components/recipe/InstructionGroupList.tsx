'use client';

import type { StepGroup } from '@/lib/types';
import { usePageTimerContext } from './PageTimerContext';
import DurationToken from './DurationToken';

interface Props {
  groups: StepGroup[];
  isChecked: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => boolean;
  toggle: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => void;
  /** When true, prose renders duration tokens as tappable timer seeds. */
  cookMode?: boolean;
}

/**
 * Grouped step rendering. Numbering is continuous across groups:
 * group 1 ends at step 3, group 2 begins at step 4. Per-group headings
 * and headnotes are italic Literata when present. In cook mode each step's
 * prose runs through `DurationToken`, which underlines tappable durations
 * and seeds the page timer on tap.
 */
export default function InstructionGroupList({
  groups,
  isChecked,
  toggle,
  cookMode = false,
}: Props) {
  const showHeadings = groups.length > 1 || !!groups[0]?.heading;
  const timer = usePageTimerContext();

  let stepNumber = 0;

  return (
    <div className="space-y-7">
      {groups.map((group, gIdx) => {
        const heading = group.heading?.trim();
        const headnote = group.headnote?.trim();
        return (
          <section key={`${gIdx}-${heading ?? 'group'}`}>
            {showHeadings && heading && (
              <h3 className={`font-heading text-lg font-semibold text-brown-dark ${headnote ? 'mb-2' : 'mb-4'}`}>
                {heading}
              </h3>
            )}
            {headnote && (
              <p className="font-heading italic text-brown-medium text-[15px] leading-relaxed mb-4 max-w-prose">
                {headnote}
              </p>
            )}
            <ol className="space-y-5 list-none pl-0">
              {group.items.map((step, i) => {
                stepNumber += 1;
                const n = stepNumber;
                const checked = isChecked('steps', gIdx, i);
                return (
                  <li
                    key={i}
                    className={`flex gap-3 transition-opacity ${checked ? 'opacity-50' : ''}`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle('steps', gIdx, i)}
                        className="editorial-check mt-[9px]"
                      />
                      <span
                        aria-hidden="true"
                        className="shrink-0 w-8 h-8 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5"
                      >
                        {n}
                      </span>
                      <p className={`text-base text-brown-dark leading-relaxed max-w-prose ${
                        checked ? 'line-through' : ''
                      }`}>
                        <DurationToken
                          text={step}
                          cookMode={cookMode && !!timer}
                          onTap={(ms) => timer?.start(ms)}
                        />
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
