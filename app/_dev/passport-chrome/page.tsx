'use client';

import { X } from 'lucide-react';
import InkMark from '@/components/passport/InkMark';
import CloseInkMark from '@/components/passport/CloseInkMark';
import HelpInkMark from '@/components/passport/HelpInkMark';
import PageTurnInkMark from '@/components/passport/PageTurnInkMark';

const STROKE = 1.25;

const BACKGROUNDS = [
  {
    label: 'Parchment',
    className: 'bg-parchment passport-light',
  },
  {
    label: 'Sepia',
    className: 'bg-parchment',
    dataTheme: 'sepia' as const,
  },
  {
    label: 'Region photo',
    className: 'bg-parchment',
    image: '/passport-bg/africa.webp',
  },
];

function Frame({
  bg,
  children,
}: {
  bg: (typeof BACKGROUNDS)[number];
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme={bg.dataTheme}
      className={`relative w-[260px] h-[260px] rounded-xl overflow-hidden border border-brown-light/30 ${bg.className}`}
      style={
        bg.image ? { backgroundImage: `url(${bg.image})`, backgroundSize: 'cover' } : undefined
      }
    >
      {children}
    </div>
  );
}

export default function PassportChromeDev() {
  return (
    <div className="min-h-screen bg-parchment-dark p-8 space-y-10">
      <h1 className="font-heading text-2xl text-brown-dark">Passport chrome — visual checks</h1>

      <Section title="InkMark primitive — states">
        <Row>
          {BACKGROUNDS.map(bg => (
            <Frame key={bg.label} bg={bg}>
              <Caption>{bg.label} · resting / hover / focus / disabled</Caption>
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 place-items-center">
                <InkMark glyph={<X strokeWidth={STROKE} size={16} />} label="Resting" />
                <InkMark
                  glyph={<X strokeWidth={STROKE} size={16} />}
                  label="Hover"
                  className="opacity-[0.85]"
                />
                <InkMark
                  glyph={<X strokeWidth={STROKE} size={16} />}
                  label="Focus"
                  className="opacity-[0.85] ring-2 ring-terracotta"
                />
                <InkMark glyph={<X strokeWidth={STROKE} size={16} />} label="Disabled" disabled />
              </div>
            </Frame>
          ))}
        </Row>
      </Section>

      <Section title="CloseInkMark — top-right corner">
        <Row>
          {BACKGROUNDS.map(bg => (
            <Frame key={bg.label} bg={bg}>
              <Caption>{bg.label}</Caption>
              <CloseInkMark onClose={() => {}} className="absolute top-4 right-4" />
            </Frame>
          ))}
        </Row>
      </Section>

      <Section title="HelpInkMark — top-left corner">
        <Row>
          {BACKGROUNDS.map(bg => (
            <Frame key={bg.label} bg={bg}>
              <Caption>{bg.label}</Caption>
              <HelpInkMark className="absolute top-4 left-4" />
            </Frame>
          ))}
        </Row>
      </Section>

      <Section title="PageTurnInkMark — bottom corners (left enabled, right disabled)">
        <Row>
          {BACKGROUNDS.map(bg => (
            <Frame key={bg.label} bg={bg}>
              <Caption>{bg.label}</Caption>
              <PageTurnInkMark direction="prev" onClick={() => {}} className="absolute bottom-4 left-4" />
              <PageTurnInkMark
                direction="next"
                onClick={() => {}}
                disabled
                className="absolute bottom-4 right-4"
              />
            </Frame>
          ))}
        </Row>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-lg text-brown-dark">{title}</h2>
      {children}
    </section>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-6">{children}</div>;
}
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-2 left-2 text-[10px] uppercase tracking-[0.2em] text-brown-medium font-stamp z-10">
      {children}
    </div>
  );
}
