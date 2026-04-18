'use client';

interface Props {
  count: number;
  index: number;
  onJump: (i: number) => void;
}

export default function PageIndicator({ count, index, onJump }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6" role="tablist" aria-label="Passport pages">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === index}
          aria-label={`Go to page ${i + 1}`}
          onClick={() => onJump(i)}
          className={`h-2 rounded-full transition-all ${
            i === index
              ? 'w-6 bg-terracotta'
              : 'w-2 bg-brown-light/60 hover:bg-brown-medium'
          }`}
        />
      ))}
    </div>
  );
}
