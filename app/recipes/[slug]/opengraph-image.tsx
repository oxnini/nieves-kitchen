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

async function load(src: string): Promise<Buffer> {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`${res.status} for ${src}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(path.join(process.cwd(), 'public', src));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const data = await getRecipe(slug);

  let source: Buffer;
  try {
    source = await load(data?.image_url || FALLBACK);
  } catch (err) {
    console.error('[opengraph-image]', slug, err);
    source = await load(FALLBACK);
  }

  const jpeg = await sharp(source)
    .resize(size.width, size.height, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': contentType },
  });
}
