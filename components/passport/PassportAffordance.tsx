'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useCookedStamps } from '@/hooks/useCookedStamps';
import { TIER_BADGE_FILES } from '@/lib/passport';
import { getCustomStampSrc } from '@/lib/passport-stamps';
import { dpr, optimizedSrc, pickDeviceSize, prefetchOne } from '@/lib/passport-prefetch';

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

// Cover sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
function coverWidth(): number {
  const vw = window.innerWidth;
  const css = vw <= 640 ? vw : vw <= 1024 ? vw * 0.8 : 600;
  return pickDeviceSize(Math.ceil(css * dpr()));
}

// Wallpaper sizes: "(max-width: 640px) 100vw, 50vw"
function wallpaperWidth(): number {
  const vw = window.innerWidth;
  const css = vw <= 640 ? vw : vw * 0.5;
  return pickDeviceSize(Math.ceil(css * dpr()));
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

interface PassportAffordanceProps {
  /**
   * Compact variant for the floating navbar pill. Shrinks the button and stamp
   * icon to ~36px square so it sits naturally beside ThemeToggle. The full-size
   * version stays in the legacy navbar snapshot at /dev/floating-navbar.
   */
  compact?: boolean;
}

export default function PassportAffordance({ compact = false }: PassportAffordanceProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { summary } = useCookedStamps();
  const stampCount = summary.totalStamps;
  const displayCount = stampCount > 99 ? '99+' : String(stampCount);
  const active = pathname.startsWith('/journal');

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
  // start while navigation is in flight. Also warm the /journal route chunk
  // itself so the transition feels instant.
  const prefetchNow = () => {
    prefetchPassportAssets([]);
    router.prefetch('/journal');
  };

  return (
    <Link
      href="/journal"
      onPointerEnter={prefetchNow}
      onFocus={prefetchNow}
      title="Cook's Journal"
      aria-current={active ? 'page' : undefined}
      aria-label={
        stampCount > 0
          ? `Cook's Journal, ${stampCount} stamp${stampCount !== 1 ? 's' : ''}`
          : "Cook's Journal"
      }
      className={
        compact
          ? `group relative inline-flex items-center justify-center gap-0
             min-w-[36px] h-9 px-1
             bg-transparent cursor-pointer
             transition-transform duration-150
             hover:scale-105 active:scale-[0.96]`
          : `group relative inline-flex items-center justify-center gap-0
             min-w-[44px] h-16 px-2 sm:px-4
             bg-transparent cursor-pointer
             transition-transform duration-150
             hover:scale-105 active:scale-[0.96]`
      }
    >
      <Image
        src="/passport-icon.webp"
        alt=""
        width={112}
        height={112}
        sizes={compact ? '36px' : '62px'}
        priority
        unoptimized
        className={
          compact
            ? 'h-9 w-9 object-contain self-center'
            : 'h-[62px] w-[62px] object-contain self-center translate-y-[3px]'
        }
      />
      {stampCount > 0 && (
        <span
          className={
            compact
              ? 'font-stamp font-bold text-xs text-terracotta nums-tabular tracking-[0.04em] -ml-0.5'
              : 'font-stamp font-bold text-sm text-terracotta nums-tabular tracking-[0.04em] translate-y-[3px] -ml-1'
          }
        >
          {displayCount}
        </span>
      )}
      {active && !compact && (
        <span
          aria-hidden="true"
          className="absolute -bottom-px left-3 right-3 sm:left-4 sm:right-4 h-[3px] bg-terracotta"
        />
      )}
    </Link>
  );
}
