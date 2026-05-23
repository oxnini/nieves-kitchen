'use client';

import { ChefHat, BookOpen } from 'lucide-react';

interface Props {
  mode: 'read' | 'cook';
  onToggle: () => void;
}

/**
 * Sticky top-right pill that flips between read and cook modes. Always
 * visible on the recipe surface; the editorial chrome above it does the work
 * of framing the page as a cookbook first.
 */
export default function CookModeToggle({ mode, onToggle }: Props) {
  return (
    <div className="pointer-events-none sticky top-20 z-40 flex justify-end">
      <button
        type="button"
        onClick={onToggle}
        className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/95 backdrop-blur-sm border border-brown-light/25 text-brown-dark text-sm font-medium shadow-sm hover:bg-parchment-dark hover:border-brown-light/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        aria-pressed={mode === 'cook'}
        aria-label={mode === 'cook' ? 'Switch to read mode' : 'Switch to cook mode'}
      >
        {mode === 'cook' ? (
          <>
            <BookOpen size={15} className="text-brown-medium" />
            Read mode
          </>
        ) : (
          <>
            <ChefHat size={15} className="text-terracotta" />
            Cook mode
          </>
        )}
      </button>
    </div>
  );
}
