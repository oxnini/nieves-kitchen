'use client';

import { DropCap } from '@/components/courtyard';

/**
 * The lede: the recipe's description, drop-cap-able. `dropcap` is opt-in per
 * recipe to keep the type discipline tight; when set, the lede opens with the
 * terracotta Newsreader drop cap. (The italic pull-quote now captions the hero
 * plate instead of sitting here.)
 */
export default function DescriptionBlock({
  description,
  dropcap = false,
}: {
  description?: string;
  dropcap?: boolean;
}) {
  const trimmed = description?.trim();
  const showDropcap = dropcap && trimmed && trimmed.length > 1;

  return (
    <div className="mb-8">
      {trimmed && (
        showDropcap ? (
          <DropCap>{trimmed}</DropCap>
        ) : (
          <p className="font-body text-[17px] sm:text-[18px] text-brown-dark leading-[1.75]">
            {trimmed}
          </p>
        )
      )}
    </div>
  );
}
