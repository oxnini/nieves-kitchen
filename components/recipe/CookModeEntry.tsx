'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { useModalScrollRef } from './ModalScrollContext';

interface Props {
  onEnter: () => void;
  inModal?: boolean;
}

/**
 * The cook-mode doorway. Sits between the editorial intro and the
 * ingredients/instructions spread, where the cook is deciding to start.
 *
 * Styled as a torn ticket: a stub printed with "COOK" in stamp mono, a
 * perforated edge, then the label and a Start affordance. It reads as the
 * obvious next move without shouting, and its identity comes from typography
 * and the ticket edge rather than a pictorial icon. Fades up once as it scrolls
 * into view (anchored to the modal scroll container when inside the modal), so
 * it announces itself without any scroll-coupled motion.
 */
export default function CookModeEntry({ onEnter, inModal = false }: Props) {
  const modalScrollRef = useModalScrollRef();

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6, root: inModal ? modalScrollRef ?? undefined : undefined }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={onEnter}
        aria-label="Enter cook mode"
        className="group w-full flex items-stretch text-left rounded-xl border border-brown-light/25 bg-surface shadow-sm overflow-hidden transition-[box-shadow,border-color,transform] hover:shadow-md hover:border-terracotta/45 active:scale-[0.995] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        {/* Ticket stub: "COOK" printed down the tab, a perforation as the tear. */}
        <span className="relative w-12 shrink-0 bg-terracotta/[0.14] flex items-center justify-center">
          <span
            className="font-stamp text-[13px] uppercase tracking-[0.3em] text-terracotta leading-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            Cook
          </span>
          <span
            aria-hidden="true"
            className="absolute right-0 inset-y-0 w-px border-r border-dashed border-brown-light/45"
          />
        </span>

        <span className="flex-1 flex items-center justify-between gap-3 px-4 py-3">
          <span className="min-w-0">
            <span className="block font-heading text-base font-semibold text-brown-dark">
              Cook mode
            </span>
            <span className="block text-[13px] text-brown-medium leading-snug">
              Step-by-step and hands-free. The screen stays awake.
            </span>
          </span>
          <span className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-terracotta">
            Start
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </button>
    </motion.div>
  );
}
