'use client';

import { useRef } from 'react';
import Image from 'next/image';

import { useCookedStamps } from '@/hooks/useCookedStamps';
import { setPassportOrigin } from '@/lib/passport-origin';
import { usePassportOverlay } from './PassportOverlay';

export default function PassportAffordance() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { summary } = useCookedStamps();
  const { open } = usePassportOverlay();
  const stampCount = summary.totalStamps;
  const displayCount = stampCount > 99 ? '99+' : String(stampCount);

  function handleClick() {
    const el = buttonRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setPassportOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    }
    open();
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      title="Passport"
      aria-label={
        stampCount > 0
          ? `Passport, ${stampCount} stamp${stampCount !== 1 ? 's' : ''}`
          : 'Passport'
      }
      className="
        group relative inline-flex items-center justify-center gap-1.5
        min-w-[44px] h-16 px-2 sm:px-4
        bg-transparent cursor-pointer
        transition-transform duration-150
        hover:scale-105 active:scale-[0.96]
      "
    >
      <Image
        src="/passport-icon.png"
        alt=""
        width={112}
        height={112}
        priority
        className="h-14 w-14 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
      />
      {stampCount > 0 && (
        <span className="font-stamp text-sm text-terracotta nums-tabular tracking-[0.04em]">
          {displayCount}
        </span>
      )}
    </button>
  );
}
