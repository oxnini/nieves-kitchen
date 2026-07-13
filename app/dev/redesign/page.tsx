'use client';

import { useEffect, useState } from 'react';
import GildedTable from './GildedTable';
import HeritageTable from './HeritageTable';
import KitchenJournal from './KitchenJournal';
import MosaicWall from './MosaicWall';
import PrintShop from './PrintShop';
import TiledTerrace from './TiledTerrace';
import Azulejo from './v2/Azulejo';
import Courtyard from './v2/Courtyard';
import GourmetPress from './v2/GourmetPress';
import Sunwashed from './v2/Sunwashed';

/**
 * /dev/redesign — design-language sandbox.
 *
 * Primary set (v2): design-language candidates. Each ships a Home screen and a
 * Recipe (cookbook) screen, toggled below.
 *   · Courtyard     — THE SYNTHESIS: Azulejo palette + Sunwashed arch + toned
 *                     Gourmet cards; tile as the brand primitive. (front-runner)
 *   · Sunwashed     — illustrative, warm-minimal; the palette-swatch world.
 *   · Azulejo       — editorial cookbook on a drawn cobalt tile system.
 *   · Gourmet Press — bold poster; big type over full-bleed photography.
 *
 * Legacy set: the earlier six explorations, kept reachable but demoted.
 * Static sample content only; no Supabase, captcha, or theme dependencies.
 */

const PRIMARY = [
  { key: 'courtyard', label: 'Courtyard ★' },
  { key: 'sunwashed', label: 'Sunwashed' },
  { key: 'azulejo', label: 'Azulejo' },
  { key: 'gourmet', label: 'Gourmet Press' },
] as const;

const LEGACY = [
  { key: 'heritage', label: 'A · Heritage Table' },
  { key: 'print', label: 'B · Print Shop' },
  { key: 'gilded', label: 'C · Gilded Table' },
  { key: 'terrace', label: 'D · Tiled Terrace' },
  { key: 'mosaic', label: 'E · Mosaic Wall' },
  { key: 'journal', label: 'F · Kitchen Journal' },
] as const;

type PrimaryKey = (typeof PRIMARY)[number]['key'];
type LegacyKey = (typeof LEGACY)[number]['key'];
type DirectionKey = PrimaryKey | LegacyKey;
type Screen = 'home' | 'recipe';

const PRIMARY_KEYS = PRIMARY.map((d) => d.key) as readonly PrimaryKey[];
const ALL_KEYS = [...PRIMARY_KEYS, ...LEGACY.map((d) => d.key)] as readonly DirectionKey[];

function isPrimary(key: DirectionKey): key is PrimaryKey {
  return (PRIMARY_KEYS as readonly string[]).includes(key);
}

export default function DevRedesignPage() {
  const [dir, setDir] = useState<DirectionKey>('courtyard');
  const [screen, setScreen] = useState<Screen>('home');

  // Deep-link a variant via ?d=<key> and screen via ?s=home|recipe.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('d');
    const s = params.get('s');
    if (d && (ALL_KEYS as readonly string[]).includes(d)) setDir(d as DirectionKey);
    if (s === 'home' || s === 'recipe') setScreen(s);
  }, []);

  const showScreenToggle = isPrimary(dir);

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Dev chrome: deliberately neutral so it reads as scaffolding, not design */}
      <div className="sticky top-0 z-[60] flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-neutral-700 bg-neutral-900 px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-wide text-neutral-500 uppercase">/dev/redesign</span>

        {/* Primary language tabs */}
        <div className="flex flex-wrap gap-1.5">
          {PRIMARY.map((d) => (
            <button
              key={d.key}
              onClick={() => setDir(d.key)}
              className={`rounded px-4 py-1.5 font-mono text-[12px] transition-colors ${
                dir === d.key ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Home / Recipe screen toggle (primary set only) */}
        {showScreenToggle && (
          <div className="flex overflow-hidden rounded border border-neutral-700">
            {(['home', 'recipe'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScreen(s)}
                className={`px-3 py-1.5 font-mono text-[11px] capitalize transition-colors ${
                  screen === s ? 'bg-amber-400/90 text-neutral-900' : 'text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Legacy set, demoted */}
        <details className="ml-auto">
          <summary className="cursor-pointer list-none font-mono text-[11px] text-neutral-500 hover:text-neutral-300">
            legacy ▾
          </summary>
          <div className="absolute right-4 z-[70] mt-2 flex flex-col gap-1 rounded border border-neutral-700 bg-neutral-900 p-2 shadow-xl">
            {LEGACY.map((d) => (
              <button
                key={d.key}
                onClick={() => setDir(d.key)}
                className={`rounded px-3 py-1.5 text-left font-mono text-[11px] transition-colors ${
                  dir === d.key ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </details>
      </div>

      {/* Primary languages */}
      {dir === 'courtyard' && <Courtyard screen={screen} />}
      {dir === 'sunwashed' && <Sunwashed screen={screen} />}
      {dir === 'azulejo' && <Azulejo screen={screen} />}
      {dir === 'gourmet' && <GourmetPress screen={screen} />}

      {/* Legacy */}
      {dir === 'heritage' && <HeritageTable />}
      {dir === 'print' && <PrintShop />}
      {dir === 'gilded' && <GildedTable />}
      {dir === 'terrace' && <TiledTerrace />}
      {dir === 'mosaic' && <MosaicWall />}
      {dir === 'journal' && <KitchenJournal />}
    </div>
  );
}
