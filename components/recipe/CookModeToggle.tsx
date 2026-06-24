'use client';

import { ChefHat, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

import { useModalScrollRef } from './ModalScrollContext';

interface Props {
  mode: 'read' | 'cook';
  onToggle: () => void;
  inModal?: boolean;
}

/**
 * Quiet, in-flow control that enters cook mode. It sits just above the
 * ingredients/instructions, where the cook is deciding to start. Rather than
 * pinning and sliding on scroll (which reads as a glitch on a free-floating
 * button), it scrolls naturally with the page and gently fades up *once* as it
 * comes into view, so it announces itself without any scroll-coupled motion.
 */
export default function CookModeToggle({ mode, onToggle, inModal = false }: Props) {
  // In the modal the recipe scrolls inside the modal's overflow container, so
  // anchor the in-view trigger to that container; otherwise use the window.
  const modalScrollRef = useModalScrollRef();

  return (
    <motion.div
      className="flex justify-end mb-1"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6, root: inModal ? modalScrollRef ?? undefined : undefined }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface/85 backdrop-blur-sm border border-brown-light/25 text-brown-medium text-sm font-medium hover:bg-surface hover:border-brown-light/40 hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
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
    </motion.div>
  );
}
