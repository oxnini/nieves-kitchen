'use client';

/**
 * The editorial intro block: italic pull-quote (Literata) + drop-cap-able description.
 * `dropcap` is opt-in per recipe to keep the type discipline tight.
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
        <p className="font-body text-[17px] sm:text-[18px] text-brown-dark leading-[1.75]">
          {showDropcap ? (
            <>
              <span className="dropcap">{trimmed.charAt(0)}</span>
              {trimmed.slice(1)}
            </>
          ) : (
            trimmed
          )}
        </p>
      )}
    </div>
  );
}
