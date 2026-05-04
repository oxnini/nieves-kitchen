'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import InkMark from './InkMark';

interface Props {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function PageTurnInkMark({ direction, onClick, disabled, className }: Props) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  const label = direction === 'prev' ? 'Previous page' : 'Next page';
  return (
    <InkMark
      glyph={<Icon strokeWidth={2} size={52} />}
      label={label}
      onClick={onClick}
      disabled={disabled}
      className={className}
      size={52}
      hitSize={64}
      variant="translucent"
    />
  );
}
