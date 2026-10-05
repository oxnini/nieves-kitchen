/**
 * Canonical origin for absolute URLs: share images, the sitemap, recipe
 * JSON-LD. Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the production domain
 * (a custom domain, once one is attached), so this follows the live site
 * without a code change. Local dev falls back to the vercel.app address.
 */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://nieves-kitchen.vercel.app';

export const SITE_NAME = "Nieves's Kitchen";

export const SITE_DESCRIPTION = 'Recipes from around the world, cooked at home. Every one halal.';

/** Absolute URL for a site path or an already-absolute (remote) URL. */
export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : new URL(pathOrUrl, SITE_URL).toString();
}
