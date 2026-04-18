'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  side: 'left' | 'right';
  isFlipping: boolean;
  direction: 1 | -1;
  flipped: boolean;
  className?: string;
}

export default function Page({
  children, side, isFlipping, direction, flipped, className = '',
}: Props) {
  const reduced = useReducedMotion();
  const originClass = side === 'left' ? 'origin-right' : 'origin-left';

  if (reduced) {
    return (
      <motion.div
        className={`relative h-full w-full ${className}`}
        animate={{ opacity: isFlipping ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  const rotateY =
    side === 'right'
      ? (flipped ? -180 : 0)
      : (flipped ? 180 : 0);

  return (
    <motion.div
      className={`relative h-full w-full ${originClass} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      animate={{ rotateY }}
      transition={{
        duration: direction === 1 ? 0.6 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
      {isFlipping && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-${side === 'left' ? 'l' : 'r'} from-black/30 via-transparent to-transparent rounded-lg`}
        />
      )}
    </motion.div>
  );
}
