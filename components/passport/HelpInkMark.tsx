'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import InkMark from './InkMark';
import PassportHelpModal from './PassportHelpModal';

interface Props {
  className?: string;
}

export default function HelpInkMark({ className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <InkMark
        glyph={<HelpCircle strokeWidth={1.5} size={20} />}
        label="How your passport works"
        onClick={() => setOpen(true)}
        className={className}
        size={20}
        aria-haspopup="dialog"
        aria-expanded={open || undefined}
      />
      <PassportHelpModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
