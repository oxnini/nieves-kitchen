'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { useCookedStamps } from '@/hooks/useCookedStamps';
import { setPassportOrigin } from '@/lib/passport-origin';
import { TIER_BADGE_FILES } from '@/lib/passport';
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

const COVER_SRC = '/passport-stamp.webp';

// Must match next.config deviceSizes (Next default).
const NEXT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

function pickDeviceSize(targetPx: number): number {
  for (const size of NEXT_DEVICE_SIZES) {
    if (size >= targetPx) return size;
  }
  return NEXT_DEVICE_SIZES[NEXT_DEVICE_SIZES.length - 1];
}

function optimizedSrc(src: string, width: number, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

// Cover sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
function coverWidth(): number {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const vw = window.innerWidth;
  const css = vw <= 640 ? vw : vw <= 1024 ? vw * 0.8 : 600;
  return pickDeviceSize(Math.ceil(css * dpr));
}

// Wallpaper sizes: "(max-width: 640px) 100vw, 50vw"
function wallpaperWidth(): number {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const vw = window.innerWidth;
  const css = vw <= 640 ? vw : vw * 0.5;
  return pickDeviceSize(Math.ceil(css * dpr));
}

const prefetched = new Set<string>();
function prefetchOne(url: string) {
  if (prefetched.has(url)) return;
  prefetched.add(url);
  const img = new window.Image();
  img.decoding = 'async';
  img.src = url;
}

function prefetchPassportAssets(stampUrls: string[]) {
  if (typeof window === 'undefined') return;
  // Cover + wallpapers go through next/image, so warm the optimizer URL the
  // browser will actually request when CoverPage / Spread render.
  prefetchOne(optimizedSrc(COVER_SRC, coverWidth()));
  const wpW = wallpaperWidth();
  for (const bg of REGION_BG_FILES) prefetchOne(optimizedSrc(bg, wpW));
  // Country stamps render with `unoptimized`, so the raw /public URL is what
  // <Image> requests — warm that directly.
  for (const s of stampUrls) prefetchOne(s);
  // Tier badges in TierLedger also render unoptimized.
  for (const t of TIER_BADGE_FILES) prefetchOne(t);
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
    const run = () => prefetchPassportAssets(stampUrls);
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
  const prefetchNow = () => prefetchPassportAssets([]);

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
