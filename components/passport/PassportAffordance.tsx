'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCookedStamps } from '@/hooks/useCookedStamps';
import { useJournalPrefetch } from '@/hooks/useJournalPrefetch';

/**
 * The retired passport-stamp nav icon. No longer mounted in the live navbar
 * (the "Journal" text link replaced it, phase 2 task 2.4); only the
 * /dev/floating-navbar sandbox still renders it. It shares the Journal link's
 * prefetch hook, which warms only what /journal renders. The booklet cover and
 * region wallpapers it used to warm belong to the retired booklet.
 */
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
  const { summary } = useCookedStamps();
  const stampCount = summary.totalStamps;
  const displayCount = stampCount > 99 ? '99+' : String(stampCount);
  const active = pathname.startsWith('/journal');

  const prefetch = useJournalPrefetch();

  return (
    <Link
      href="/journal"
      {...prefetch}
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
            ? 'h-9 w-9 object-contain self-center rounded-full'
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
