import type { NextConfig } from 'next';

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://obkqmdlkllmfwujfqmnr.supabase.co",
  "connect-src 'self' https://obkqmdlkllmfwujfqmnr.supabase.co wss://obkqmdlkllmfwujfqmnr.supabase.co",
  "frame-src 'self' https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: cspDirectives.join('; '),
  },
];

const nextConfig: NextConfig = {
  // The recipe share image (app/recipes/[slug]/opengraph-image.tsx) reads the
  // dish photo from public/ at request time; public/ is served by the CDN and
  // is not bundled into functions unless listed here.
  outputFileTracingIncludes: {
    '/recipes/[slug]/opengraph-image': ['./public/recipes/**/*', './public/home/hero-courtyard.webp'],
  },
  // Next 15 supports per-package import optimization natively. This rewrites
  // `import { Foo } from 'lucide-react'` into a deep import of just the
  // `Foo` icon module, so tree-shaking actually drops the ~1k other icons.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    // No AVIF: measured 2026-10-10 against our WebP sources, it came out
    // roughly even (often larger) and is slower to encode on a cache miss.
    // Files in public/ are served with max-age=0, so without this the
    // optimizer's cache lasts only 60s and nearly every visit re-resizes
    // each photo. 31 days means a replaced photo MUST get a new filename
    // (e.g. <slug>-hero-2.webp), or visitors keep seeing the old one.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Dev only: /dev/hero-crop/trio frames the real recipe page side by side,
      // which DENY forbids even from the same origin. The last match wins, and
      // /dev 404s in production anyway.
      ...(process.env.NODE_ENV === 'production'
        ? []
        : [{ source: '/dev/:path*', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] }]),
    ];
  },
};

export default nextConfig;
