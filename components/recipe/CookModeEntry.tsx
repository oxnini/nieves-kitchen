'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/courtyard';
import { useModalScrollRef } from './ModalScrollContext';

interface Props {
  onEnter: () => void;
  inModal?: boolean;
}

/**
 * The cook-mode doorway. Sits between the editorial intro and the
 * ingredients/method spread, where the cook is deciding to start.
 *
 * A teal primary "Start cooking" button with its one-line hint beside it: the
 * obvious next move without shouting. Fades up once as it scrolls into view
 * (anchored to the modal scroll container when inside the modal), so it
 * announces itself without any scroll-coupled motion.
 */
export default function CookModeEntry({ onEnter, inModal = false }: Props) {
  const modalScrollRef = useModalScrollRef();

  return (
    <motion.div
      className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6, root: inModal ? modalScrollRef ?? undefined : undefined }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Button variant="primary" onClick={onEnter}>
        Start cooking
      </Button>
      <p className="text-[13px] leading-snug text-brown-medium">
        Step by step and hands-free. The screen stays awake.
      </p>
    </motion.div>
  );
}
