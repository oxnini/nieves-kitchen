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
      glyph={<X strokeWidth={1.25} size={16} />}
      label="Close passport"
      onClick={onClose}
      className={className}
      size={16}
    />
  );
});

export default CloseInkMark;
