// Must match next.config deviceSizes (Next default).
const NEXT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

export function pickDeviceSize(targetPx: number): number {
  for (const size of NEXT_DEVICE_SIZES) {
    if (size >= targetPx) return size;
  }
  return NEXT_DEVICE_SIZES[NEXT_DEVICE_SIZES.length - 1];
}

export function optimizedSrc(src: string, width: number, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

const prefetched = new Set<string>();
export function prefetchOne(url: string) {
  if (prefetched.has(url)) return;
  prefetched.add(url);
  const img = new window.Image();
  img.decoding = 'async';
  img.src = url;
}

export function dpr(): number {
  return Math.min(window.devicePixelRatio || 1, 2);
}
