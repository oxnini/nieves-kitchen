import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { getRecipe } from '@/lib/recipes/get';

/**
 * The share image for a recipe link: the dish photo, cropped to 1200x630 and
 * re-encoded as JPEG. No text on the photo (paper carries text, not photos);
 * the chat app prints the title and quote beside it.
 *
 * Re-encoded because the photos are WebP, which some link previewers still
 * skip, and which next/og's renderer cannot read. Local photos are read from
 * public/ (traced into this function via outputFileTracingIncludes in
 * next.config.ts); stock photos are fetched. Anything that fails falls back to
 * the courtyard painting rather than a blank card.
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';
export const alt = "A dish from Nieves's Kitchen";

const FALLBACK = '/home/hero-courtyard.webp';

/**
 * Where to centre the crop, as a fraction of the photo's height, for photos
 * whose main subject the automatic crop misses. A portrait photo loses most of
 * its height to a 1200x630 frame, and 'attention' goes for the most detailed
 * area: on Turkish Eggs that is the bread, not the eggs.
 *
 * Keyed by image path, not slug, so a replacement photo (always a new
 * filename) drops back to the automatic crop instead of inheriting a focus
 * picked for the old one.
 */
const FOCUS_Y: Record<string, number> = {
  '/recipes/turkish-eggs-hero.webp': 0.55,
};

async function load(src: string): Promise<Buffer> {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`${res.status} for ${src}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(path.join(process.cwd(), 'public', src));
}

/** Cover-crop to the share size, centred vertically on focusY. */
async function cropAt(source: Buffer, focusY: number) {
  const { width = size.width, height = size.height } = await sharp(source).metadata();
  const scale = Math.max(size.width / width, size.height / height);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const top = Math.round(focusY * h - size.height / 2);
  return sharp(source)
    .resize(w, h)
    .extract({
      left: Math.round((w - size.width) / 2),
      top: Math.min(Math.max(top, 0), h - size.height),
      width: size.width,
      height: size.height,
    });
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const data = await getRecipe(slug);

  let src = data?.image_url || FALLBACK;
  let source: Buffer;
  try {
    source = await load(src);
  } catch (err) {
    console.error('[opengraph-image]', slug, err);
    src = FALLBACK;
    source = await load(FALLBACK);
  }

  const focusY = FOCUS_Y[src];
  const cropped =
    focusY === undefined
      ? sharp(source).resize(size.width, size.height, { fit: 'cover', position: 'attention' })
      : await cropAt(source, focusY);
  const jpeg = await cropped
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': contentType },
  });
}
