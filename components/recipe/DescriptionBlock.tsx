'use client';

import { DropCap } from '@/components/courtyard';

/**
 * The editorial intro block: italic pull-quote (Fraunces) + drop-cap-able description.
 * `dropcap` is opt-in per recipe to keep the type discipline tight; when set, the
 * intro opens with the Courtyard terracotta drop cap (one of the two signatures).
 */
export default function DescriptionBlock({
  quote,
  description,
  dropcap = false,
}: {
  quote: string;
  description?: string;
  dropcap?: boolean;
}) {
  const trimmed = description?.trim();
  const showDropcap = dropcap && trimmed && trimmed.length > 1;

  return (
    <div className="mt-3 mb-6">
      <p className="font-heading italic text-brown-medium text-base sm:text-lg leading-relaxed mb-5">
        {quote}
      </p>
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
