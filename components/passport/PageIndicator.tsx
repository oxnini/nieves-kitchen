'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import PassportHelpModal from './PassportHelpModal';

interface Props {
  count: number;
  index: number;
  onJump: (i: number) => void;
}

export default function PageIndicator({ count, index, onJump }: Props) {
  const [helpOpen, setHelpOpen] = useState(false);
  const mobile = useIsMobile();

  return (
    <>
      <div
        className="flex flex-wrap items-center justify-center gap-1.5 mt-6"
        role="tablist"
        aria-label="Passport pages"
      >
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          aria-label="How your passport works"
          className="mr-1 w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-brown-medium hover:text-terracotta hover:bg-brown-light/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <HelpCircle size={16} aria-hidden />
        </button>

        {mobile ? (
          <span className="text-sm text-brown-medium font-body tabular-nums">
            {index + 1} / {count}
          </span>
        ) : (
          Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to page ${i + 1}`}
              onClick={() => onJump(i)}
              className="relative flex items-center justify-center w-6 h-6"
            >
              <span
                className={`block rounded-full transition-all ${
                  i === index
                    ? 'w-6 h-2 bg-terracotta'
                    : 'w-2 h-2 bg-brown-light/60 hover:bg-brown-medium'
                }`}
              />
            </button>
          ))
        )}
      </div>

      <PassportHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
