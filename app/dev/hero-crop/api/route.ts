import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

/**
 * Backend for `/dev/hero-crop`. Dev only: every handler 404s in production
 * (route handlers are not covered by `app/dev/layout.tsx`, so it is checked
 * here too).
 *
 * GET  ?list=1          recent images in ~/Downloads
 * GET  ?src=<name>&rot= the source image, rotated clockwise by `rot` degrees
 * POST {src, rot, slug, x, y, w, h, variant?}
 *                       crops the source and writes public/recipes/<slug>-hero.webp,
 *                       or <slug>-hero-<a|b>.webp for a variant (compare slots
 *                       for ../compare; never committed)
 */

const run = promisify(execFile);
const DOWNLOADS = path.join(os.homedir(), 'Downloads');
const TMP = path.join(os.tmpdir(), 'nk-hero-crop');
const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;
const SLUG = /^[a-z0-9-]+$/;
const ROTATIONS = new Set([0, 90, 180, 270]);
const MAX_WIDTH = 2400;

const notFound = () => new NextResponse(null, { status: 404 });
const isProd = () => process.env.NODE_ENV === 'production';

/** A bare file name inside ~/Downloads, never a path. */
function sourcePath(name: unknown): string | null {
  if (typeof name !== 'string' || path.basename(name) !== name || !IMAGE_EXT.test(name)) return null;
  return path.join(DOWNLOADS, name);
}

/** The source as a PNG rotated clockwise, cached in the OS temp dir. */
async function rotated(src: string, rot: number): Promise<string> {
  if (rot === 0) return src;
  await mkdir(TMP, { recursive: true });
  const out = path.join(TMP, `${rot}-${path.basename(src)}.png`);
  await run('sips', ['-s', 'format', 'png', '-r', String(rot), src, '--out', out]);
  return out;
}

export async function GET(req: NextRequest) {
  if (isProd()) return notFound();
  const params = req.nextUrl.searchParams;

  if (params.has('list')) {
    const names = (await readdir(DOWNLOADS)).filter((n) => IMAGE_EXT.test(n));
    const withTimes = await Promise.all(
      names.map(async (name) => ({ name, mtime: (await stat(path.join(DOWNLOADS, name))).mtimeMs })),
    );
    withTimes.sort((a, b) => b.mtime - a.mtime);
    return NextResponse.json(withTimes.slice(0, 30).map((f) => f.name));
  }

  const src = sourcePath(params.get('src'));
  const rot = Number(params.get('rot') ?? 0);
  if (!src || !ROTATIONS.has(rot)) return notFound();
  const file = await rotated(src, rot);
  const ext = path.extname(file).slice(1).toLowerCase();
  const type = ext === 'jpg' ? 'jpeg' : ext;
  return new NextResponse(new Uint8Array(await readFile(file)), {
    headers: { 'Content-Type': `image/${type}`, 'Cache-Control': 'no-store' },
  });
}

export async function POST(req: NextRequest) {
  if (isProd()) return notFound();
  const body = await req.json();
  const src = sourcePath(body.src);
  const rot = Number(body.rot ?? 0);
  const [x, y, w, h] = [body.x, body.y, body.w, body.h].map((n) => Math.round(Number(n)));
  const variant = body.variant ?? '';
  if (!src || !ROTATIONS.has(rot) || typeof body.slug !== 'string' || !SLUG.test(body.slug) || !['', 'a', 'b'].includes(variant)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
  if (![x, y, w, h].every(Number.isFinite) || x < 0 || y < 0 || w < 1 || h < 1) {
    return NextResponse.json({ error: 'bad crop' }, { status: 400 });
  }

  const file = await rotated(src, rot);
  const rel = `public/recipes/${body.slug}-hero${variant ? `-${variant}` : ''}.webp`;
  const out = path.join(process.cwd(), rel);
  const outW = Math.min(w, MAX_WIDTH);
  const args = ['-q', '85', '-metadata', 'none', '-crop', String(x), String(y), String(w), String(h)];
  if (outW < w) args.push('-resize', String(outW), '0');
  await run('cwebp', [...args, file, '-o', out]);

  return NextResponse.json({
    path: rel,
    width: outW,
    height: Math.round((h * outW) / w),
    bytes: (await stat(out)).size,
  });
}
