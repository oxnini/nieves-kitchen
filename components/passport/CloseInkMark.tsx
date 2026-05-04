'use client';

import { X } from 'lucide-react';
import InkMark from './InkMark';

interface Props {
  onClose: () => void;
  className?: string;
}

export default function CloseInkMark({ onClose, className }: Props) {
  return (
    <InkMark
      glyph={<X strokeWidth={1.25} size={16} />}
      label="Close passport"
      onClick={onClose}
      className={className}
      size={16}
    />
  );
}
