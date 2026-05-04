'use client';

import { forwardRef } from 'react';
import { X } from 'lucide-react';
import InkMark from './InkMark';

interface Props {
  onClose: () => void;
  className?: string;
}

const CloseInkMark = forwardRef<HTMLButtonElement, Props>(function CloseInkMark(
  { onClose, className },
  ref,
) {
  return (
    <InkMark
      ref={ref}
      glyph={<X strokeWidth={1.5} size={20} />}
      label="Close passport"
      onClick={onClose}
      className={className}
      size={20}
    />
  );
});

export default CloseInkMark;
