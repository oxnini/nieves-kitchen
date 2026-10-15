import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // /dev is the design sandbox (404s in production anyway); /journal and
    // /saved are per-visitor and hold nothing worth indexing.
    rules: { userAgent: '*', allow: '/', disallow: ['/dev/', '/journal', '/saved', '/favorites'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
