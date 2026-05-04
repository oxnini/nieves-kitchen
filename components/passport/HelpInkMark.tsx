'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import InkMark from './InkMark';
import PassportHelpModal from './PassportHelpModal';

interface Props {
  className?: string;
  hitSize?: number;
  size?: number;
}

export default function HelpInkMark({ className, hitSize, size = 20 }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <InkMark
        glyph={<HelpCircle strokeWidth={1.5} size={size} />}
        label="How your passport works"
        onClick={() => setOpen(true)}
        className={className}
        size={size}
        hitSize={hitSize}
        aria-haspopup="dialog"
        aria-expanded={open || undefined}
      />
      <PassportHelpModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
