'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  disabled: boolean;
}

export default function NavChevrons({ canPrev, canNext, onPrev, onNext, disabled }: Props) {
  const base =
    'absolute top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full ' +
    'bg-parchment shadow-lg border border-brown-light/40 text-brown-dark passport-paper ' +
    'flex items-center justify-center transition ' +
    'hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ' +
    'disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <>
      <button
        type="button"
        aria-label="Previous page"
        onClick={onPrev}
        disabled={!canPrev || disabled}
        className={`${base} -left-4 md:-left-8`}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        aria-label="Next page"
        onClick={onNext}
        disabled={!canNext || disabled}
        className={`${base} -right-4 md:-right-8`}
      >
        <ChevronRight size={22} />
      </button>
    </>
  );
}
