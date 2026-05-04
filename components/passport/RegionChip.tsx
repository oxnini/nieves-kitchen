'use client';

import { forwardRef } from 'react';

interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
}

const RegionChip = forwardRef<HTMLButtonElement, Props>(function RegionChip(
  { label, active, onClick },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        'group relative inline-flex items-center justify-center px-3 py-2.5',
        'text-sm font-body whitespace-nowrap snap-center',
        'transition-colors duration-150 motion-reduce:transition-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm',
        active ? 'text-brown-dark' : 'text-brown-medium hover:text-brown-dark',
      ].join(' ')}
    >
      {label}
      {active && (
        <span
          aria-hidden
          className="absolute left-2 right-2 -bottom-[2px] h-[2.4px] bg-terracotta rounded-full"
        />
      )}
    </button>
  );
});

export default RegionChip;
