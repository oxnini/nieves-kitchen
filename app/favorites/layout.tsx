import type { Metadata } from 'next';

// The page is a client component and can't export metadata itself.
export const metadata: Metadata = {
  title: "Favorites · Nieves's Kitchen",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
