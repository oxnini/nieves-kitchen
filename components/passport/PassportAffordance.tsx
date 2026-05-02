'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { useCookedStamps } from '@/hooks/useCookedStamps';
import { setPassportOrigin } from '@/lib/passport-origin';
import { getCustomStampSrc } from '@/lib/passport-stamps';
import { usePassportOverlay } from './PassportOverlay';

const REGION_BG_FILES = [
  '/passport-bg/western-europe.webp',
  '/passport-bg/eastern-europe.webp',
  '/passport-bg/east-asia.webp',
  '/passport-bg/southeast-asia.webp',
  '/passport-bg/south-asia.webp',
  '/passport-bg/middle-east.webp',
  '/passport-bg/north-africa.webp',
  '/passport-bg/sub-saharan-africa.webp',
  '/passport-bg/north-america.webp',
  '/passport-bg/south-america.webp',
  '/passport-bg/oceania.webp',
];

const STATIC_PASSPORT_ASSETS = ['/passport-stamp.webp', ...REGION_BG_FILES];

const prefetched = new Set<string>();
function prefetchUrls(urls: string[]) {
  if (typeof window === 'undefined') return;
  for (const src of urls) {
    if (prefetched.has(src)) continue;
    prefetched.add(src);
    const img = new window.Image();
    img.decoding = 'async';
    img.src = src;
  }
}

export default function PassportAffordance() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { summary } = useCookedStamps();
  const { open } = usePassportOverlay();
  const stampCount = summary.totalStamps;
  const displayCount = stampCount > 99 ? '99+' : String(stampCount);

  // After the page is idle, warm the browser cache with passport assets so
  // they're already loaded by the time the user opens the booklet. Includes
  // the user's collected country stamps in addition to the cover and wallpapers.
  useEffect(() => {
    const stampUrls = Array.from(summary.stampsPerCountry.keys())
      .map((country) => getCustomStampSrc(country))
      .filter((u): u is string => u !== null);
    const allUrls = [...STATIC_PASSPORT_ASSETS, ...stampUrls];
    const run = () => prefetchUrls(allUrls);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(run, { timeout: 2000 });
    } else {
      const t = window.setTimeout(run, 1500);
      return () => window.clearTimeout(t);
    }
  }, [summary.stampsPerCountry]);

  // Also fire on hover/focus — so even users who click immediately get a head
  // start while the click handler runs and the booklet mounts.
  const prefetchNow = () => prefetchUrls(STATIC_PASSPORT_ASSETS);

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
      onPointerEnter={prefetchNow}
      onFocus={prefetchNow}
      title="Passport"
      aria-label={
        stampCount > 0
          ? `Passport, ${stampCount} stamp${stampCount !== 1 ? 's' : ''}`
          : 'Passport'
      }
      className="
        group relative inline-flex items-center justify-center gap-0
        min-w-[44px] h-16 px-2 sm:px-4
        bg-transparent cursor-pointer
        transition-transform duration-150
        hover:scale-105 active:scale-[0.96]
      "
    >
      <Image
        src="/passport-icon.webp"
        alt=""
        width={112}
        height={112}
        sizes="62px"
        priority
        unoptimized
        className="h-[62px] w-[62px] object-contain self-center translate-y-[3px]"
      />
      {stampCount > 0 && (
        <span className="font-stamp font-bold text-sm text-terracotta nums-tabular tracking-[0.04em] translate-y-[3px] -ml-1">
          {displayCount}
        </span>
      )}
    </button>
  );
}
