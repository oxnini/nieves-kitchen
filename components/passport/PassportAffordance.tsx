'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Stamp } from 'lucide-react';

import { useCookedStamps } from '@/hooks/useCookedStamps';
import { setPassportOrigin } from '@/lib/passport-origin';

export default function PassportAffordance() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { summary } = useCookedStamps();
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
    router.push('/passport');
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
        inline-flex items-center justify-center gap-1.5
        min-w-[44px] h-10 px-2.5
        rounded-md border border-terracotta/70 bg-parchment
        text-brown-dark
        transition-transform duration-75
        active:scale-[0.94] active:shadow-inner
        hover:border-terracotta
      "
    >
      <Stamp size={18} strokeWidth={1.6} />
      {stampCount > 0 && (
        <span className="font-stamp text-sm text-terracotta nums-tabular tracking-[0.04em]">
          {displayCount}
        </span>
      )}
    </button>
  );
}
