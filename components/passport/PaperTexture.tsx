'use client';

export default function PaperTexture() {
  return (
    <svg aria-hidden="true" className="absolute w-0 h-0 pointer-events-none">
      <defs>
        <filter id="passport-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.28
                    0 0 0 0 0.20
                    0 0 0 0 0.12
                    0 0 0 0.08 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        <filter id="passport-deckle">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>

        <filter id="stamp-ink">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.92 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
