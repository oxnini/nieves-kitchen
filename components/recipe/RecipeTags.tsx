'use client';

/**
 * The recipe's tags as quiet pills under the lede. Nutrition and the dietary
 * line moved up into the header (ServingFacts), and the flavour compass was
 * retired (spec 2026-09-25 §8), so this is all that is left of the old info
 * block.
 */
export default function RecipeTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="mb-10 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="text-[13px] font-medium px-3 py-1 rounded-full ring-1 ring-line text-brown-medium"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
