import type { Metadata } from 'next';
import CatalogueBoundary from '@/components/CatalogueBoundary';

// The page is a client component and can't export metadata itself.
export const metadata: Metadata = {
  title: "The atlas · Nieves's Kitchen",
};

// The map is drawn in the browser, but the recipes it plots ship with the
// page instead of waiting on a Supabase call after hydration (audit F5).
// Static, rebuilt at most every 5 minutes (= CATALOGUE_REVALIDATE).
export const revalidate = 300;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CatalogueBoundary>{children}</CatalogueBoundary>;
}
